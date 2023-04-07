import { web3, BN } from '@project-serum/anchor';

import {  returnAnchorProgram } from '../../helpers';
import {  ENCODER, SOL_FUNDS_PREFIX, ADMIN_TRADE_POOL_PUBKEY } from '../../constants';



type FinishTrade = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;

  args: {
    epoch: number;
  }

  accounts: {
    tradePool: web3.PublicKey;
    trade: web3.PublicKey;
    userPubkey: web3.PublicKey;
    tradeSettings: web3.PublicKey;
    pair: web3.PublicKey;
    crossMintAmmProgram: web3.PublicKey;
  };

  sendTxn: (transaction: web3.Transaction, signers: web3.Signer[]) => Promise<void>;
}) => Promise<{
  instructions: web3.TransactionInstruction[]; 
  signers: web3.Signer[] 
}>;

export const finishTrade: FinishTrade = async ({ programId, connection, args, accounts, sendTxn }) => {
  const program = returnAnchorProgram(programId, connection);
  const instructions: web3.TransactionInstruction[] = [];



  const [tradeSolFundsVault, ] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(SOL_FUNDS_PREFIX), accounts.trade.toBuffer()],
    program.programId,
  );

  const [poolSolFundsVault, ] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(SOL_FUNDS_PREFIX), accounts.tradePool.toBuffer()],
    program.programId,
  );

  instructions.push(
    await program.methods
      .finishTrade(
        new BN(args.epoch)
      )
      .accounts({
        pair: accounts.pair,
        tradePool: accounts.tradePool,
        trade: accounts.trade,
        tradeSettings: accounts.tradeSettings,
        tradeFundsSolVault: tradeSolFundsVault,
        poolFundsSolVault: poolSolFundsVault,
        user: accounts.userPubkey,

        admin: ADMIN_TRADE_POOL_PUBKEY,
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
