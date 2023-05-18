import { web3 } from '@project-serum/anchor';
import { ASSOCIATED_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token';
import { ENCODER } from '../../constants';
import { BOND_PROOGRAM_AUTHORITY_PREFIX, RETURN_FUNDS_OWNER_PREFIX } from '../../constants';

import { returnAnchorProgram } from './../../helpers';

type InitializeFBond = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;

  accounts: {
    userPubkey: web3.PublicKey;
  };

  sendTxn: (transaction: web3.Transaction, signers: web3.Signer[]) => Promise<void>;
}) => Promise<{
  fbond: web3.PublicKey;
  fbondTokenMint: web3.PublicKey;
  instructions: web3.TransactionInstruction[];
  signers: web3.Signer[];
}>;

export const initializeFBond: InitializeFBond = async ({ programId, connection, accounts, sendTxn }) => {
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

  instructions.push(
    await program.methods
      .initializeFbond({})
      .accounts({
        fbond: fbond.publicKey,
        bondProgramAuthority: bondProgramAuthority,

        returnFundsOwner: returnFundsOwner,
        fbondTokenMint: fbondsTokenMint.publicKey,
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

  const signers = [fbond, fbondsTokenMint];
  await sendTxn(transaction, signers);
  return { fbond: fbond.publicKey, fbondTokenMint: fbondsTokenMint.publicKey, instructions, signers };
};
