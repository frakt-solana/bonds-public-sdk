import { BondTradeTransactionV2, OrderType, PairType } from '../types';
import { TradeActivity } from './getTradeActivities';

type GetTradeActivitiesV2 = (params: { bondTradeTransactions: BondTradeTransactionV2[] }) => TradeActivity[];

export const getTradeActivitiesV2: GetTradeActivitiesV2 = ({ bondTradeTransactions }) => {
  const tradeActivities: TradeActivity[] = bondTradeTransactions.map((tradeTransaction) => {
    return {
      timestamp: tradeTransaction.soldAt,
      signature: tradeTransaction.publicKey,
      pair: tradeTransaction.bondOffer,
      orderType: OrderType.Sell,
      pairType: PairType.TokenForNFT,
      nftMint: tradeTransaction.fbondTokenMint,
      solAmount: tradeTransaction.solAmount + tradeTransaction.feeAmount,
      feeAmount: tradeTransaction.feeAmount,
      amountOfTokens: tradeTransaction.amountOfBonds,
      userMaker: tradeTransaction.user,
      userTaker: tradeTransaction.seller,
      isDirectSell: tradeTransaction.isDirectSell,
      isV2: true,
    };
  });
  return tradeActivities;
};
