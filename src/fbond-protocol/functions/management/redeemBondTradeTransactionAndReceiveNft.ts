import { BN, web3 } from '@project-serum/anchor';
import { ASSOCIATED_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token';
import { findAssociatedTokenAddress } from '../../../common';
import {
  AUTHORIZATION_RULES_PROGRAM,
  BOND_PROOGRAM_AUTHORITY_PREFIX,
  ENCODER,
  METADATA_PROGRAM_PUBKEY,
  MUTUAL_BOND_TRADE_TXN_VAULT,
} from '../../constants';
import { SOL_FUNDS_PREFIX, RETURN_FUNDS_OWNER_PREFIX, AUTOCOMPOUND_DEPOSIT_PREFIX } from '../../constants';

import { findTokenRecordPda, getMetaplexEditionPda, getMetaplexMetadata, returnAnchorProgram } from '../../helpers';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';

type RedeemBondTradeTransactionAndReceiveNft = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;
  addComputeUnits: boolean;

  accounts: {
    userPubkey: web3.PublicKey;
    fbond: web3.PublicKey;
    fbondsTokenMint: web3.PublicKey;
    collateralBox: web3.PublicKey;
    collateralTokenMint: web3.PublicKey;
    collateralTokenAccount: web3.PublicKey;
    collateralOwner: web3.PublicKey;
    assetReceiver: web3.PublicKey;
    bondTradeTransactionV2: web3.PublicKey;
  };

  sendTxn: (transaction: web3.Transaction, signers: web3.Signer[]) => Promise<void>;
}) => Promise<{
  instructions: web3.TransactionInstruction[];
  signers: web3.Signer[];
}>;

export const redeemBondTradeTransactionAndReceiveNft: RedeemBondTradeTransactionAndReceiveNft = async ({
  programId,
  connection,
  addComputeUnits,
  accounts,
  sendTxn,
}) => {
  const program = returnAnchorProgram(programId, connection);
  const instructions: web3.TransactionInstruction[] = [];

  const assetReceiverTokenAccount = await findAssociatedTokenAddress(
    accounts.assetReceiver,
    accounts.collateralTokenMint,
  );
  const userMiddleTokenAccount = await findAssociatedTokenAddress(accounts.userPubkey, accounts.collateralTokenMint);

  const [bondProgramAuthority] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(BOND_PROOGRAM_AUTHORITY_PREFIX), accounts.fbond.toBuffer()],
    program.programId,
  );

  const [mutualBondTradeTxnVault] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(MUTUAL_BOND_TRADE_TXN_VAULT)],
    program.programId,
  );

  const bondTradeTxnTokenAccount = await findAssociatedTokenAddress(mutualBondTradeTxnVault, accounts.fbondsTokenMint);

  const editionInfo = getMetaplexEditionPda(accounts.collateralTokenMint);
  const nftMetadata = getMetaplexMetadata(accounts.collateralTokenMint);
  const ownerTokenRecord = findTokenRecordPda(accounts.collateralTokenMint, accounts.collateralTokenAccount);
  const middleTokenRecord = findTokenRecordPda(accounts.collateralTokenMint, userMiddleTokenAccount);
  const destTokenRecord = findTokenRecordPda(accounts.collateralTokenMint, assetReceiverTokenAccount);
  const meta = await Metadata.fromAccountAddress(connection, nftMetadata);
  const ruleSet = meta.programmableConfig?.ruleSet;

  const modifyComputeUnits = web3.ComputeBudgetProgram.setComputeUnitLimit({
    units: Math.round(800000 + Math.ceil(Math.random() * 10000)),
  });
  if (!!addComputeUnits) instructions.push(modifyComputeUnits);

  instructions.push(
    await program.methods
      .redeemBondTradeTransactionAndReceiveNft(null)
      .accountsStrict({
        fbond: accounts.fbond,

        fbondTokenMint: accounts.fbondsTokenMint,
        collateralBox: accounts.collateralBox,
        ownerTokenRecord,
        middleTokenRecord,
        userMiddleTokenAccount,
        destTokenRecord,
        collateralTokenAccount: accounts.collateralTokenAccount,
        collateralOwner: accounts.collateralOwner,
        bondProgramAuthority: bondProgramAuthority,

        bondTradeTransactionV2: accounts.bondTradeTransactionV2,
        bondTradeTxnTokenAccount: bondTradeTxnTokenAccount,
        mutualBondTradeTxnVault: mutualBondTradeTxnVault,

        user: accounts.userPubkey,
        tokenMint: accounts.collateralTokenMint,
        assetReceiver: accounts.assetReceiver,
        assetReceiverTokenAccount: assetReceiverTokenAccount,
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
