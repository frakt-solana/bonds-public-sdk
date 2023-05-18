import { BN, web3 } from '@project-serum/anchor';

import { returnAnchorProgram } from '../../helpers';

type SetBondFraktMarket = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;

  accounts: {
    userPubkey: web3.PublicKey;
    fraktMarket: web3.PublicKey;
    fbond: web3.PublicKey;
  };

  sendTxn: (transaction: web3.Transaction, signers: web3.Signer[]) => Promise<void>;
}) => Promise<{
  instructions: web3.TransactionInstruction[];
  signers: web3.Signer[];
}>;

export const setBondFraktMarket: SetBondFraktMarket = async ({ programId, connection, accounts, sendTxn }) => {
  const program = returnAnchorProgram(programId, connection);
  const instructions: web3.TransactionInstruction[] = [];

  instructions.push(
    await program.methods
      .setBondFraktMarket()
      .accountsStrict({
        fbond: accounts.fbond,
        fraktMarket: accounts.fraktMarket,

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
