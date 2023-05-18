import { BN, web3 } from '@project-serum/anchor';
import { ASSOCIATED_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token';
import { findAssociatedTokenAddress } from '../../../common';
import { AUTHORIZATION_RULES_PROGRAM, ENCODER, METADATA_PROGRAM_PUBKEY } from '../../constants';
import { BOND_PROOGRAM_AUTHORITY_PREFIX, RETURN_FUNDS_OWNER_PREFIX, COLLATERAL_BOX_PREFIX } from '../../constants';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';

import {
  anchorRawBNsAndPubkeysToNumsAndStrings,
  findTokenRecordPda,
  getMetaplexEditionPda,
  getMetaplexMetadata,
  returnAnchorProgram,
} from './../../helpers';

type LiquidateReceivingNftFbondPnft = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;

  addComputeUnits?: boolean;

  accounts: {
    userPubkey: web3.PublicKey;
    fbond: web3.PublicKey;
    collateralBox: web3.PublicKey;
    collateralTokenMint: web3.PublicKey;
    collateralTokenAccount: web3.PublicKey;
    collateralOwner: web3.PublicKey;
    bondCollateralOrSolReceiver: web3.PublicKey;
  };

  sendTxn: (transaction: web3.Transaction, signers: web3.Signer[]) => Promise<void>;
}) => Promise<{
  instructions: web3.TransactionInstruction[];
  signers: web3.Signer[];
}>;

export const liquidateReceivingNftFbondPnft: LiquidateReceivingNftFbondPnft = async ({
  programId,
  connection,
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
  const [returnFundsOwner] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(RETURN_FUNDS_OWNER_PREFIX), accounts.fbond.toBuffer()],
    program.programId,
  );

  const bondCollateralOrSolReceiverTokenAccount = await findAssociatedTokenAddress(
    accounts.bondCollateralOrSolReceiver,
    accounts.collateralTokenMint,
  );
  const userMiddleTokenAccount = await findAssociatedTokenAddress(accounts.userPubkey, accounts.collateralTokenMint);
  // const collateralTokenAccount = await findAssociatedTokenAddress(bondProgramAuthority, accounts.collateralTokenMint);
  const editionInfo = getMetaplexEditionPda(accounts.collateralTokenMint);
  const nftMetadata = getMetaplexMetadata(accounts.collateralTokenMint);
  const ownerTokenRecord = findTokenRecordPda(accounts.collateralTokenMint, accounts.collateralTokenAccount);
  const middleTokenRecord = findTokenRecordPda(accounts.collateralTokenMint, userMiddleTokenAccount);
  const destTokenRecord = findTokenRecordPda(accounts.collateralTokenMint, bondCollateralOrSolReceiverTokenAccount);
  const meta = await Metadata.fromAccountAddress(connection, nftMetadata);
  const ruleSet = meta.programmableConfig?.ruleSet;
  const modifyComputeUnits = web3.ComputeBudgetProgram.setComputeUnitLimit({
    units: Math.round(800000 + Math.ceil(Math.random() * 10000)),
  });
  if (!!addComputeUnits) instructions.push(modifyComputeUnits);
  // console.log('inside collateral token account: ', collateralTokenAccount.toBase58());
  // console.log(
  //   'liquidating args: ',
  //   anchorRawBNsAndPubkeysToNumsAndStrings({
  //     account: {
  //       fbond: accounts.fbond,
  //       bondProgramAuthority: bondProgramAuthority,
  //       returnFundsOwner: returnFundsOwner,

  //       user: accounts.userPubkey,

  //       collateralBox: accounts.collateralBox,
  //       tokenMint: accounts.collateralTokenMint,
  //       bondCollateralOrSolReceiverTokenAccount: bondCollateralOrSolReceiverTokenAccount,
  //       collateralTokenAccount: accounts.collateralTokenAccount,
  //       collateralOwner: accounts.collateralOwner,
  //       bondCollateralOrSolReceiver: accounts.bondCollateralOrSolReceiver,
  //       ownerTokenRecord: ownerTokenRecord,
  //       destTokenRecord,
  //       nftMetadata,
  //       instructions: web3.SYSVAR_INSTRUCTIONS_PUBKEY,
  //       authorizationRulesProgram: AUTHORIZATION_RULES_PROGRAM,

  //       tokenProgram: TOKEN_PROGRAM_ID,
  //       associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
  //       systemProgram: web3.SystemProgram.programId,
  //       rent: web3.SYSVAR_RENT_PUBKEY,
  //       metadataProgram: METADATA_PROGRAM_PUBKEY,
  //       editionInfo: editionInfo,
  //     },
  //     publicKey: ruleSet || METADATA_PROGRAM_PUBKEY,
  //   }),
  // );
  instructions.push(
    await program.methods
      .liquidateReceivingNftFbondPnft(null)
      .accountsStrict({
        fbond: accounts.fbond,
        bondProgramAuthority: bondProgramAuthority,
        returnFundsOwner: returnFundsOwner,

        user: accounts.userPubkey,

        collateralBox: accounts.collateralBox,
        tokenMint: accounts.collateralTokenMint,
        bondCollateralOrSolReceiverTokenAccount: bondCollateralOrSolReceiverTokenAccount,
        collateralTokenAccount: accounts.collateralTokenAccount,
        collateralOwner: accounts.collateralOwner,
        bondCollateralOrSolReceiver: accounts.bondCollateralOrSolReceiver,
        ownerTokenRecord,
        middleTokenRecord,
        userMiddleTokenAccount,
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
      })
      .remainingAccounts([
        {
          pubkey: ruleSet || METADATA_PROGRAM_PUBKEY,
          isSigner: false,
          isWritable: false,
        },
      ])
      .instruction(),
  );

  const transaction = new web3.Transaction();
  for (let instruction of instructions) transaction.add(instruction);

  const signers = [];
  await sendTxn(transaction, signers);
  return { instructions, signers };
};
