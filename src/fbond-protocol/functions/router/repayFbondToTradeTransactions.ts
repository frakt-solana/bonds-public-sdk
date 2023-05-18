import { BN, web3 } from '@project-serum/anchor';
import { ASSOCIATED_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token';
import { findAssociatedTokenAddress } from '../../../common';
import {
  ENCODER,
  METADATA_PROGRAM_PUBKEY,
  HADOMARKET_REGISTRY_PREFIX,
  AUTHORIZATION_RULES_PROGRAM,
  BOND_PROOGRAM_AUTHORITY_PREFIX,
  EMPTY_PUBKEY,
  COLLATERAL_BOX_PREFIX,
} from '../../constants';

import {
  anchorRawBNsAndPubkeysToNumsAndStrings,
  findTokenRecordPda,
  getMetaplexEditionPda,
  getMetaplexMetadata,
  getMetaplexMetadataPda,
  returnAnchorProgram,
} from '../../helpers';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';

export interface RepayAccounts {
  bondTradeTransaction: web3.PublicKey;
  user: web3.PublicKey;
  bondOffer: web3.PublicKey;
}

type RepayFbondToTradeTransactions = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;

  args: {
    repayAccounts: RepayAccounts[];
  };
  addComputeUnits?: boolean;

  accounts: {
    fbond: web3.PublicKey;
    fbondTokenMint: web3.PublicKey;

    collateralTokenMint: web3.PublicKey;
    collateralTokenAccount: web3.PublicKey;

    userPubkey: web3.PublicKey;
  };

  sendTxn: (transaction: web3.Transaction, signers: web3.Signer[]) => Promise<void>;
}) => Promise<{
  account: web3.PublicKey | null;
  instructions: web3.TransactionInstruction[];
  signers: web3.Signer[];
  addressesForLookupTable: web3.PublicKey[];
}>;

export const repayFbondToTradeTransactions: RepayFbondToTradeTransactions = async ({
  programId,
  connection,
  args,
  accounts,
  addComputeUnits,
  sendTxn,
}) => {
  const program = returnAnchorProgram(programId, connection);
  const instructions: web3.TransactionInstruction[] = [];

  const [bondProgramAuthority] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(BOND_PROOGRAM_AUTHORITY_PREFIX), accounts.fbond.toBuffer()],
    program.programId,
  );
  const [collateralBox] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(COLLATERAL_BOX_PREFIX), accounts.fbond.toBuffer(), ENCODER.encode('0')],
    program.programId,
  );
  const userTokenAccount = await findAssociatedTokenAddress(accounts.userPubkey, accounts.collateralTokenMint);
  // const collateralTokenAccount = await findAssociatedTokenAddress(bondProgramAuthority, accounts.collateralTokenMint);
  const editionInfo = getMetaplexEditionPda(accounts.collateralTokenMint);
  const nftMetadata = getMetaplexMetadata(accounts.collateralTokenMint);
  const ownerTokenRecord = findTokenRecordPda(accounts.collateralTokenMint, accounts.collateralTokenAccount);
  const destTokenRecord = findTokenRecordPda(accounts.collateralTokenMint, userTokenAccount);
  const meta = await Metadata.fromAccountAddress(connection, nftMetadata);
  const ruleSet = meta.programmableConfig?.ruleSet;

  const repayRemainingAccounts = args.repayAccounts
    .map((repayAccount) => {
      return [
        {
          pubkey: repayAccount.bondTradeTransaction,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: repayAccount.user,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: repayAccount.bondOffer,
          isSigner: false,
          isWritable: true,
        },
      ];
    })
    .flat();

  const modifyComputeUnits = web3.ComputeBudgetProgram.setComputeUnitLimit({
    units: Math.round(800000 + Math.ceil(Math.random() * 10000)),
  });
  const requestHeap = web3.ComputeBudgetProgram.requestHeapFrame({ bytes: 1024 * 250 });
  instructions.push(requestHeap);

  if (!!addComputeUnits) instructions.push(modifyComputeUnits);
  const accountsIntoInstruction = {
    collateralBox: collateralBox,
    fbond: accounts.fbond,
    bondProgramAuthority: bondProgramAuthority,

    tokenMint: accounts.collateralTokenMint,
    collateralTokenAccount: accounts.collateralTokenAccount,
    userTokenAccount: userTokenAccount,
    fbondTokenMint: accounts.fbondTokenMint,

    user: accounts.userPubkey,
    authRules: ruleSet || EMPTY_PUBKEY,

    systemProgram: web3.SystemProgram.programId,
    rent: web3.SYSVAR_RENT_PUBKEY,
    tokenProgram: TOKEN_PROGRAM_ID,
    associatedTokenProgram: ASSOCIATED_PROGRAM_ID,

    metadataProgram: METADATA_PROGRAM_PUBKEY,
    editionInfo: editionInfo,
    ownerTokenRecord,
    destTokenRecord,
    nftMetadata,
    instructions: web3.SYSVAR_INSTRUCTIONS_PUBKEY,
    authorizationRulesProgram: AUTHORIZATION_RULES_PROGRAM,
  };

  // console.log(
  //   'accounts: ',
  //   anchorRawBNsAndPubkeysToNumsAndStrings({ publicKey: hadoRegistry, account: accountsIntoInstruction }),
  // );

  instructions.push(
    await program.methods
      .repayFbondToTradeTransactions(null)
      .accountsStrict(accountsIntoInstruction)
      .remainingAccounts([...repayRemainingAccounts])
      .instruction(),
  );
  const transaction = new web3.Transaction();
  for (let instruction of instructions) transaction.add(instruction);
  const remainingAccounts = [
    ...repayRemainingAccounts.map((sellBondRemainingAccount) => sellBondRemainingAccount.pubkey),
  ];

  const addressesForLookupTable = [...Object.values(accountsIntoInstruction), ...remainingAccounts];
  const signers = [];
  await sendTxn(transaction, signers);
  return { account: null, instructions, signers, addressesForLookupTable };
};
