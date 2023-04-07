import { max, maxBy, sumBy } from 'lodash';
import { calculateNextSpotPrice } from '../helpers';
import { NftSwapPair, OrderType } from '../types';

// import { Market, Pair } from '@frakt/api/bonds';
// import { BorrowNft } from '@frakt/api/nft';
// import { LoanType } from '@frakt/api/loans';

// import { BondParams, Order } from './types';

export interface Market {
  hadoMarket: string;
}

export interface Pair extends NftSwapPair {
  validation: {
    loanToValueFilter: number;
    durationFilter: number;
  };
}

export interface BondParams {
  spotPrice: number;
  pairPubkey: string;
  market: Market;
}

export interface Order {
  orderSize: number; //? lamports

  pricePerShare: number;
  pairPubkey: string;

  nftMint: string;

  mathCounter: number;
}

export interface LoanBond {
  loanValue: number;
  loanFee: number;
  orders: Order[];
}

export type AddOrder = (params: {
  state: { pairs: NftSwapPair[]; orders: Order[] };
  orderSize: number;
  pairPubkey: string;
  nftMint: string;
}) => {
  pairs: NftSwapPair[];
  orders: Order[];
};

export const addOrder: AddOrder = ({ state, orderSize, pairPubkey, nftMint }) => {
  const pair = findPairByPubkey({ pairs: state.pairs, pairPubkey });
  const patchedPair: NftSwapPair = patchPairToNextOrderAfterSell(pair);
  if (getCurrentOrderSize(patchedPair) < orderSize)
    throw Error("Order size should be less or equal to pair's current order size");
  if (patchedPair.buyOrdersQuantity === 0) throw Error('No buy orders on pair');

  const order: Order = {
    orderSize, //? lamports

    pricePerShare: patchedPair.currentSpotPrice,
    pairPubkey: patchedPair.publicKey,

    nftMint,
    mathCounter: patchedPair.mathCounter,
  };
  const newOrders = [...state.orders, order];

  const nextPairState: NftSwapPair = patchPairToNextOrderAfterSell({
    ...patchedPair,
    edgeSettlement:
      patchedPair.buyOrdersQuantity === 1 ? patchedPair.edgeSettlement - orderSize : patchedPair.edgeSettlement,
    bidSettlement: patchedPair.bidSettlement - orderSize,
  });

  const updatedPairs = updatePairInPairs({ pairs: state.pairs, pair: nextPairState });
  return { orders: newOrders, pairs: updatedPairs };
};

export type RemoveOrder = (params: { state: { pairs: NftSwapPair[]; orders: Order[] }; order: Order }) => {
  pairs: NftSwapPair[];
  orders: Order[];
};

export const removeOrder: RemoveOrder = ({ state, order }) => {
  const pair = findPairByPubkey({ pairs: state.pairs, pairPubkey: order.pairPubkey });
  const orderToRemove = state.orders.find(
    (sourceOrder) =>
      sourceOrder.pairPubkey === sourceOrder.pairPubkey &&
      sourceOrder.nftMint === order.nftMint &&
      sourceOrder.orderSize === order.orderSize &&
      sourceOrder.pricePerShare === order.pricePerShare,
  );

  if (!orderToRemove) throw Error('Order not found');
  const patchedPair: NftSwapPair = patchPairToNextOrderAfterSell(pair);

  const newOrders = removeOrderInOrders({
    orders: state.orders,
    order: { ...orderToRemove },
  });

  const orderSizeLeft = patchedPair.bidCap - getCurrentOrderSize(patchedPair);

  if (orderToRemove.orderSize < orderSizeLeft) {
    const nextPairState: NftSwapPair = {
      ...patchedPair,
      edgeSettlement:
        patchedPair.buyOrdersQuantity === 1 || patchedPair.buyOrdersQuantity === 0
          ? Math.min(patchedPair.bidCap, patchedPair.edgeSettlement + orderToRemove.orderSize)
          : patchedPair.edgeSettlement,
      bidSettlement: patchedPair.bidSettlement + orderToRemove.orderSize,
    };
    const updatedPairs = updatePairInPairs({ pairs: state.pairs, pair: nextPairState });
    return { orders: newOrders, pairs: updatedPairs };
  } else {
    const nextPairState: NftSwapPair = patchPairToNextOrderAfterSell({
      ...patchedPair,
      edgeSettlement:
        patchedPair.buyOrdersQuantity === 1 || patchedPair.buyOrdersQuantity === 0
          ? Math.min(patchedPair.bidCap, patchedPair.edgeSettlement + orderToRemove.orderSize)
          : patchedPair.edgeSettlement,
      bidSettlement: (pair.bidCap - (patchedPair.bidSettlement + orderToRemove.orderSize)) * -1,
      buyOrdersQuantity: pair.buyOrdersQuantity + 1,
      mathCounter: pair.mathCounter + 1,
      currentSpotPrice: calculateNextSpotPrice({
        orderType: OrderType.Buy,
        spotPrice: pair.baseSpotPrice,
        delta: pair.bondingCurve.delta,
        bondingCurveType: pair.bondingCurve.bondingType,
        counter: pair.mathCounter,
      }),
    });

    const updatedPairs = updatePairInPairs({ pairs: state.pairs, pair: nextPairState });
    return { orders: newOrders, pairs: updatedPairs };
  }
};
export type RemoveNftOrdersAndRecalculateCart = (params: {
  state: { pairs: NftSwapPair[]; orders: Order[] };

  nftMint: string;
}) => {
  pairs: NftSwapPair[];
  orders: Order[];
};

export const removeNftOrdersAndRecalculateCart: RemoveNftOrdersAndRecalculateCart = ({ state, nftMint }) => {
  const ordersToPermanentlyRemove = state.orders.filter((order) => order.nftMint === nftMint);
  const { pairs: updatedPairsAfterRemove, orders: updatedOrdersAfterRemove } = ordersToPermanentlyRemove.reduce(
    (prevState, currentOrder) => removeOrder({ state: prevState, order: currentOrder }),
    state,
  );

  return { orders: updatedOrdersAfterRemove, pairs: updatedPairsAfterRemove };
};

// const patch

const patchPairToNextOrderAfterSell = (pair: NftSwapPair): NftSwapPair =>
  pair.bidSettlement === pair.bidCap * -1
    ? {
        ...pair,
        bidSettlement: pair.buyOrdersQuantity === 2 ? -(pair.bidCap - pair.edgeSettlement) : 0,
        buyOrdersQuantity: pair.buyOrdersQuantity - 1,
        currentSpotPrice: calculateNextSpotPrice({
          orderType: OrderType.Sell,
          spotPrice: pair.baseSpotPrice,
          delta: pair.bondingCurve.delta,
          bondingCurveType: pair.bondingCurve.bondingType,
          counter: pair.mathCounter,
        }),
        mathCounter: pair.mathCounter - 1,
      }
    : pair;

export const getCurrentOrderSize = (pair: NftSwapPair) => {
  if (pair.buyOrdersQuantity === 1) return pair.edgeSettlement;
  else return pair.bidCap + pair.bidSettlement;
};

export const getTopOrderSize = (pair: Pair) => {
  const patchedPair = patchPairToNextOrderAfterSell(pair);
  if (patchedPair.buyOrdersQuantity <= 1) return patchedPair.edgeSettlement;
  else return patchedPair.bidCap + patchedPair.bidSettlement;
};

type FindPairByPubkey = (params: { pairs: NftSwapPair[]; pairPubkey: string }) => NftSwapPair;
const findPairByPubkey: FindPairByPubkey = ({ pairs, pairPubkey }) =>
  pairs.find((pair) => pair.publicKey === pairPubkey) as any;

type UpdatePairInPairs = (params: { pairs: NftSwapPair[]; pair: NftSwapPair }) => NftSwapPair[];
const updatePairInPairs: UpdatePairInPairs = ({ pairs, pair }) =>
  pairs.map((sourcePair) => (sourcePair.publicKey === pair.publicKey ? pair : sourcePair));
const areOrdersEqual = (order1: Order, order2: Order) =>
  order1.pairPubkey === order2.pairPubkey &&
  order1.nftMint === order2.nftMint &&
  order1.orderSize === order2.orderSize &&
  order1.pricePerShare === order2.pricePerShare;
type UpdateOrderInOrders = (params: { orders: Order[]; order: Order }) => Order[];
const updateOrderInOrders: UpdateOrderInOrders = ({ orders, order }) =>
  orders.map((prevOrder, index) =>
    index === orders.findIndex((sourceOrder) => areOrdersEqual(sourceOrder, order)) ? order : prevOrder,
  );

type RemoveOrderInOrders = (params: { orders: Order[]; order: Order }) => Order[];
const removeOrderInOrders: RemoveOrderInOrders = ({ orders, order }) =>
  orders.filter((prevOrder, index) => index !== orders.findIndex((sourceOrder) => areOrdersEqual(sourceOrder, order)));

// type AreOrdersEqual = (params: { order1: Order; order2: Order }) => boolean;

type GetCheapestPairForBorrowValuePartial = (params: {
  borrowValueBonds: number;
  valuation: number;
  pairs: Pair[];
  durationFilter: number;
}) => Pair | null;
export const getCheapestPairForBorrowValuePartial: GetCheapestPairForBorrowValuePartial = ({
  borrowValueBonds,
  valuation,
  pairs,
  durationFilter,
}) => {
  const suitablePairsByDuration = pairs.filter((p) => p.validation.durationFilter === durationFilter);

  const suitableBySettlementAndValidation = suitablePairsByDuration.filter((pair) => {
    const loanToValueLamports = valuation * (pair.validation.loanToValueFilter * 0.01 * 0.01);

    const orderSize = getCurrentOrderSize(pair);

    return (
      loanToValueLamports >= borrowValueBonds * BOND_DECIMAL_DELTA && orderSize >= EFFECTIVE_PAIR_ORDER_SIZE_THRESHOLD
    );
  });

  return maxBy(suitableBySettlementAndValidation, (pair) => pair.currentSpotPrice) || null;
};

type GetCheapestPairForBorrowValueWhole = (params: {
  borrowValueBonds: number;
  valuation: number;
  pairs: Pair[];
  durationFilter: number;
}) => Pair | null;
export const getCheapestPairForBorrowValueWhole: GetCheapestPairForBorrowValueWhole = ({
  borrowValueBonds,
  valuation,
  pairs,
  durationFilter,
}) => {
  const suitablePairsByDuration = pairs.filter((p) => p.validation.durationFilter === durationFilter);

  const suitableBySettlementAndValidation = suitablePairsByDuration.filter((pair) => {
    const loanToValueLamports = valuation * (pair.validation.loanToValueFilter * 0.01 * 0.01);

    const orderSize = getCurrentOrderSize(pair);

    return loanToValueLamports >= borrowValueBonds * BOND_DECIMAL_DELTA && orderSize >= borrowValueBonds;
  });

  return maxBy(suitableBySettlementAndValidation, (pair) => pair.currentSpotPrice) || null;
};

export const BOND_DECIMAL_DELTA = 1e4;
export const EFFECTIVE_PAIR_ORDER_SIZE_THRESHOLD = 1e2; // 0.1 BOND
export const BASE_POINTS = 1e4;

type GetMaxBorrowValue = (params: { pairs: Pair[]; collectionFloor: number; durationFilter: number }) => number; //? lamports
export const getMaxBorrowValue: GetMaxBorrowValue = ({ pairs, collectionFloor, durationFilter }) => {
  const NFT_MINT_PLACEHOLDER = 'NFT_MINT_PLACEHOLDER';
  const maxBorrowValues = pairs.map((pairToTry) => {
    const loanToValueLamports = collectionFloor * (pairToTry.validation.loanToValueFilter / BASE_POINTS);
    const maxValueBonds = loanToValueLamports / BOND_DECIMAL_DELTA;
    let bondsLeft = maxValueBonds;
    let currentState: { pairs: Pair[]; orders: Order[] } = { pairs, orders: [] };
    let currentBestPair = getCheapestPairForBorrowValuePartial({
      borrowValueBonds: maxValueBonds,
      valuation: collectionFloor,
      pairs: currentState.pairs,
      durationFilter,
    });

    while (currentBestPair !== null && bondsLeft !== 0) {
      const orderSize = getCurrentOrderSize(currentBestPair);
      console.log('bondsLeft: ', bondsLeft);

      console.log('orderSize: ', orderSize);

      bondsLeft -= Math.min(orderSize, bondsLeft);
      currentState = addOrder({
        state: currentState,
        orderSize,
        pairPubkey: currentBestPair.publicKey,
        nftMint: NFT_MINT_PLACEHOLDER,
      }) as { pairs: Pair[]; orders: Order[] };
      currentBestPair = getCheapestPairForBorrowValuePartial({
        borrowValueBonds: maxValueBonds,
        valuation: collectionFloor,
        pairs: currentState.pairs,
        durationFilter,
      });
    }

    // console.log('bondsLeft: ', bondsLeft);
    console.log('currentState: ', currentState);

    if (currentState.orders.length === 0) return 0;
    const sumOfValues = sumBy(currentState.orders, (order) => order.pricePerShare * order.orderSize);
    return sumOfValues;
  });

  const maxBorrowValue = max(maxBorrowValues) || 0;
  //   const maxValueBonds = Math.min(pair.edgeSettlement, loanToValueLamports / BOND_DECIMAL_DELTA);
  //   return maxValueBonds * pair.currentSpotPrice;
  return maxBorrowValue;
};

type GetBondLoansCombinations = (params: {
  pairs: Pair[];
  nfts: string[];
  collectionFloor: number;
  durationFilter: number;
}) => { pairs: Pair[]; orders: Order[] }[]; //? lamports
export const getBondLoansCombinations: GetBondLoansCombinations = ({
  pairs,
  nfts,
  collectionFloor,
  durationFilter,
}) => {
  const NFT_MINT_PLACEHOLDER = 'NFT_MINT_PLACEHOLDER';
  const loansCombinations = pairs.map((pairToTry) => {
    const loanToValueLamports = collectionFloor * (pairToTry.validation.loanToValueFilter / BASE_POINTS);
    const maxValueBonds = loanToValueLamports / BOND_DECIMAL_DELTA;
    let nftsLeft = nfts;
    let currentState: { pairs: Pair[]; orders: Order[] } = { pairs, orders: [] };
    let currentBestPair = getCheapestPairForBorrowValuePartial({
      borrowValueBonds: maxValueBonds,
      valuation: collectionFloor,
      pairs: currentState.pairs,
      durationFilter,
    });

    console.log('currentBestPair: ', currentBestPair);
    console.log('nftsLeft: ', nftsLeft);

    while (currentBestPair !== null && nftsLeft.length !== 0) {
      const orderSize = getCurrentOrderSize(currentBestPair);
      console.log('nftsLeft: ', nftsLeft);
      console.log('currentBestPair: ', currentBestPair);

      console.log('orderSize: ', orderSize);

      currentState = addOrder({
        state: currentState,
        orderSize,
        pairPubkey: currentBestPair.publicKey,
        nftMint: nftsLeft[0],
      }) as { pairs: Pair[]; orders: Order[] };
      currentBestPair = getCheapestPairForBorrowValuePartial({
        borrowValueBonds: maxValueBonds,
        valuation: collectionFloor,
        pairs: currentState.pairs,
        durationFilter,
      });
      nftsLeft.shift();
    }

    return currentState;
  });

  return loansCombinations;
};

type GetBondLoansCombinationsSimple = (params: { pairs: Pair[]; nfts: string[]; collectionFloor: number }) => {
  pairs: Pair[];
  loanBonds: LoanBond[];
}; //? lamports
export const getBondLoansCombinationsSimple: GetBondLoansCombinationsSimple = ({ pairs, nfts, collectionFloor }) => {
  const loanBonds: LoanBond[] = [];
  let currentState: { pairs: Pair[]; orders: Order[] } = { pairs, orders: [] };

  for (let nft of nfts) {
    const maxBorrowValue = getMaxBorrowValueOptimized({ pairs, collectionFloor });
    if (!maxBorrowValue) break;
    let { takenOrders } = getBestOrdersByBorrowValue({
      borrowValue: maxBorrowValue,
      collectionFloor: collectionFloor,
      pairs: currentState.pairs,
    });
    // console.log('maxBorrowValue: ', maxBorrowValue, ', takenOrders: ', takenOrders);

    for (let order of takenOrders) {
      currentState = addOrder({
        state: currentState,
        orderSize: order.orderSize,
        pairPubkey: order.pairPubkey,
        nftMint: nft,
      }) as { pairs: Pair[]; orders: Order[] };
    }
    const loanBond: LoanBond = takenOrders
      .map((order) => ({
        ...order,
        orderValue: order.pricePerShare * order.orderSize,
        orderFee: order.orderSize * BOND_DECIMAL_DELTA - order.pricePerShare * order.orderSize,
      }))
      .reduce(
        ({ loanValue, loanFee, orders }, order) => ({
          loanValue: loanValue + order.orderValue,
          loanFee: loanFee + order.orderFee,
          orders,
        }),
        { loanValue: 0, loanFee: 0, orders: takenOrders },
      );

    loanBonds.push(loanBond);
  }

  return { loanBonds, pairs: currentState.pairs };
};
// type GetPairMaxBorrowValue = (params: {
//     pair: Pair;
//     collectionFloor: number;
//   }) => number; //? lamports
//   export const getPairMaxBorrowValue: GetPairMaxBorrowValue = ({
//     pair,
//     collectionFloor,
//   }) => {
//     const loanToValueLamports =
//       collectionFloor * (pair.validation.loanToValueFilter / 1e4);
//     const maxValueBonds = Math.min(
//       pair.edgeSettlement,
//       loanToValueLamports / BOND_DECIMAL_DELTA,
//     );
//     return maxValueBonds * pair.currentSpotPrice;
//   };

//   type GetPairWithMaxBorrowValue = (params: {
//     pairs: Pair[];
//     collectionFloor: number;
//     durationFilter?: number;
//   }) => Pair;
//   export const getPairWithMaxBorrowValueWhole: GetPairWithMaxBorrowValue = ({
//     pairs,
//     collectionFloor,
//     durationFilter = 7, //? Days
//   }) => {
//     const suitablePairsByDuration = pairs.filter((p) =>
//       pairLoanDurationFilter({ pair: p, durationFilter }),
//     );

//     const pairWithMaxBorrowValue = maxBy(suitablePairsByDuration, (p) =>
//       getPairMaxBorrowValue({ pair: p, collectionFloor }),
//     );

//     return pairWithMaxBorrowValue;
//   };

type GetMaxBorrowValueOptimized = (params: { pairs: Pair[]; collectionFloor: number }) => number; //? lamports
export const getMaxBorrowValueOptimized: GetMaxBorrowValueOptimized = ({ pairs, collectionFloor }) => {
  const orders: Order[] = pairs
    .reduce((orders, pair) => [...orders, ...rolloutOrdersFromPair({ pair })], [] as any)
    .sort((a, b) => b.pricePerShare - a.pricePerShare);
  const ltvByPairPubkey = pairs.reduce(
    (acc, pair) => ({ ...acc, [pair.publicKey]: pair.validation.loanToValueFilter }),
    {},
  );
  const pairsSortedByLtv = pairs.sort(
    (pairA, pairB) => pairA.validation.loanToValueFilter - pairB.validation.loanToValueFilter,
  );
  const maxBorrowValue = pairsSortedByLtv.reduce((maxBorrowValue, pair) => {
    const loanToValueLamports = collectionFloor * (pair.validation.loanToValueFilter / BASE_POINTS);
    const maxSizeBonds = loanToValueLamports / BOND_DECIMAL_DELTA;

    const borrowValueForThisPair = orders
      .filter((order) => ltvByPairPubkey[order.pairPubkey] >= pair.validation.loanToValueFilter)
      .reduce(
        (borrowValueAndSize, order) => ({
          borrowValue:
            borrowValueAndSize.borrowValue + order.pricePerShare * Math.min(borrowValueAndSize.size, order.orderSize),
          size: borrowValueAndSize.size - Math.min(borrowValueAndSize.size, order.orderSize),
        }),
        { borrowValue: 0, size: maxSizeBonds },
      );

    return Math.max(borrowValueForThisPair.borrowValue, maxBorrowValue);
  }, 0);
  // const borrowValues = pairs.
  return maxBorrowValue;
};

type GetBestOrdersByBorrowValue = (params: { pairs: Pair[]; collectionFloor: number; borrowValue: number }) => {
  maxBorrowValue: number;
  takenOrders: Order[];
}; //? lamports
export const getBestOrdersByBorrowValue: GetBestOrdersByBorrowValue = ({ pairs, collectionFloor, borrowValue }) => {
  const originalOrders: Order[] = pairs
    .reduce((ordersRolled, pair) => [...ordersRolled, ...rolloutOrdersFromPair({ pair })], [] as any)
    .sort((a, b) => b.pricePerShare - a.pricePerShare);
  const ltvByPairPubkey = pairs.reduce(
    (acc, pair) => ({ ...acc, [pair.publicKey]: pair.validation.loanToValueFilter }),
    {},
  );

  // console.log('pairs: ', pairs);

  // console.log('ltvByPairPubkey: ', ltvByPairPubkey);
  const pairsSortedByLtv = pairs.sort(
    (pairA, pairB) => pairA.validation.loanToValueFilter - pairB.validation.loanToValueFilter,
  );
  // console.log('pairsSortedByLtv: ', pairsSortedByLtv)
  const maxBorrowValueAndOrders = pairsSortedByLtv.reduce(
    ({ takenOrders, maxBorrowValue }, pair) => {
      if (maxBorrowValue >= borrowValue) return { maxBorrowValue, takenOrders };
      const loanToValueLamports = collectionFloor * (pair.validation.loanToValueFilter / BASE_POINTS);
      const maxSizeBonds = loanToValueLamports / BOND_DECIMAL_DELTA;

      const ordersByPair = originalOrders
        .filter((order) => ltvByPairPubkey[order.pairPubkey] >= pair.validation.loanToValueFilter)
        .reduce(
          (borrowValueAndSize, order) => {
            const fullOrderSize = Math.min(borrowValueAndSize.size, order.orderSize);
            const fullBorrowValue = borrowValueAndSize.currentBorrowValue + order.pricePerShare * fullOrderSize;
            const dirtyBorrowValue = Math.min(borrowValue, fullBorrowValue);
            const currentOrderSizeToDeduct =
              fullBorrowValue - dirtyBorrowValue === 0
                ? fullOrderSize
                : Math.ceil((dirtyBorrowValue - borrowValueAndSize.currentBorrowValue) / order.pricePerShare);

            const size = borrowValueAndSize.size - currentOrderSizeToDeduct;
            const currentBorrowValue =
              borrowValueAndSize.currentBorrowValue + order.pricePerShare * currentOrderSizeToDeduct;
            // const sizeToDeduct = Math.min(borrowValueAndSize.size, order.orderSize);
            // const borrowValue = borrowValueAndSize.borrowValue + order.pricePerShare * sizeToDeduct;
            // const size = borrowValueAndSize.size - sizeToDeduct;
            const newTakenOrders = [
              ...borrowValueAndSize.affected0rders,
              {
                ...order,
                orderSize: currentOrderSizeToDeduct,
                ltv: ltvByPairPubkey[order.pairPubkey],
              },
            ];
            return {
              currentBorrowValue,
              size,
              affected0rders: newTakenOrders,
            };
          },
          { currentBorrowValue: 0, size: maxSizeBonds, affected0rders: [] as any },
        );
      return ordersByPair.currentBorrowValue > maxBorrowValue
        ? { maxBorrowValue: ordersByPair.currentBorrowValue, takenOrders: ordersByPair.affected0rders }
        : { maxBorrowValue, takenOrders };
    },
    { maxBorrowValue: 0 as number, takenOrders: originalOrders as any },
  );
  // const borrowValues = pairs.
  return {
    ...maxBorrowValueAndOrders,
    takenOrders: maxBorrowValueAndOrders.takenOrders.filter((takenOrder) => takenOrder.orderSize > 0),
  };
};

type GetBestOrdersForExit = (params: { pairs: Pair[]; loanToValueFilter: number; amountOfBonds: number }) => {
  maxBorrowValue: number;
  takenOrders: Order[];
}; //? lamports
export const getBestOrdersForExit: GetBestOrdersForExit = ({ pairs, loanToValueFilter, amountOfBonds }) => {
  const pairsFilteredLtv = pairs.filter((pair) => pair.validation.loanToValueFilter >= loanToValueFilter);

  const originalOrders: Order[] = pairsFilteredLtv
    .reduce((ordersRolled, pair) => [...ordersRolled, ...rolloutOrdersFromPair({ pair })], [] as any)
    .sort((a, b) => b.pricePerShare - a.pricePerShare);

  // console.log('pairs: ', pairs);

  // console.log('ltvByPairPubkey: ', ltvByPairPubkey);
  // console.log('pairsSortedByLtv: ', pairsSortedByLtv)
  const maxBorrowValueAndOrders = originalOrders.reduce(
    ({ takenOrders, maxBorrowValue, remainingBondsToSell }, order) => {
      if (remainingBondsToSell === 0) {
        return { takenOrders, maxBorrowValue, remainingBondsToSell };
      }
      const amountOfBondsToSellIntoThisOrder = Math.min(order.orderSize, remainingBondsToSell);
      const newTakenOrders = [...takenOrders, { ...order, orderSize: amountOfBondsToSellIntoThisOrder }];
      const nextMaxBorrowValue = maxBorrowValue + amountOfBondsToSellIntoThisOrder * order.pricePerShare;
      const nextRemainingBondsToSell = remainingBondsToSell - amountOfBondsToSellIntoThisOrder;
      return {
        takenOrders: newTakenOrders,
        maxBorrowValue: nextMaxBorrowValue,
        remainingBondsToSell: nextRemainingBondsToSell,
      };
    },
    {
      maxBorrowValue: 0 as number,
      takenOrders: [] as Order[],
      remainingBondsToSell: amountOfBonds,
    },
  );
  // const borrowValues = pairs.
  return {
    ...maxBorrowValueAndOrders,
    takenOrders: maxBorrowValueAndOrders.takenOrders.filter((takenOrder) => takenOrder.orderSize > 0),
  };
};

type RolloutOrdersFromPair = (params: { pair: Pair }) => Order[]; //? lamports
export const rolloutOrdersFromPair: RolloutOrdersFromPair = ({ pair }) => {
  const orders: Order[] = [];
  // console.log('pair: ', pair);
  for (
    let currentCounter = pair.mathCounter;
    currentCounter > pair.mathCounter - pair.buyOrdersQuantity;
    currentCounter--
  ) {
    const currentOrderSize =
      currentCounter === pair.mathCounter - pair.buyOrdersQuantity + 1
        ? pair.edgeSettlement
        : currentCounter === pair.mathCounter
        ? getCurrentOrderSize(pair)
        : pair.bidCap;
    const currentSpotPrice = calculateNextSpotPrice({
      orderType: OrderType.Sell,
      spotPrice: pair.baseSpotPrice,
      delta: pair.bondingCurve.delta,
      bondingCurveType: pair.bondingCurve.bondingType,
      counter: currentCounter + 1,
    });
    const order: Order = {
      mathCounter: currentCounter,
      nftMint: '',
      pairPubkey: pair.publicKey,
      pricePerShare: currentSpotPrice,
      orderSize: currentOrderSize,
    };
    orders.push(order);
  }
  return orders;
};
