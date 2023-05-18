import { BN, web3 } from '@project-serum/anchor';
import { ASSOCIATED_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token';
import { findAssociatedTokenAddress } from '../../../common';
import { ENCODER } from '../../constants';
import { BOND_PROOGRAM_AUTHORITY_PREFIX, RETURN_FUNDS_OWNER_PREFIX } from '../../constants';

import { returnAnchorProgram } from './../../helpers';

type ActivateFBond = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;

  args: {
    amountToReturn: number;
    bondDuration: number;
  };

  accounts: {
    userPubkey: web3.PublicKey;
    fbond: web3.PublicKey;
    fbondsTokenMint: web3.PublicKey;
  };

  sendTxn: (transaction: web3.Transaction, signers: web3.Signer[]) => Promise<void>;
}) => Promise<{
  instructions: web3.TransactionInstruction[];
  signers: web3.Signer[];
}>;

// NFT, returnAmount 5 SOL.
// you get 5 fBond
// 1 fBond = 1 SOL
// buy 5 fBond for 4 SOL

export const activateFBond: ActivateFBond = async ({ programId, connection, args, accounts, sendTxn }) => {
  const program = returnAnchorProgram(programId, connection);
  const instructions: web3.TransactionInstruction[] = [];

  const [bondProgramAuthority] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(BOND_PROOGRAM_AUTHORITY_PREFIX), accounts.fbond.toBuffer()],
    program.programId,
  );
  const userFbondTokenAccount = await findAssociatedTokenAddress(accounts.userPubkey, accounts.fbondsTokenMint);

  instructions.push(
    await program.methods
      .activateFbond({
        amountToReturn: new BN(args.amountToReturn),
        bondDuration: new BN(args.bondDuration),
      })
      .accounts({
        fbond: accounts.fbond,
        bondProgramAuthority: bondProgramAuthority,

        fbondTokenMint: accounts.fbondsTokenMint,
        userFbondTokenAccount: userFbondTokenAccount,
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
  return { instructions, signers };
};
