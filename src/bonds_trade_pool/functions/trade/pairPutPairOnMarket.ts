import { web3, BN } from '@project-serum/anchor';

import { returnAnchorProgram,  } from '../../helpers';
import { ENCODER, SOL_FUNDS_PREFIX } from '../../constants';



type PairPutPairOnMarket = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;

  args: {
    epoch: number;
  }

  accounts: {
    tradePool: web3.PublicKey;
    trade: web3.PublicKey;
    userPubkey: web3.PublicKey;
    tradeSettings: web3.PublicKey;
    pair: web3.PublicKey;
    authorityAdapter: web3.PublicKey;
    bondsProgram: web3.PublicKey;
  };

  sendTxn: (transaction: web3.Transaction, signers: web3.Signer[]) => Promise<void>;
}) => Promise<{
  instructions: web3.TransactionInstruction[];
  signers: web3.Signer[]
}>;

export const pairPutPairOnMarket: PairPutPairOnMarket = async ({ programId, connection, args, accounts, sendTxn }) => {
  const program = returnAnchorProgram(programId, connection);
  const instructions: web3.TransactionInstruction[] = [];

  const [tradeSolFundsVault, tradeSolVaultSeed] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(SOL_FUNDS_PREFIX), accounts.trade.toBuffer()],
    program.programId,
  );

  instructions.push(
    await program.methods
      .pairPutPairOnMarket(
        new BN(args.epoch)
      )
      .accounts({
        authorityAdapter: accounts.authorityAdapter,
        pair: accounts.pair,
        tradePool: accounts.tradePool,
        trade: accounts.trade,
        tradeSettings: accounts.tradeSettings,
        tradeFundsSolVault: tradeSolFundsVault,
        user: accounts.userPubkey,

        systemProgram: web3.SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY,

        bondsProgram: accounts.bondsProgram,
      })
      .instruction(),
  );

  const transaction = new web3.Transaction();
  for (let instruction of instructions) transaction.add(instruction);

  const signers = [];
  await sendTxn(transaction, signers);
  return { instructions, signers };
};
