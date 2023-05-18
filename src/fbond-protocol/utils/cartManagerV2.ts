import { max, minBy, maxBy, sumBy, take } from 'lodash';
import { calculateNextSpotPrice } from '../helpers';
import { BondOfferV2, OrderType } from '../types';

// import { Market, BondOfferV2 } from '@frakt/api/bonds';
// import { BorrowNft } from '@frakt/api/nft';
// import { LoanType } from '@frakt/api/loans';

// import { BondParams, Order } from './types';

export interface Market {
  hadoMarket: string;
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
  state: { bondOffers: BondOfferV2[]; orders: Order[] };
  orderSize: number;
  pairPubkey: string;
  nftMint: string;
}) => {
  bondOffers: BondOfferV2[];
  orders: Order[];
};

export const addOrder: AddOrder = ({ state, orderSize, pairPubkey, nftMint }) => {
  const bondOffer = findPairByPubkey({ bondOffers: state.bondOffers, pairPubkey });
  const patchedPair: BondOfferV2 = patchPairToNextOrderAfterSell(bondOffer);
  if (getCurrentOrderSize(patchedPair) < orderSize)
    throw Error("Order size should be less or equal to bondOffer's current order size");
  if (patchedPair.buyOrdersQuantity === 0) throw Error('No buy orders on bondOffer');

  const order: Order = {
    orderSize, //? lamports

    pricePerShare: patchedPair.currentSpotPrice,
    pairPubkey: patchedPair.publicKey,

    nftMint,
    mathCounter: patchedPair.mathCounter,
  };
  const newOrders = [...state.orders, order];

  const nextPairState: BondOfferV2 = patchPairToNextOrderAfterSell({
    ...patchedPair,
    edgeSettlement:
      patchedPair.buyOrdersQuantity === 1 ? patchedPair.edgeSettlement - orderSize : patchedPair.edgeSettlement,
    bidSettlement: patchedPair.bidSettlement - orderSize,
  });

  const updatedPairs = updatePairInPairs({ bondOffers: state.bondOffers, bondOffer: nextPairState });
  return { orders: newOrders, bondOffers: updatedPairs };
};

export type RemoveOrder = (params: { state: { bondOffers: BondOfferV2[]; orders: Order[] }; order: Order }) => {
  bondOffers: BondOfferV2[];
  orders: Order[];
};

export const removeOrder: RemoveOrder = ({ state, order }) => {
  const bondOffer = findPairByPubkey({ bondOffers: state.bondOffers, pairPubkey: order.pairPubkey });
  const orderToRemove = state.orders.find(
    (sourceOrder) =>
      sourceOrder.pairPubkey === sourceOrder.pairPubkey &&
      sourceOrder.nftMint === order.nftMint &&
      sourceOrder.orderSize === order.orderSize &&
      sourceOrder.pricePerShare === order.pricePerShare,
  );

  if (!orderToRemove) throw Error('Order not found');
  const patchedPair: BondOfferV2 = patchPairToNextOrderAfterSell(bondOffer);

  const newOrders = removeOrderInOrders({
    orders: state.orders,
    order: { ...orderToRemove },
  });

  const orderSizeLeft = patchedPair.bidCap - getCurrentOrderSize(patchedPair);

  if (orderToRemove.orderSize < orderSizeLeft) {
    const nextPairState: BondOfferV2 = {
      ...patchedPair,
      edgeSettlement:
        patchedPair.buyOrdersQuantity === 1 || patchedPair.buyOrdersQuantity === 0
          ? Math.min(patchedPair.bidCap, patchedPair.edgeSettlement + orderToRemove.orderSize)
          : patchedPair.edgeSettlement,
      bidSettlement: patchedPair.bidSettlement + orderToRemove.orderSize,
    };
    const updatedPairs = updatePairInPairs({ bondOffers: state.bondOffers, bondOffer: nextPairState });
    return { orders: newOrders, bondOffers: updatedPairs };
  } else {
    const nextPairState: BondOfferV2 = patchPairToNextOrderAfterSell({
      ...patchedPair,
      edgeSettlement:
        patchedPair.buyOrdersQuantity === 1 || patchedPair.buyOrdersQuantity === 0
          ? Math.min(patchedPair.bidCap, patchedPair.edgeSettlement + orderToRemove.orderSize)
          : patchedPair.edgeSettlement,
      bidSettlement: (bondOffer.bidCap - (patchedPair.bidSettlement + orderToRemove.orderSize)) * -1,
      buyOrdersQuantity: bondOffer.buyOrdersQuantity + 1,
      mathCounter: bondOffer.mathCounter + 1,
      currentSpotPrice: calculateNextSpotPrice({
        orderType: OrderType.Buy,
        spotPrice: bondOffer.baseSpotPrice,
        delta: bondOffer.bondingCurve.delta,
        bondingCurveType: bondOffer.bondingCurve.bondingType,
        counter: bondOffer.mathCounter,
      }),
    });

    const updatedPairs = updatePairInPairs({ bondOffers: state.bondOffers, bondOffer: nextPairState });
    return { orders: newOrders, bondOffers: updatedPairs };
  }
};
export type RemoveNftOrdersAndRecalculateCart = (params: {
  state: { bondOffers: BondOfferV2[]; orders: Order[] };

  nftMint: string;
}) => {
  bondOffers: BondOfferV2[];
  orders: Order[];
};

export const removeNftOrdersAndRecalculateCart: RemoveNftOrdersAndRecalculateCart = ({ state, nftMint }) => {
  const ordersToPermanentlyRemove = state.orders.filter((order) => order.nftMint === nftMint);
  const { bondOffers: updatedPairsAfterRemove, orders: updatedOrdersAfterRemove } = ordersToPermanentlyRemove.reduce(
    (prevState, currentOrder) => removeOrder({ state: prevState, order: currentOrder }),
    state,
  );

  return { orders: updatedOrdersAfterRemove, bondOffers: updatedPairsAfterRemove };
};

// const patch

const patchPairToNextOrderAfterSell = (bondOffer: BondOfferV2): BondOfferV2 =>
  bondOffer.bidSettlement === bondOffer.bidCap * -1
    ? {
        ...bondOffer,
        bidSettlement: bondOffer.buyOrdersQuantity === 2 ? -(bondOffer.bidCap - bondOffer.edgeSettlement) : 0,
        buyOrdersQuantity: bondOffer.buyOrdersQuantity - 1,
        currentSpotPrice: calculateNextSpotPrice({
          orderType: OrderType.Sell,
          spotPrice: bondOffer.baseSpotPrice,
          delta: bondOffer.bondingCurve.delta,
          bondingCurveType: bondOffer.bondingCurve.bondingType,
          counter: bondOffer.mathCounter,
        }),
        mathCounter: bondOffer.mathCounter - 1,
      }
    : bondOffer;

export const getCurrentOrderSize = (bondOffer: BondOfferV2) => {
  if (bondOffer.buyOrdersQuantity === 1) return bondOffer.edgeSettlement;
  else return bondOffer.bidCap + bondOffer.bidSettlement;
};

export const getTopOrderSize = (bondOffer: BondOfferV2) => {
  const patchedPair = patchPairToNextOrderAfterSell(bondOffer);
  if (patchedPair.buyOrdersQuantity <= 1) return patchedPair.edgeSettlement;
  else return patchedPair.bidCap + patchedPair.bidSettlement;
};

type FindPairByPubkey = (params: { bondOffers: BondOfferV2[]; pairPubkey: string }) => BondOfferV2;
const findPairByPubkey: FindPairByPubkey = ({ bondOffers, pairPubkey }) =>
  bondOffers.find((bondOffer) => bondOffer.publicKey === pairPubkey) as any;

type UpdatePairInPairs = (params: { bondOffers: BondOfferV2[]; bondOffer: BondOfferV2 }) => BondOfferV2[];
const updatePairInPairs: UpdatePairInPairs = ({ bondOffers, bondOffer }) =>
  bondOffers.map((sourcePair) => (sourcePair.publicKey === bondOffer.publicKey ? bondOffer : sourcePair));
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
  bondOffers: BondOfferV2[];
  durationFilter: number;
}) => BondOfferV2 | null;
export const getCheapestPairForBorrowValuePartial: GetCheapestPairForBorrowValuePartial = ({
  borrowValueBonds,
  valuation,
  bondOffers,
  durationFilter,
}) => {
  const suitablePairsByDuration = bondOffers.filter((p) => p.validation.durationFilter === durationFilter);

  const suitableBySettlementAndValidation = suitablePairsByDuration.filter((bondOffer) => {
    const loanToValueLamports = valuation * (bondOffer.validation.loanToValueFilter * 0.01 * 0.01);

    const orderSize = getCurrentOrderSize(bondOffer);

    return (
      loanToValueLamports >= borrowValueBonds * BOND_DECIMAL_DELTA && orderSize >= EFFECTIVE_PAIR_ORDER_SIZE_THRESHOLD
    );
  });

  return maxBy(suitableBySettlementAndValidation, (bondOffer) => bondOffer.currentSpotPrice) || null;
};

type GetCheapestPairForBorrowValueWhole = (params: {
  borrowValueBonds: number;
  valuation: number;
  bondOffers: BondOfferV2[];
  durationFilter: number;
}) => BondOfferV2 | null;
export const getCheapestPairForBorrowValueWhole: GetCheapestPairForBorrowValueWhole = ({
  borrowValueBonds,
  valuation,
  bondOffers,
  durationFilter,
}) => {
  const suitablePairsByDuration = bondOffers.filter((p) => p.validation.durationFilter === durationFilter);

  const suitableBySettlementAndValidation = suitablePairsByDuration.filter((bondOffer) => {
    const loanToValueLamports = valuation * (bondOffer.validation.loanToValueFilter * 0.01 * 0.01);

    const orderSize = getCurrentOrderSize(bondOffer);

    return loanToValueLamports >= borrowValueBonds * BOND_DECIMAL_DELTA && orderSize >= borrowValueBonds;
  });

  return maxBy(suitableBySettlementAndValidation, (bondOffer) => bondOffer.currentSpotPrice) || null;
};

export const BOND_DECIMAL_DELTA = 1e4;
export const EFFECTIVE_PAIR_ORDER_SIZE_THRESHOLD = 1e2; // 0.1 BOND
export const BASE_POINTS = 1e4;

type GetMaxBorrowValue = (params: {
  bondOffers: BondOfferV2[];
  collectionFloor: number;
  durationFilter: number;
}) => number; //? lamports
export const getMaxBorrowValue: GetMaxBorrowValue = ({ bondOffers, collectionFloor, durationFilter }) => {
  const NFT_MINT_PLACEHOLDER = 'NFT_MINT_PLACEHOLDER';
  const maxBorrowValues = bondOffers.map((pairToTry) => {
    const loanToValueLamports = collectionFloor * (pairToTry.validation.loanToValueFilter / BASE_POINTS);
    const maxValueBonds = loanToValueLamports / BOND_DECIMAL_DELTA;
    let bondsLeft = maxValueBonds;
    let currentState: { bondOffers: BondOfferV2[]; orders: Order[] } = { bondOffers, orders: [] };
    let currentBestPair = getCheapestPairForBorrowValuePartial({
      borrowValueBonds: maxValueBonds,
      valuation: collectionFloor,
      bondOffers: currentState.bondOffers,
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
      }) as { bondOffers: BondOfferV2[]; orders: Order[] };
      currentBestPair = getCheapestPairForBorrowValuePartial({
        borrowValueBonds: maxValueBonds,
        valuation: collectionFloor,
        bondOffers: currentState.bondOffers,
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
  //   const maxValueBonds = Math.min(bondOffer.edgeSettlement, loanToValueLamports / BOND_DECIMAL_DELTA);
  //   return maxValueBonds * bondOffer.currentSpotPrice;
  return maxBorrowValue;
};

type GetBondLoansCombinations = (params: {
  bondOffers: BondOfferV2[];
  nfts: string[];
  collectionFloor: number;
  durationFilter: number;
}) => { bondOffers: BondOfferV2[]; orders: Order[] }[]; //? lamports
export const getBondLoansCombinations: GetBondLoansCombinations = ({
  bondOffers,
  nfts,
  collectionFloor,
  durationFilter,
}) => {
  const NFT_MINT_PLACEHOLDER = 'NFT_MINT_PLACEHOLDER';
  const loansCombinations = bondOffers.map((pairToTry) => {
    const loanToValueLamports = collectionFloor * (pairToTry.validation.loanToValueFilter / BASE_POINTS);
    const maxValueBonds = loanToValueLamports / BOND_DECIMAL_DELTA;
    let nftsLeft = nfts;
    let currentState: { bondOffers: BondOfferV2[]; orders: Order[] } = { bondOffers, orders: [] };
    let currentBestPair = getCheapestPairForBorrowValuePartial({
      borrowValueBonds: maxValueBonds,
      valuation: collectionFloor,
      bondOffers: currentState.bondOffers,
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
      }) as { bondOffers: BondOfferV2[]; orders: Order[] };
      currentBestPair = getCheapestPairForBorrowValuePartial({
        borrowValueBonds: maxValueBonds,
        valuation: collectionFloor,
        bondOffers: currentState.bondOffers,
        durationFilter,
      });
      nftsLeft.shift();
    }

    return currentState;
  });

  return loansCombinations;
};

type GetBondLoansCombinationsSimple = (params: {
  bondOffers: BondOfferV2[];
  nfts: string[];
  collectionFloor: number;
}) => {
  bondOffers: BondOfferV2[];
  loanBonds: LoanBond[];
}; //? lamports
export const getBondLoansCombinationsSimple: GetBondLoansCombinationsSimple = ({
  bondOffers,
  nfts,
  collectionFloor,
}) => {
  const loanBonds: LoanBond[] = [];
  let currentState: { bondOffers: BondOfferV2[]; orders: Order[] } = { bondOffers, orders: [] };

  for (let nft of nfts) {
    const maxBorrowValue = getMaxBorrowValueOptimized({ bondOffers, collectionFloor });
    if (!maxBorrowValue) break;
    let { takenOrders } = getBestOrdersByBorrowValue({
      borrowValue: maxBorrowValue,
      collectionFloor: collectionFloor,
      bondOffers: currentState.bondOffers,
    });
    // console.log('maxBorrowValue: ', maxBorrowValue, ', takenOrders: ', takenOrders);

    for (let order of takenOrders) {
      currentState = addOrder({
        state: currentState,
        orderSize: order.orderSize,
        pairPubkey: order.pairPubkey,
        nftMint: nft,
      }) as { bondOffers: BondOfferV2[]; orders: Order[] };
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

  return { loanBonds, bondOffers: currentState.bondOffers };
};
// type GetPairMaxBorrowValue = (params: {
//     bondOffer: BondOfferV2;
//     collectionFloor: number;
//   }) => number; //? lamports
//   export const getPairMaxBorrowValue: GetPairMaxBorrowValue = ({
//     bondOffer,
//     collectionFloor,
//   }) => {
//     const loanToValueLamports =
//       collectionFloor * (bondOffer.validation.loanToValueFilter / 1e4);
//     const maxValueBonds = Math.min(
//       bondOffer.edgeSettlement,
//       loanToValueLamports / BOND_DECIMAL_DELTA,
//     );
//     return maxValueBonds * bondOffer.currentSpotPrice;
//   };

//   type GetPairWithMaxBorrowValue = (params: {
//     bondOffers: BondOfferV2[];
//     collectionFloor: number;
//     durationFilter?: number;
//   }) => BondOfferV2;
//   export const getPairWithMaxBorrowValueWhole: GetPairWithMaxBorrowValue = ({
//     bondOffers,
//     collectionFloor,
//     durationFilter = 7, //? Days
//   }) => {
//     const suitablePairsByDuration = bondOffers.filter((p) =>
//       pairLoanDurationFilter({ bondOffer: p, durationFilter }),
//     );

//     const pairWithMaxBorrowValue = maxBy(suitablePairsByDuration, (p) =>
//       getPairMaxBorrowValue({ bondOffer: p, collectionFloor }),
//     );

//     return pairWithMaxBorrowValue;
//   };

type GetMaxBorrowValueOptimized = (params: { bondOffers: BondOfferV2[]; collectionFloor: number }) => number; //? lamports
export const getMaxBorrowValueOptimized: GetMaxBorrowValueOptimized = ({ bondOffers, collectionFloor }) => {
  const orders: Order[] = bondOffers
    .reduce((orders, bondOffer) => [...orders, ...rolloutOrdersFromPair({ bondOffer })], [] as any)
    .sort((a, b) => b.pricePerShare - a.pricePerShare);
  const ltvByPairPubkey = bondOffers.reduce(
    (acc, bondOffer) => ({ ...acc, [bondOffer.publicKey]: bondOffer.validation.loanToValueFilter }),
    {},
  );
  const pairsSortedByLtv = bondOffers.sort(
    (pairA, pairB) => pairA.validation.loanToValueFilter - pairB.validation.loanToValueFilter,
  );
  const maxBorrowValue = pairsSortedByLtv.reduce((maxBorrowValue, bondOffer) => {
    const loanToValueLamports = collectionFloor * (bondOffer.validation.loanToValueFilter / BASE_POINTS);
    const maxSizeBonds = loanToValueLamports / BOND_DECIMAL_DELTA;

    const borrowValueForThisPair = orders
      .filter((order) => ltvByPairPubkey[order.pairPubkey] >= bondOffer.validation.loanToValueFilter)
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
  // const borrowValues = bondOffers.
  return maxBorrowValue;
};

type GetBestOrdersByBorrowValue = (params: {
  bondOffers: BondOfferV2[];
  collectionFloor: number;
  borrowValue: number;
}) => {
  maxBorrowValue: number;
  takenOrders: Order[];
}; //? lamports
export const getBestOrdersByBorrowValue: GetBestOrdersByBorrowValue = ({
  bondOffers,
  collectionFloor,
  borrowValue,
}) => {
  const originalOrders: Order[] = bondOffers
    .reduce((ordersRolled, bondOffer) => [...ordersRolled, ...rolloutOrdersFromPair({ bondOffer })], [] as any)
    .sort((a, b) => b.pricePerShare - a.pricePerShare);
  const ltvByPairPubkey = bondOffers.reduce(
    (acc, bondOffer) => ({ ...acc, [bondOffer.publicKey]: bondOffer.validation.loanToValueFilter }),
    {},
  );

  // console.log('bondOffers: ', bondOffers);

  // console.log('ltvByPairPubkey: ', ltvByPairPubkey);
  const pairsSortedByLtv = bondOffers.sort(
    (pairA, pairB) => pairA.validation.loanToValueFilter - pairB.validation.loanToValueFilter,
  );
  // console.log('pairsSortedByLtv: ', pairsSortedByLtv)
  const maxBorrowValueAndOrders = pairsSortedByLtv.reduce(
    ({ takenOrders, maxBorrowValue }, bondOffer) => {
      if (maxBorrowValue >= borrowValue) return { maxBorrowValue, takenOrders };
      const loanToValueLamports = collectionFloor * (bondOffer.validation.loanToValueFilter / BASE_POINTS);
      const maxSizeBonds = loanToValueLamports / BOND_DECIMAL_DELTA;

      const ordersByPair = originalOrders
        .filter((order) => ltvByPairPubkey[order.pairPubkey] >= bondOffer.validation.loanToValueFilter)
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
  // const borrowValues = bondOffers.
  return {
    ...maxBorrowValueAndOrders,
    takenOrders: maxBorrowValueAndOrders.takenOrders.filter((takenOrder) => takenOrder.orderSize > 0),
  };
};

type GetBestOrdersForExit = (params: {
  bondOffers: BondOfferV2[];
  loanToValueFilter: number;
  amountOfBonds: number;
}) => {
  maxBorrowValue: number;
  takenOrders: Order[];
}; //? lamports
export const getBestOrdersForExit: GetBestOrdersForExit = ({ bondOffers, loanToValueFilter, amountOfBonds }) => {
  const pairsFilteredLtv = bondOffers
    .filter((bondOffer) => bondOffer.validation.loanToValueFilter >= loanToValueFilter)
    .filter((bondOffer) => bondOffer.buyOrdersQuantity > 0)
    .filter((bondOffer) => bondOffer.fundsSolOrTokenBalance > 0);

  const originalOrders: Order[] = pairsFilteredLtv
    .reduce((ordersRolled, bondOffer) => [...ordersRolled, ...rolloutOrdersFromPair({ bondOffer })], [] as any)
    .sort((a, b) => b.pricePerShare - a.pricePerShare);

  // console.log('bondOffers: ', bondOffers);

  // console.log('ltvByPairPubkey: ', ltvByPairPubkey);
  // console.log('pairsSortedByLtv: ', pairsSortedByLtv)
  const maxBorrowValueAndOrders = takeBestOrders({ orders: originalOrders, amountOfBonds });
  // originalOrders.reduce(
  //   ({ takenOrders, maxBorrowValue, remainingBondsToSell }, order) => {
  //     if (remainingBondsToSell === 0) {
  //       return { takenOrders, maxBorrowValue, remainingBondsToSell };
  //     }
  //     const amountOfBondsToSellIntoThisOrder = Math.min(order.orderSize, remainingBondsToSell);
  //     const newTakenOrders = [...takenOrders, { ...order, orderSize: amountOfBondsToSellIntoThisOrder }];
  //     const nextMaxBorrowValue = maxBorrowValue + amountOfBondsToSellIntoThisOrder * order.pricePerShare;
  //     const nextRemainingBondsToSell = remainingBondsToSell - amountOfBondsToSellIntoThisOrder;
  //     return {
  //       takenOrders: newTakenOrders,
  //       maxBorrowValue: nextMaxBorrowValue,
  //       remainingBondsToSell: nextRemainingBondsToSell,
  //     };
  //   },
  //   {
  //     maxBorrowValue: 0 as number,
  //     takenOrders: [] as Order[],
  //     remainingBondsToSell: amountOfBonds,
  //   },
  // );
  // const borrowValues = bondOffers.
  // const actualAmountOfBondsAvailableForExit = sumBy(maxBorrowValueAndOrders.takenOrders, (order) => order.orderSize);
  // if (actualAmountOfBondsAvailableForExit < amountOfBonds)
  //   return {
  //     maxBorrowValue: 0,
  //     takenOrders: [],
  //   };
  return {
    ...maxBorrowValueAndOrders,
    takenOrders: maxBorrowValueAndOrders.takenOrders.filter((takenOrder) => takenOrder.orderSize > 0),
  };
};

type GetBestOrdersForRefinance = (params: {
  bondOffers: BondOfferV2[];
  loanToValueFilter: number;
  amountOfBonds: number;
}) => {
  maxBorrowValue: number;
  takenOrders: Order[];
  remainingBondsToSell: number;
} | null; //? lamports
export const getBestOrdersForRefinance: GetBestOrdersForRefinance = ({
  bondOffers,
  loanToValueFilter,
  amountOfBonds,
}) => {
  const pairsFilteredLtv = bondOffers
    .filter((bondOffer) => bondOffer.validation.loanToValueFilter >= loanToValueFilter)
    .filter((bondOffer) => bondOffer.buyOrdersQuantity > 0);

  const originalOrdersByPairs: Order[][] = pairsFilteredLtv.map((bondOffer) =>
    rolloutOrdersFromPair({ bondOffer }).sort((a, b) => b.pricePerShare - a.pricePerShare),
  );

  const refinanceOptions = originalOrdersByPairs.map((orders) => takeBestOrders({ orders, amountOfBonds }));

  const bestOrdersForRefinance = !refinanceOptions.find(
    (maxBorrowValueAndOrders) => maxBorrowValueAndOrders.remainingBondsToSell === 0,
  )
    ? minBy(refinanceOptions, (maxBorrowValueAndOrders) => maxBorrowValueAndOrders.remainingBondsToSell)
    : minBy(refinanceOptions, (maxBorrowValueAndOrders) =>
        maxBorrowValueAndOrders.takenOrders.reduce(
          (feeSum, orderParam) => feeSum + orderParam.orderSize * (BASE_POINTS - orderParam.pricePerShare),
          0,
        ),
      );
  return bestOrdersForRefinance || null;
};

type TakeBestOrders = (params: { orders: Order[]; amountOfBonds: number }) => {
  maxBorrowValue: number;
  takenOrders: Order[];
  remainingBondsToSell: number;
}; //? lamports
export const takeBestOrders: TakeBestOrders = ({ orders, amountOfBonds }) => {
  const maxBorrowValueAndOrders = orders.reduce(
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
  // const borrowValues = bondOffers.
  return maxBorrowValueAndOrders;
};

type RolloutOrdersFromPair = (params: { bondOffer: BondOfferV2 }) => Order[]; //? lamports
export const rolloutOrdersFromPair: RolloutOrdersFromPair = ({ bondOffer }) => {
  const orders: Order[] = [];
  // console.log('bondOffer: ', bondOffer);
  // bondOffer: spot price 1 SOL, Delta: 0.1 SOL, buyOrders: 3, size:5 => {1 SOL, size:5}, {0.9 SOL, size}
  for (
    let currentCounter = bondOffer.mathCounter;
    currentCounter > bondOffer.mathCounter - bondOffer.buyOrdersQuantity;
    currentCounter--
  ) {
    const currentOrderSize =
      currentCounter === bondOffer.mathCounter - bondOffer.buyOrdersQuantity + 1
        ? bondOffer.edgeSettlement
        : currentCounter === bondOffer.mathCounter
        ? getCurrentOrderSize(bondOffer)
        : bondOffer.bidCap;
    const currentSpotPrice = calculateNextSpotPrice({
      orderType: OrderType.Sell,
      spotPrice: bondOffer.baseSpotPrice,
      delta: bondOffer.bondingCurve.delta,
      bondingCurveType: bondOffer.bondingCurve.bondingType,
      counter: currentCounter + 1,
    });
    const order: Order = {
      mathCounter: currentCounter,
      nftMint: '',
      pairPubkey: bondOffer.publicKey,
      pricePerShare: currentSpotPrice,
      orderSize: currentOrderSize,
    };
    orders.push(order);
  }
  return orders;
};
