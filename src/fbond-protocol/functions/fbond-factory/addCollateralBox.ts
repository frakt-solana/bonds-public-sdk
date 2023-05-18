import { BN, web3 } from '@project-serum/anchor';
import { ASSOCIATED_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token';
import { findAssociatedTokenAddress } from '../../../common';
import { ENCODER } from '../../constants';
import { BOND_PROOGRAM_AUTHORITY_PREFIX, COLLATERAL_BOX_PREFIX, RETURN_FUNDS_OWNER_PREFIX } from '../../constants';

import { returnAnchorProgram } from './../../helpers';

type addCollateralBox = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;

  args: {
    amountToDeposit: number;
    nextBoxIndex: string;
  };

  accounts: {
    userPubkey: web3.PublicKey;
    fbond: web3.PublicKey;
    tokenMint: web3.PublicKey;
  };

  sendTxn: (transaction: web3.Transaction, signers: web3.Signer[]) => Promise<void>;
}) => Promise<{
  collateralBox: web3.PublicKey;
  instructions: web3.TransactionInstruction[];
  signers: web3.Signer[];
}>;

export const addCollateralBox: addCollateralBox = async ({ programId, connection, args, accounts, sendTxn }) => {
  const program = returnAnchorProgram(programId, connection);
  const instructions: web3.TransactionInstruction[] = [];

  const [collateralBox] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(COLLATERAL_BOX_PREFIX), accounts.fbond.toBuffer(), ENCODER.encode(args.nextBoxIndex)],
    program.programId,
  );

  const [bondProgramAuthority] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(BOND_PROOGRAM_AUTHORITY_PREFIX), accounts.fbond.toBuffer()],
    program.programId,
  );

  const userTokenAccount = await findAssociatedTokenAddress(accounts.userPubkey, accounts.tokenMint);
  const collateralTokenAccount = await findAssociatedTokenAddress(bondProgramAuthority, accounts.tokenMint);

  instructions.push(
    await program.methods
      .addCollateralBox(new BN(args.amountToDeposit))
      .accounts({
        collateralBox: collateralBox,
        fbond: accounts.fbond,
        bondProgramAuthority: bondProgramAuthority,

        tokenMint: accounts.tokenMint,
        userTokenAccount: userTokenAccount,
        collateralTokenAccount: collateralTokenAccount,

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
  return { collateralBox: collateralBox, instructions, signers };
};
