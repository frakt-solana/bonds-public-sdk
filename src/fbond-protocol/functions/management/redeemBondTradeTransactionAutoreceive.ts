import { BN, web3 } from '@project-serum/anchor';
import { ASSOCIATED_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token';
import { findAssociatedTokenAddress } from '../../../common';
import { ENCODER, MUTUAL_BOND_TRADE_TXN_VAULT } from '../../constants';
import { SOL_FUNDS_PREFIX, RETURN_FUNDS_OWNER_PREFIX, AUTOCOMPOUND_DEPOSIT_PREFIX } from '../../constants';

import { returnAnchorProgram } from '../../helpers';

type RedeemBondTradeTransactionAutoreceive = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;

  accounts: {
    userPubkey: web3.PublicKey;
    fbond: web3.PublicKey;
    fbondsTokenMint: web3.PublicKey;
    assetReciever: web3.PublicKey;
    bondTradeTransaction: web3.PublicKey;
  };

  sendTxn: (transaction: web3.Transaction, signers: web3.Signer[]) => Promise<void>;
}) => Promise<{
  instructions: web3.TransactionInstruction[];
  signers: web3.Signer[];
}>;

export const redeemBondTradeTransactionAutoreceive: RedeemBondTradeTransactionAutoreceive = async ({
  programId,
  connection,
  accounts,
  sendTxn,
}) => {
  const program = returnAnchorProgram(programId, connection);
  const instructions: web3.TransactionInstruction[] = [];

  const [returnFundsOwner] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(RETURN_FUNDS_OWNER_PREFIX), accounts.fbond.toBuffer()],
    program.programId,
  );
  const [mutualBondTradeTxnVault] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(MUTUAL_BOND_TRADE_TXN_VAULT)],
    program.programId,
  );

  const bondTradeTxnTokenAccount = await findAssociatedTokenAddress(mutualBondTradeTxnVault, accounts.fbondsTokenMint);

  instructions.push(
    await program.methods
      .redeemBondTradeTransactionAutoreceive()
      .accounts({
        fbond: accounts.fbond,
        returnFundsOwner: returnFundsOwner,

        fbondTokenMint: accounts.fbondsTokenMint,

        bondTradeTransactionV2: accounts.bondTradeTransaction,
        bondTradeTxnTokenAccount: bondTradeTxnTokenAccount,
        mutualBondTradeTxnVault: mutualBondTradeTxnVault,
        user: accounts.userPubkey,
        assetReceiver: accounts.assetReciever,

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
  return { instructions, signers };
};
