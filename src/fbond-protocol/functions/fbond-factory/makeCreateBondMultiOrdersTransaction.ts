import { web3 } from 'fbonds-core';
import { BondFeatures } from 'fbonds-core/lib/fbond-protocol/types';
import { chunk, uniqBy } from 'lodash';
import { createBondAndSellToOffers } from './createBondAndSellToOffers';
import {
  BONDS_ADMIN_PUBKEY,
  BONDS_PROGRAM_PUBKEY,
  BOND_DECIMAL_DELTA,
  PRECISION_CORRECTION_LAMPORTS,
  PUBKEY_PLACEHOLDER,
} from '../../constants';
import { groupBy } from 'ramda';

export const sendTxnPlaceHolder = async (): Promise<void> => await Promise.resolve();

export interface BondCartOrder {
  orderSize: number; //? lamports
  spotPrice: number; //? lamports
  pairPubkey: string;
  assetReceiver: string;
  durationFilter: number;
  bondFeature: BondFeatures;
}

type MergeBondOrderParamsByPair = (props: { bondOrderParams: BondCartOrder[] }) => BondCartOrder[];
export const mergeBondOrderParamsByPair: MergeBondOrderParamsByPair = ({ bondOrderParams }) => {
  const groupedPairOrderParams = Object.values(groupBy((orderParam) => orderParam.pairPubkey, bondOrderParams));

  const mergedPairsOrderParams = groupedPairOrderParams.map((orderParams: any) =>
    orderParams.reduce((acc, orderParam) => ({
      ...acc,
      orderSize: acc.orderSize + orderParam.orderSize,
      spotPrice:
        (acc.orderSize * acc.spotPrice + orderParam.orderSize * orderParam.spotPrice) /
        (acc.orderSize + orderParam.orderSize),
    })),
  );

  return mergedPairsOrderParams;
};

export interface BondCartOrder {
  orderSize: number; //? lamports
  spotPrice: number; //? lamports
  pairPubkey: string;
  assetReceiver: string;
  durationFilter: number;
  bondFeature: BondFeatures;
}

export interface InstructionsAndSigners {
  instructions: web3.TransactionInstruction[];
  signers?: web3.Signer[];
  lookupTablePublicKeys: {
    tablePubkey: web3.PublicKey;
    addresses: web3.PublicKey[];
  }[];
}

type MakeCreateBondMultiOrdersTransaction = (params: {
  marketPubkey: string;
  fraktMarketPubkey: string;
  oracleFloorPubkey: string;
  whitelistEntryPubkey: string;
  // bondOrder: BondOrder;
  bondOrderParams: BondCartOrder[];
  nftMint: string;

  connection: web3.Connection;
  wallet: any;
}) => Promise<{
  createLookupTableTxn: web3.Transaction;
  extendLookupTableTxns: web3.Transaction[];
  createAndSellBondsIxsAndSigners: InstructionsAndSigners;
}>;

export const makeCreateBondMultiOrdersTransaction: MakeCreateBondMultiOrdersTransaction = async ({
  marketPubkey,
  fraktMarketPubkey,
  oracleFloorPubkey,
  whitelistEntryPubkey,
  bondOrderParams,
  nftMint,
  connection,
  wallet,
}) => {
  const amountToReturn =
    Math.trunc(bondOrderParams.reduce((sum, order) => sum + order.orderSize, 0)) * BOND_DECIMAL_DELTA;

  const durationFilter = bondOrderParams.reduce((smallestDurationParam, orderParams) =>
    smallestDurationParam.durationFilter < orderParams.durationFilter ? smallestDurationParam : orderParams,
  ).durationFilter;

  // const {
  //   fbond: bondPubkey,
  //   collateralBox: collateralBoxPubkey,
  //   fbondTokenMint: bondTokenMint,
  //   instructions: createBondIxns,
  //   signers: createBondSigners,
  //   addressesForLookupTable,
  // } = await fbondFactory.createBondWithSingleCollateralPnft({
  //   accounts: {
  //     tokenMint: new web3.PublicKey(nftMint),
  //     userPubkey: wallet.publicKey,
  //   },
  //   args: {
  //     amountToDeposit: 1,
  //     amountToReturn: amountToReturn,
  //     bondDuration: durationFilter,
  //   },
  //   connection,
  //   programId: BONDS_PROGRAM_PUBKEY,
  //   sendTxn: sendTxnPlaceHolder,
  // });

  const mergedPairsOrderParams = mergeBondOrderParamsByPair({
    bondOrderParams,
  });

  const sellBondParamsAndAccounts = mergedPairsOrderParams.map((orderParam) => ({
    minAmountToGet: Math.max(
      Math.floor(
        orderParam.orderSize * orderParam.spotPrice - PRECISION_CORRECTION_LAMPORTS - Math.floor(Math.random() * 10000),
      ),
      0,
    ),
    amountToSell: Math.floor(orderParam.orderSize),
    bondOfferV2: new web3.PublicKey(orderParam.pairPubkey),
    assetReceiver: new web3.PublicKey(orderParam.assetReceiver),
  }));
  console.log('sellBondParamsAndAccounts: ', sellBondParamsAndAccounts);

  const sellingBondsIxsAndSignersWithLookupAccounts = await createBondAndSellToOffers({
    accounts: {
      tokenMint: new web3.PublicKey(nftMint),
      fraktMarket: new web3.PublicKey(fraktMarketPubkey),
      oracleFloor: new web3.PublicKey(oracleFloorPubkey || PUBKEY_PLACEHOLDER),
      whitelistEntry: new web3.PublicKey(whitelistEntryPubkey || PUBKEY_PLACEHOLDER),
      hadoMarket: new web3.PublicKey(marketPubkey),
      userPubkey: wallet.publicKey,
      protocolFeeReceiver: new web3.PublicKey(BONDS_ADMIN_PUBKEY || PUBKEY_PLACEHOLDER),
    },
    addComputeUnits: true,
    args: {
      sellBondParamsAndAccounts,
      amountToDeposit: 1,
      amountToReturn: amountToReturn,
      bondDuration: durationFilter,
    },
    connection,
    programId: new web3.PublicKey(BONDS_PROGRAM_PUBKEY),
    sendTxn: sendTxnPlaceHolder,
  });
  const slot = await connection.getSlot();

  console.log('INITIAL PASSED SLOT: ', slot);
  const combinedAddressesForLookupTable = uniqBy(
    [
      // ...addressesForLookupTable,
      ...sellingBondsIxsAndSignersWithLookupAccounts.addressesForLookupTable,
    ],
    (publicKey) => publicKey.toBase58(),
  );
  console.log('combinedAddressesForLookupTable: ', combinedAddressesForLookupTable.length);
  const [lookupTableInst, lookupTableAddress] = web3.AddressLookupTableProgram.createLookupTable({
    authority: wallet.publicKey,
    payer: wallet.publicKey,
    recentSlot: slot - 2,
  });
  const extendInstructions = chunk(combinedAddressesForLookupTable, 20).map((chunkOfAddressesForLookupTable) =>
    web3.AddressLookupTableProgram.extendLookupTable({
      payer: wallet.publicKey,
      authority: wallet.publicKey,
      lookupTable: lookupTableAddress,
      addresses: chunkOfAddressesForLookupTable,
    }),
  );
  const createLookupTableTxn = new web3.Transaction().add(lookupTableInst, extendInstructions[0]);
  const restExtendInstructions = extendInstructions.slice(1, extendInstructions.length);

  const restExtendTransactions = restExtendInstructions.map((extendIx) => new web3.Transaction().add(extendIx));

  return {
    createLookupTableTxn: createLookupTableTxn,
    extendLookupTableTxns: restExtendTransactions,
    createAndSellBondsIxsAndSigners: {
      instructions: [
        // ...createBondIxns,
        ...sellingBondsIxsAndSignersWithLookupAccounts.instructions,
      ],
      signers: [
        // ...createBondSigners,
        ...sellingBondsIxsAndSignersWithLookupAccounts.signers,
      ],
      lookupTablePublicKeys: [
        {
          tablePubkey: lookupTableAddress,
          addresses: combinedAddressesForLookupTable,
        },
      ],
    },
  };
};
