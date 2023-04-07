import { web3, BN } from '@project-serum/anchor';

import { returnAnchorProgram } from '../../helpers';
//import { EMPTY_PUBKEY, ENCODER, FEE_PREFIX, NFTS_OWNER_PREFIX, SOL_FUNDS_PREFIX } from '../../constants';

type InitializeFraktMarket = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;

  accounts: {
    userPubkey: web3.PublicKey;
    adminPubkey: web3.PublicKey;
  };

  sendTxn: (transaction: web3.Transaction, signers: web3.Signer[]) => Promise<void>;
}) => Promise<{ account: web3.PublicKey; instructions: web3.TransactionInstruction[]; signers: web3.Signer[] }>;

export const initializeFraktMarket: InitializeFraktMarket = async ({
  programId,
  connection,
  accounts,
  sendTxn,
}) => {
  const program = returnAnchorProgram(programId, connection);
  const instructions: web3.TransactionInstruction[] = [];
  const fraktMarket = web3.Keypair.generate();

  instructions.push(
    await program.methods
      .initializeFraktMarket()
      .accounts({
        fraktMarket: fraktMarket.publicKey,
        user: accounts.userPubkey,

        admin: accounts.adminPubkey,
        systemProgram: web3.SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY,
      })
      .instruction(),
  );

  const transaction = new web3.Transaction();
  for (let instruction of instructions) transaction.add(instruction);

  const signers = [fraktMarket];
  await sendTxn(transaction, signers);
  return { account: fraktMarket.publicKey, instructions, signers };
};
