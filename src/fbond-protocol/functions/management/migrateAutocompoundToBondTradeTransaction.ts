import { BN, web3 } from '@project-serum/anchor';
import { ASSOCIATED_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token';
import { findAssociatedTokenAddress } from '../../../common';
import { ENCODER, MUTUAL_BOND_TRADE_TXN_VAULT } from '../../constants';
import { SOL_FUNDS_PREFIX, RETURN_FUNDS_OWNER_PREFIX, AUTOCOMPOUND_DEPOSIT_PREFIX } from '../../constants';

import { returnAnchorProgram } from '../../helpers';

type MigrateAutocompoundToBondTradeTransaction = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;

  accounts: {
    userPubkey: web3.PublicKey;
    fbond: web3.PublicKey;
    fbondsTokenMint: web3.PublicKey;
    pair: web3.PublicKey;
    // autocompoundDeposit: web3.PublicKey;
  };

  sendTxn: (transaction: web3.Transaction, signers: web3.Signer[]) => Promise<void>;
}) => Promise<{
  account: web3.PublicKey;
  instructions: web3.TransactionInstruction[];
  signers: web3.Signer[];
}>;

export const migrateAutocompoundToBondTradeTransaction: MigrateAutocompoundToBondTradeTransaction = async ({
  programId,
  connection,
  accounts,
  sendTxn,
}) => {
  const program = returnAnchorProgram(programId, connection);
  const instructions: web3.TransactionInstruction[] = [];
  const [solFundsVault, solVaultSeed] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(SOL_FUNDS_PREFIX), accounts.pair.toBuffer()],
    program.programId,
  );
  const [mutualBondTradeTxnVault] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(MUTUAL_BOND_TRADE_TXN_VAULT)],
    program.programId,
  );

  const bondTradeTxnTokenAccount = await findAssociatedTokenAddress(mutualBondTradeTxnVault, accounts.fbondsTokenMint);
  const autocompoundBondsTokenAccount = await findAssociatedTokenAddress(solFundsVault, accounts.fbondsTokenMint);

  const [autocompoundDeposit] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(AUTOCOMPOUND_DEPOSIT_PREFIX), accounts.fbondsTokenMint.toBuffer(), accounts.pair.toBuffer()],
    program.programId,
  );

  const bondOfferSeed = Math.ceil(Math.random() * 1000000);
  const [bondTradeTransactionV2] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(AUTOCOMPOUND_DEPOSIT_PREFIX), ENCODER.encode(bondOfferSeed.toString())],
    program.programId,
  );

  instructions.push(
    await program.methods
      .migrateAutocompoundToBondTradeTransaction(new BN(bondOfferSeed))
      .accountsStrict({
        mutualBondTradeTxnVault: mutualBondTradeTxnVault,
        bondTradeTxnTokenAccount: bondTradeTxnTokenAccount,
        bondTradeTransactionV2: bondTradeTransactionV2,
        fbond: accounts.fbond,

        fbondTokenMint: accounts.fbondsTokenMint,

        autocompoundDeposit: autocompoundDeposit,
        autocompoundBondsTokenAccount: autocompoundBondsTokenAccount,
        pair: accounts.pair,
        fundsSolVault: solFundsVault,
        user: accounts.userPubkey,

        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY,
      })
      .instruction(),
  );

  const transaction = new web3.Transaction();
  for (let instruction of instructions) transaction.add(instruction);

  const signers = [];
  await sendTxn(transaction, signers);
  return { account: bondTradeTransactionV2, instructions, signers };
};
