import { BN, web3 } from '@project-serum/anchor';
import { ASSOCIATED_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token';
import { findAssociatedTokenAddress } from '../../../common';
import { ENCODER, METADATA_PROGRAM_PUBKEY } from '../../constants';
import { BOND_PROOGRAM_AUTHORITY_PREFIX, RETURN_FUNDS_OWNER_PREFIX, COLLATERAL_BOX_PREFIX } from '../../constants';

import { getMetaplexEditionPda, returnAnchorProgram } from '../../helpers';

type UpdateActualReturnedAmount = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;

  args: {
    newAmountToReturn: number;
  };

  accounts: {
    userPubkey: web3.PublicKey;
    fbond: web3.PublicKey;
  };

  sendTxn: (transaction: web3.Transaction, signers: web3.Signer[]) => Promise<void>;
}) => Promise<{
  instructions: web3.TransactionInstruction[];
  signers: web3.Signer[];
}>;

export const updateActualReturnedAmount: UpdateActualReturnedAmount = async ({
  programId,
  connection,
  accounts,
  args,
  sendTxn,
}) => {
  const program = returnAnchorProgram(programId, connection);
  const instructions: web3.TransactionInstruction[] = [];

  const [returnFundsOwner] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(RETURN_FUNDS_OWNER_PREFIX), accounts.fbond.toBuffer()],
    program.programId,
  );

  instructions.push(
    await program.methods
      .updateActualReturnedAmount(new BN(args.newAmountToReturn))
      .accounts({
        fbond: accounts.fbond,
        returnFundsOwner: returnFundsOwner,

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
