import { web3, BN } from '@project-serum/anchor';

import { returnAnchorProgram, enumToAnchorEnum } from '../../helpers';
import { ENCODER, TRADE_SETTINGS_PREFIX } from '../../constants';
import { BondingCurveType } from '../../types';

type ChangeTradeSettings = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;

  args: {
    strategyNum: number;
    loanToValueFilter: number;
    durationFilter: number;
    delta: number;
    spotPrice: number;
    bidCap: number;
    tradeAmountRatio: number;
    maxTradeAmount: number;
    minTimeBetweenTrades: number;
    bondingType: BondingCurveType;
    tradeDuration: number;
    remainingSolRatioToFinishTrade: number;
  }

  accounts: {
    userPubkey: web3.PublicKey;
    hadoMarket: web3.PublicKey;
    tradePool: web3.PublicKey;
  };

  sendTxn: (transaction: web3.Transaction, signers: web3.Signer[]) => Promise<void>;
}) => Promise<{ 
  tradeSettings: web3.PublicKey; 
  instructions: web3.TransactionInstruction[]; 
  signers: web3.Signer[] 
}>;

export const changeTradeSettings: ChangeTradeSettings = async ({
  programId,
  connection,
  args,
  accounts,
  sendTxn,
}) => {
  const program = returnAnchorProgram(programId, connection);
  const instructions: web3.TransactionInstruction[] = [];
  const [tradeSettings, ] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(TRADE_SETTINGS_PREFIX), accounts.tradePool.toBuffer(),
    new BN(args.strategyNum).toArrayLike(Buffer)
    ],
    program.programId,
  );

  instructions.push(
    await program.methods
      .changeTradeSettings(
        args.strategyNum,
        {
          loanToValueFilter: new BN(args.loanToValueFilter),
          durationFilter: new BN(args.durationFilter),
          delta: new BN(args.delta),
          spotPrice: new BN(args.spotPrice),
          bidCap: new BN(args.bidCap),
          tradeAmountRatio: new BN(args.tradeAmountRatio),
          maxTradeAmount: new BN(args.maxTradeAmount),
          minTimeBetweenTrades: new BN(args.minTimeBetweenTrades),
          tradeDuration: new BN(args.tradeDuration),
          remainingSolRatioToFinishTrade: new BN(args.remainingSolRatioToFinishTrade),
        },
        enumToAnchorEnum(args.bondingType),
      )
      .accounts({
        tradePool: accounts.tradePool,

        tradeSettings: tradeSettings,

        hadoMarket: accounts.hadoMarket,
        //fraktMarket: accounts.fraktMarket,
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
  return { tradeSettings: tradeSettings, instructions, signers };
};
