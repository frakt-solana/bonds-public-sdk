import { MAX_ACCOUNTS_IN_FAST_TRACK } from '../../../constants';
import { BondCartOrder, InstructionsAndSigners } from '../../../types';
import { TxnsAndSigners } from '../../../utils/signAndSendAllTransactionsInSequence';
import { signAndSendV0TransactionWithLookupTablesSeparateSignatures } from '../../../utils/signAndSendV0TransactionWithLookupTablesSeparateSignatures';
import { makeCreateBondMultiOrdersTransaction } from './makeCreateBondMultiOrdersTransaction';

export const borrow = async ({
  notBondTxns,
  orders: bondOrders,
  connection,
  wallet,
  onAfterSend,
  onError,
  onSuccess,
  isLedger,
  skipPreflight,
}): Promise<boolean> => {
  const bondTransactionsAndSignersChunks = await Promise.all(
    bondOrders.map((order) => {
      return makeCreateBondMultiOrdersTransaction({
        marketPubkey: order.borrowNft.bondParams.marketPubkey,
        fraktMarketPubkey: order.borrowNft.bondParams.whitelistEntry.fraktMarket,
        oracleFloorPubkey: order.borrowNft.bondParams.oracleFloor,
        whitelistEntryPubkey: order.borrowNft.bondParams.whitelistEntry?.publicKey,
        nftMint: order.borrowNft.mint,
        bondOrderParams: order.bondOrderParams,
        connection,
        wallet,
      });
    }),
  );

  const fastTrackBorrows: InstructionsAndSigners[] = bondTransactionsAndSignersChunks
    .filter(
      (txnAndSigners) =>
        txnAndSigners.createAndSellBondsIxsAndSigners.lookupTablePublicKeys.map((lookup) => lookup.addresses).flat()
          .length <= MAX_ACCOUNTS_IN_FAST_TRACK,
    )
    .map((txnAndSigners) => txnAndSigners.createAndSellBondsIxsAndSigners);
  const lookupTableBorrows = bondTransactionsAndSignersChunks.filter(
    (txnAndSigners) =>
      txnAndSigners.createAndSellBondsIxsAndSigners.lookupTablePublicKeys.map((lookup) => lookup.addresses).flat()
        .length > MAX_ACCOUNTS_IN_FAST_TRACK,
  );

  const firstChunk: TxnsAndSigners[] = [
    ...lookupTableBorrows
      .map((chunk) => ({
        transaction: chunk.createLookupTableTxn,
        signers: [],
      }))
      .flat(),
  ];

  const secondChunk: TxnsAndSigners[] = [
    ...lookupTableBorrows
      .map((chunk) =>
        chunk.extendLookupTableTxns.map((transaction) => ({
          transaction,
          signers: [],
        })),
      )
      .flat(),
  ];

  const createAndSellBondsIxsAndSignersChunk: InstructionsAndSigners[] = [
    ...lookupTableBorrows.map((chunk) => chunk.createAndSellBondsIxsAndSigners).flat(),
  ];

  return await signAndSendV0TransactionWithLookupTablesSeparateSignatures({
    notBondTxns,
    createLookupTableTxns: firstChunk.map((txn) => txn.transaction),
    extendLookupTableTxns: secondChunk.map((txn) => txn.transaction),
    v0InstructionsAndSigners: createAndSellBondsIxsAndSignersChunk,
    fastTrackInstructionsAndSigners: fastTrackBorrows,
    // lookupTablePublicKey: bondTransactionsAndSignersChunks,
    isLedger,
    skipPreflight,

    connection,
    wallet,
    commitment: 'confirmed',
    onAfterSend,
    onSuccess,
    onError,
  });
};
