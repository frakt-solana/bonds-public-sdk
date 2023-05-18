import { BN, web3 } from '@project-serum/anchor';
import { ASSOCIATED_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token';
import { findAssociatedTokenAddress } from '../../../common';
import { AUTHORIZATION_RULES_PROGRAM, EMPTY_PUBKEY, ENCODER, METADATA_PROGRAM_PUBKEY } from '../../constants';
import { BOND_PROOGRAM_AUTHORITY_PREFIX, RETURN_FUNDS_OWNER_PREFIX, COLLATERAL_BOX_PREFIX } from '../../constants';
import { Metadata, TokenRecord, TokenStandard } from '@metaplex-foundation/mpl-token-metadata';

import {
  anchorRawBNsAndPubkeysToNumsAndStrings,
  findTokenRecordPda,
  getMetaplexEditionPda,
  getMetaplexMetadata,
  returnAnchorProgram,
} from './../../helpers';

type CreateBondWithSingleCollateralPnft = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;

  args: {
    amountToDeposit: number;
    amountToReturn: number;
    bondDuration: number;
  };

  accounts: {
    userPubkey: web3.PublicKey;
    tokenMint: web3.PublicKey;
  };

  sendTxn: (transaction: web3.Transaction, signers: web3.Signer[]) => Promise<void>;
}) => Promise<{
  fbond: web3.PublicKey;
  fbondTokenMint: web3.PublicKey;
  collateralBox: web3.PublicKey;
  bondProgramAuthority: web3.PublicKey;
  returnFundsOwner: web3.PublicKey;
  userTokenAccount: web3.PublicKey;
  collateralTokenAccount: web3.PublicKey;
  userFbondTokenAccount: web3.PublicKey;
  editionInfo: web3.PublicKey;
  nftMetadata: web3.PublicKey;
  ownerTokenRecord: web3.PublicKey;
  destTokenRecord: web3.PublicKey;

  instructions: web3.TransactionInstruction[];
  signers: web3.Signer[];
  addressesForLookupTable: web3.PublicKey[];
}>;

export const createBondWithSingleCollateralPnft: CreateBondWithSingleCollateralPnft = async ({
  programId,
  connection,
  args,
  accounts,
  sendTxn,
}) => {
  const program = returnAnchorProgram(programId, connection);
  const instructions: web3.TransactionInstruction[] = [];
  const fbond = web3.Keypair.generate();
  const fbondsTokenMint = web3.Keypair.generate();

  const [bondProgramAuthority] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(BOND_PROOGRAM_AUTHORITY_PREFIX), fbond.publicKey.toBuffer()],
    program.programId,
  );

  const [returnFundsOwner] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(RETURN_FUNDS_OWNER_PREFIX), fbond.publicKey.toBuffer()],
    program.programId,
  );

  const [collateralBox] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(COLLATERAL_BOX_PREFIX), fbond.publicKey.toBuffer(), ENCODER.encode('0')],
    program.programId,
  );

  const userTokenAccount = await findAssociatedTokenAddress(accounts.userPubkey, accounts.tokenMint);
  const collateralTokenAccount = await findAssociatedTokenAddress(bondProgramAuthority, accounts.tokenMint);
  const userFbondTokenAccount = await findAssociatedTokenAddress(accounts.userPubkey, fbondsTokenMint.publicKey);
  const editionInfo = getMetaplexEditionPda(accounts.tokenMint);
  const nftMetadata = getMetaplexMetadata(accounts.tokenMint);
  const ownerTokenRecord = findTokenRecordPda(accounts.tokenMint, userTokenAccount);
  const destTokenRecord = findTokenRecordPda(accounts.tokenMint, collateralTokenAccount);
  const meta = await Metadata.fromAccountAddress(connection, nftMetadata);
  const ruleSet = meta.programmableConfig?.ruleSet;
  const tokenRecordData =
    meta.tokenStandard === TokenStandard.ProgrammableNonFungible
      ? await TokenRecord.fromAccountAddress(connection, ownerTokenRecord)
      : { delegate: null };
  const delegatePubkey = tokenRecordData.delegate;
  const modifyComputeUnits = web3.ComputeBudgetProgram.setComputeUnitLimit({
    units: Math.round(800000 + Math.ceil(Math.random() * 10000)),
  });

  instructions.push(modifyComputeUnits);

  const accountsIntoInstruction = {
    fbond: fbond.publicKey,
    bondProgramAuthority: bondProgramAuthority,

    fbondTokenMint: fbondsTokenMint.publicKey,
    user: accounts.userPubkey,

    userFbondTokenAccount: userFbondTokenAccount,

    collateralBox: collateralBox,
    tokenMint: accounts.tokenMint,
    userTokenAccount: userTokenAccount,
    collateralTokenAccount: collateralTokenAccount,
    ownerTokenRecord,
    destTokenRecord,
    nftMetadata,
    instructions: web3.SYSVAR_INSTRUCTIONS_PUBKEY,
    authorizationRulesProgram: AUTHORIZATION_RULES_PROGRAM,

    tokenProgram: TOKEN_PROGRAM_ID,
    associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
    systemProgram: web3.SystemProgram.programId,
    rent: web3.SYSVAR_RENT_PUBKEY,
    metadataProgram: METADATA_PROGRAM_PUBKEY,
    editionInfo: editionInfo,
  };
  // console.log(
  //   'passing createBondWithSingleCollateralPnft:',
  //   anchorRawBNsAndPubkeysToNumsAndStrings({
  //     account: accountsIntoInstruction,
  //     publicKey: ruleSet || METADATA_PROGRAM_PUBKEY,
  //   }),
  // );
  instructions.push(
    await program.methods
      .createBondWithSingleCollateralPnft(
        {},
        new BN(args.amountToDeposit),
        {
          amountToReturn: new BN(args.amountToReturn),
          bondDuration: new BN(args.bondDuration),
        },
        null,
      )
      .accountsStrict(accountsIntoInstruction)
      .remainingAccounts([
        {
          pubkey: ruleSet || METADATA_PROGRAM_PUBKEY,
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: delegatePubkey || METADATA_PROGRAM_PUBKEY,
          isSigner: false,
          isWritable: false,
        },
      ])
      .instruction(),
  );
  const remainingAccounts = [...(ruleSet ? [ruleSet] : []), ...(delegatePubkey ? [delegatePubkey] : [])];
  const addressesForLookupTable = [...Object.values(accountsIntoInstruction), ...remainingAccounts];

  const transaction = new web3.Transaction();
  for (let instruction of instructions) transaction.add(instruction);

  const signers = [fbond, fbondsTokenMint];
  await sendTxn(transaction, signers);
  return {
    fbond: fbond.publicKey,
    fbondTokenMint: fbondsTokenMint.publicKey,
    collateralBox: collateralBox,
    bondProgramAuthority,
    returnFundsOwner,
    userTokenAccount,
    collateralTokenAccount,
    userFbondTokenAccount,
    editionInfo,
    nftMetadata,
    ownerTokenRecord,
    destTokenRecord,
    instructions,
    signers,
    addressesForLookupTable,
  };
};
