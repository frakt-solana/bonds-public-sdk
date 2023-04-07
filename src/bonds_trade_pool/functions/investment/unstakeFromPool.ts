import { web3, BN } from '@project-serum/anchor';

import { returnAnchorProgram } from '../../helpers';
import { ENCODER, INVESTMENT_PREFIX, SOL_FUNDS_PREFIX } from '../../constants';

type UnstakeFromPool = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;

  args: {
    amountToUnstake: number;
  }

  accounts: {
    userPubkey: web3.PublicKey;
    tradePool: web3.PublicKey;
  };

  sendTxn: (transaction: web3.Transaction, signers: web3.Signer[]) => Promise<void>;
}) => Promise<{
  investment: web3.PublicKey;
  instructions: web3.TransactionInstruction[];
  signers: web3.Signer[]
}>;

export const unstakeFromPool: UnstakeFromPool = async ({
  programId,
  connection,
  args,
  accounts,
  sendTxn,
}) => {
  const program = returnAnchorProgram(programId, connection);
  const instructions: web3.TransactionInstruction[] = [];

  const [investment, ] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(INVESTMENT_PREFIX), accounts.userPubkey.toBuffer(), accounts.tradePool.toBuffer(),],
    program.programId,
  );
  const [solFundsVault, ] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(SOL_FUNDS_PREFIX), accounts.tradePool.toBuffer()],
    program.programId,
  );

  instructions.push(
    await program.methods
      .unstakeFromPool(
        new BN(args.amountToUnstake)
      )
      .accounts({
        investment: investment,
        tradePool: accounts.tradePool,

        user: accounts.userPubkey,
        poolFundsSolVault: solFundsVault,

        systemProgram: web3.SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY,
      })
      .instruction(),
  );

  const transaction = new web3.Transaction();
  for (let instruction of instructions) transaction.add(instruction);

  const signers = [];
  await sendTxn(transaction, signers);
  return { investment: investment, instructions, signers };
};
