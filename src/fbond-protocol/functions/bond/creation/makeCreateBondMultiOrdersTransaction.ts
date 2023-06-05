import { chunk, uniqBy } from 'lodash';
import { createBondAndSellToOffers } from './createBondAndSellToOffers';
import {
  BONDS_ADMIN_PUBKEY,
  BONDS_PROGRAM_PUBKEY,
  BOND_DECIMAL_DELTA,
  PRECISION_CORRECTION_LAMPORTS,
  PUBKEY_PLACEHOLDER,
} from '../../../constants';
import { groupBy } from 'ramda';
import { BondCartOrder, InstructionsAndSigners } from '../../../types';
import { AddressLookupTableProgram, PublicKey, Transaction, Connection } from '@solana/web3.js';
import { createBondAndSellToOffersForTest } from './createBondAndSellToOffersForTest';

export const sendTxnPlaceHolder = async (): Promise<void> => await Promise.resolve();

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

type MakeCreateBondMultiOrdersTransaction = (params: {
  marketPubkey: string;
  fraktMarketPubkey: string;
  oracleFloorPubkey: string;
  whitelistEntryPubkey: string;
  // bondOrder: BondOrder;
  bondOrderParams: BondCartOrder[];
  nftMint: string;

  connection: Connection;
  wallet: any;
}) => Promise<{
  createLookupTableTxn: Transaction;
  extendLookupTableTxns: Transaction[];
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
  //     tokenMint: new PublicKey(nftMint),
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
    bondOfferV2: new PublicKey(orderParam.pairPubkey),
    assetReceiver: new PublicKey(orderParam.assetReceiver),
  }));
  console.log('sellBondParamsAndAccounts: ', sellBondParamsAndAccounts);

  const sellingBondsIxsAndSignersWithLookupAccounts = await createBondAndSellToOffers({
    accounts: {
      tokenMint: new PublicKey(nftMint),
      fraktMarket: new PublicKey(fraktMarketPubkey),
      oracleFloor: new PublicKey(oracleFloorPubkey || PUBKEY_PLACEHOLDER),
      whitelistEntry: new PublicKey(whitelistEntryPubkey || PUBKEY_PLACEHOLDER),
      hadoMarket: new PublicKey(marketPubkey),
      userPubkey: wallet.publicKey,
      protocolFeeReceiver: new PublicKey(BONDS_ADMIN_PUBKEY || PUBKEY_PLACEHOLDER),
    },
    addComputeUnits: true,
    args: {
      sellBondParamsAndAccounts,
      amountToDeposit: 1,
      amountToReturn: amountToReturn,
      bondDuration: durationFilter,
    },
    connection,
    programId: new PublicKey(BONDS_PROGRAM_PUBKEY),
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
  const [lookupTableInst, lookupTableAddress] = AddressLookupTableProgram.createLookupTable({
    authority: wallet.publicKey,
    payer: wallet.publicKey,
    recentSlot: slot - 2,
  });
  const extendInstructions = chunk(combinedAddressesForLookupTable, 20).map((chunkOfAddressesForLookupTable) =>
    AddressLookupTableProgram.extendLookupTable({
      payer: wallet.publicKey,
      authority: wallet.publicKey,
      lookupTable: lookupTableAddress,
      addresses: chunkOfAddressesForLookupTable,
    }),
  );
  const createLookupTableTxn = new Transaction().add(lookupTableInst, extendInstructions[0]);
  const restExtendInstructions = extendInstructions.slice(1, extendInstructions.length);

  const restExtendTransactions = restExtendInstructions.map((extendIx) => new Transaction().add(extendIx));

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
