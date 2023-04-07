export enum BondingCurveType {
  Linear = 'linear',
  Exponential = 'exponential',
}

export interface BondsTradePool {
  balance: number;
  authority: string;
  tradeAuthority: string;
  epoch: number;
  reserveFundsRatio: number;
  strategiesAmount: number;
  nextStrategy: number;
  lastTradeStartTime: number;
  lastUpdatedAt: number;
  currentDistributionEndTime: number;
  oldMul: number;
  newMul: number;
  remainingLamportsToSendToAdmin: number;
  isPrivate: boolean;
  publicKey: string;
}

export interface Investment {
  deposit: number;
  startMul: number;
  authority: string;
  publicKey: string;
}

export interface TradeSettings {
    tradePool: string;
    hadoMarket: string;
    strategyNum: number;
    loanToValueFilter: number;
    durationFilter: number;
    delta: number;
    spotPrice: number;
    bidCap: number;
    bondingType: BondingCurveType;
    tradeAmountRatio: number;
    maxTradeAmount: number;
    minTimeBetweenTrades: number;
    tradeDuration: number;
    remainingSolRatioToFinishTrade: number;
    lastTradeStartTime: number;
    publicKey: string;
}

export interface Trade {
  tradePool: string;
  pair: string;
  pairAuthorityAdapter: string;
  tradeDeposit: number;
  strategyNum: number;
  epoch: number;
  state: TradeState;
  closePairTime: number;
  tradeProfit: number;
  isProfitPositive: boolean;
  amountOfTokensToBuy: number;
  amountDepositedTokensToPair: number;
  amountRedeemedFromBonds: number;
  publicKey: string;
}

export enum TradeState {
  Initialized = 'initialized',
  PairDeposited = 'pairDeposited',
  Finished = 'finished',
}
