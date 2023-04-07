import { web3, BN } from '@project-serum/anchor';

import { returnAnchorProgram } from '../../helpers';

type CutStrategiesAmount = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;

  args: {
    newStrategiesAmount: number;
  }

  accounts: {
    userPubkey: web3.PublicKey;
    tradePool: web3.PublicKey;
  };

  sendTxn: (transaction: web3.Transaction, signers: web3.Signer[]) => Promise<void>;
}) => Promise<{
  instructions: web3.TransactionInstruction[];
  signers: web3.Signer[]
}>;

export const cutStrategiesAmount: CutStrategiesAmount = async ({
  programId,
  connection,
  args,
  accounts,
  sendTxn,
}) => {
  const program = returnAnchorProgram(programId, connection);
  const instructions: web3.TransactionInstruction[] = [];


  instructions.push(
    await program.methods
      .cutStrategiesAmount(
        args.newStrategiesAmount,
      )
      .accounts({
        tradePool: accounts.tradePool,
        user: accounts.userPubkey,

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
