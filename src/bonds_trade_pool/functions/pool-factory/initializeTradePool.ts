import { web3, BN } from '@project-serum/anchor';

import { returnAnchorProgram } from '../../helpers';
import { ENCODER, SOL_FUNDS_PREFIX, ADMIN_TRADE_POOL_PUBKEY } from '../../constants';

type InitializeTradePool = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;

  args: {
    reserveFundsRatio: number;
    isPrivate: boolean;
  }

  accounts: {
    userPubkey: web3.PublicKey;
    tradeAuthority: web3.PublicKey;
  };

  sendTxn: (transaction: web3.Transaction, signers: web3.Signer[]) => Promise<void>;
}) => Promise<{
  tradePool: web3.PublicKey;
  instructions: web3.TransactionInstruction[];
  signers: web3.Signer[]
}>;

export const initializeTradePool: InitializeTradePool = async ({
  programId,
  connection,
  args,
  accounts,
  sendTxn,
}) => {
  const program = returnAnchorProgram(programId, connection);
  const instructions: web3.TransactionInstruction[] = [];
  const tradePool = web3.Keypair.generate();
  const [solFundsVault, ] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(SOL_FUNDS_PREFIX), tradePool.publicKey.toBuffer()],
    program.programId,
  );

  instructions.push(
    await program.methods
      .initializeTradePool(
        {
          reserveFundsRatio: new BN(args.reserveFundsRatio),
          isPrivate: args.isPrivate,
        }
      )
      .accounts({
        tradePool: tradePool.publicKey,

        //fraktMarket: accounts.fraktMarket,
        tradeAuthority: accounts.tradeAuthority,
        user: accounts.userPubkey,

        fundsSolVault: solFundsVault,
        admin: ADMIN_TRADE_POOL_PUBKEY,
        systemProgram: web3.SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY,
      })
      .instruction(),
  );

  const transaction = new web3.Transaction();
  for (let instruction of instructions) transaction.add(instruction);

  const signers = [tradePool];
  await sendTxn(transaction, signers);
  return { tradePool: tradePool.publicKey, instructions, signers };
};
