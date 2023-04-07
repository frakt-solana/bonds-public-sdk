import { web3, BN } from '@project-serum/anchor';

import { returnAnchorProgram } from '../../helpers';
import { EMPTY_PUBKEY, ENCODER, FEE_PREFIX, NFTS_OWNER_PREFIX, SOL_FUNDS_PREFIX, TRADE_PREFIX, TRADE_SETTINGS_PREFIX, VALIDATION_PREFIX } from '../../constants';



type startTradeAndDepositPair = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;

  args: {
    epoch: number;
  }

  accounts: {
    tradePool: web3.PublicKey;
    userPubkey: web3.PublicKey;
    tradeSettings: web3.PublicKey;
    hadoMarket: web3.PublicKey;
    bondsProgram: web3.PublicKey;
  };

  sendTxn: (transaction: web3.Transaction, signers: web3.Signer[]) => Promise<void>;
}) => Promise<{
  pair: web3.PublicKey;
  trade: web3.PublicKey;
  authorityAdapter: web3.PublicKey;
  instructions: web3.TransactionInstruction[];
  signers: web3.Signer[]
}>;

export const startTradeAndDepositPair: startTradeAndDepositPair = async ({ programId, connection, args, accounts, sendTxn }) => {
  const program = returnAnchorProgram(programId, connection);
  const instructions: web3.TransactionInstruction[] = [];
  const pair = web3.Keypair.generate();
  const authorityAdapter = web3.Keypair.generate();


  const [trade, ] = await web3.PublicKey.findProgramAddress(
    [
      ENCODER.encode(TRADE_PREFIX),
      accounts.tradePool.toBuffer(),
      ENCODER.encode(args.epoch.toString()),
    ],
    program.programId,
  );

  const [pairFeeSolVault, pairFeeVaultSeed] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(FEE_PREFIX), pair.publicKey.toBuffer()],
    accounts.bondsProgram,
  );

  const [pairSolFundsVault, pairSolVaultSeed] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(SOL_FUNDS_PREFIX), pair.publicKey.toBuffer()],
    accounts.bondsProgram,
  );

  const [pairNftsOwner, pairNftsOwnerSeed] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(NFTS_OWNER_PREFIX), pair.publicKey.toBuffer()],
    accounts.bondsProgram,
  );
  const [poolSolFundsVault, ] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(SOL_FUNDS_PREFIX), accounts.tradePool.toBuffer()],
    program.programId,
  );
  const [tradeSolFundsVault, ] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(SOL_FUNDS_PREFIX), trade.toBuffer()],
    program.programId,
  );
  const [validation] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(VALIDATION_PREFIX), pair.publicKey.toBuffer()],
    accounts.bondsProgram,
  );

  instructions.push(
    await program.methods
      .startTradeAndDepositPair(
        pairSolVaultSeed,
        pairFeeVaultSeed,
        pairNftsOwnerSeed,
      )
      .accounts({
        tradePool: accounts.tradePool,
        user: accounts.userPubkey,

        trade: trade,
        tradeSettings: accounts.tradeSettings,
        poolFundsSolVault: poolSolFundsVault,
        tradeFundsSolVault: tradeSolFundsVault,

        systemProgram: web3.SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY,

        pair: pair.publicKey,
        hadoMarket: accounts.hadoMarket,

        pairAuthorityAdapterProgram: accounts.bondsProgram,

        partialAdapterProgram: EMPTY_PUBKEY,
        partialAssetReceiver: EMPTY_PUBKEY,

        feeSolVault: pairFeeSolVault,
        feeTokenAccount: EMPTY_PUBKEY,

        pairFundsSolVault: pairSolFundsVault,
        fundsTokenAccount: EMPTY_PUBKEY,

        assetReceiverTokenAccount: EMPTY_PUBKEY,

        nftsOwner: pairNftsOwner,
        validation: validation,
        authorityAdapter: authorityAdapter.publicKey,
        bondsProgram: accounts.bondsProgram,
      })
      .instruction(),
  );
  const transaction = new web3.Transaction();
  for (let instruction of instructions) transaction.add(instruction);

  const signers = [pair, authorityAdapter];
  await sendTxn(transaction, signers);
  return { pair: pair.publicKey, trade: trade, validation: validation, authorityAdapter: authorityAdapter.publicKey, instructions, signers };
};
