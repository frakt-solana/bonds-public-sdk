import { web3, BN } from '@project-serum/anchor';

import { returnAnchorProgram } from '../../helpers';


type activateFraktMarket = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;

  accounts: {
    fraktMarket: web3.PublicKey;
    userPubkey: web3.PublicKey;
  };

  sendTxn: (transaction: web3.Transaction, signers: web3.Signer[]) => Promise<void>;
}) => Promise<{ instructions: web3.TransactionInstruction[]; signers: web3.Signer[] }>;

export const activateFraktMarket: activateFraktMarket = async ({
  programId,
  connection,
  accounts,
  sendTxn,
}) => {
  const program = returnAnchorProgram(programId, connection);
  const instructions: web3.TransactionInstruction[] = [];

  instructions.push(
    await program.methods
      .activateFraktMarket()
      .accounts({
        fraktMarket: accounts.fraktMarket,
        user: accounts.userPubkey,
      })
      .instruction(),
  );

  const transaction = new web3.Transaction();
  for (let instruction of instructions) transaction.add(instruction);

  const signers = [];
  await sendTxn(transaction, signers);
  return { instructions, signers };
};
