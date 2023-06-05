import {
  AddressLookupTableAccount,
  AddressLookupTableProgram,
  Commitment,
  Connection,
  Signer,
  Transaction,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
  PublicKey,
} from '@solana/web3.js';
import { TxnsAndSigners } from './signAndSendAllTransactionsInSequence';
import { LOOKUP_TABLE, TXNS_IN_ONE_SIGN_FOR_LEDGER } from '../constants';
import { chunk } from 'lodash';

const STANDART_LOOKUP_TABLE = new PublicKey(LOOKUP_TABLE);

export interface InstructionsAndSigners {
  instructions: TransactionInstruction[];
  signers?: Signer[];
  lookupTablePublicKeys: {
    tablePubkey: PublicKey;
    addresses: PublicKey[];
  }[];
}

type SignAndSendV0TransactionWithLookupTablesSeparateSignatures = (props: {
  // lookupTablePublicKeys: PublicKey[];
  notBondTxns: TxnsAndSigners[];

  createLookupTableTxns: Transaction[];
  extendLookupTableTxns: Transaction[];

  fastTrackInstructionsAndSigners: InstructionsAndSigners[];

  v0InstructionsAndSigners: InstructionsAndSigners[];

  connection: Connection;
  wallet: any;

  isLedger?: boolean;
  skipTimeout?: boolean;
  skipPreflight?: boolean;
  commitment?: Commitment;
  onBeforeApprove?: () => void;
  onAfterSend?: () => void;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) => Promise<boolean>;

//? Sequence means that transactions will be signed at once, but will be sent in a sequence by chunks.
//? F.e. txnsAndSigners: [[x, x, x], [y, y, y], [z, z, z]]. Sign all txns at once. But first send [x, x, x], wait for confirmation, send [y, y, y] wait for confirmation, send [z, z, z]
//? It needs when transactions from next chunk are related to transactions from previos chunk
export const signAndSendV0TransactionWithLookupTablesSeparateSignatures: SignAndSendV0TransactionWithLookupTablesSeparateSignatures =
  async ({
    notBondTxns,
    createLookupTableTxns,
    extendLookupTableTxns,
    v0InstructionsAndSigners,
    fastTrackInstructionsAndSigners,
    connection,
    wallet,

    isLedger,
    skipTimeout,
    skipPreflight,

    commitment = 'confirmed',
    onBeforeApprove,
    onAfterSend,
    onSuccess,
    onError,
  }) => {
    try {
      if (isLedger) {
        for (const txnAndSigners of chunk(notBondTxns, TXNS_IN_ONE_SIGN_FOR_LEDGER)) {
          await signAndSendV0TransactionWithLookupTablesSeparateSignatures({
            notBondTxns: [...txnAndSigners],
            createLookupTableTxns: [],
            extendLookupTableTxns: [],
            v0InstructionsAndSigners: [],
            fastTrackInstructionsAndSigners: [],

            skipTimeout: true,
            // lookupTablePublicKey: bondTransactionsAndSignersChunks,
            connection,
            wallet,
            commitment,
            onAfterSend,
            onSuccess,
            onError,
          });
        }

        for (const txnAndSigners of createLookupTableTxns.map((transaction) => ({
          transaction,
          signers: [],
        }))) {
          await signAndSendV0TransactionWithLookupTablesSeparateSignatures({
            notBondTxns: [txnAndSigners],
            createLookupTableTxns: [],
            extendLookupTableTxns: [],
            v0InstructionsAndSigners: [],
            fastTrackInstructionsAndSigners: [],

            skipTimeout: true,
            // lookupTablePublicKey: bondTransactionsAndSignersChunks,
            connection,
            wallet,
            commitment,
            onAfterSend,
            onSuccess,
            onError,
          });
        }

        for (const txnAndSigners of extendLookupTableTxns.map((transaction) => ({
          transaction,
          signers: [],
        }))) {
          await signAndSendV0TransactionWithLookupTablesSeparateSignatures({
            notBondTxns: [txnAndSigners],
            createLookupTableTxns: [],
            extendLookupTableTxns: [],
            v0InstructionsAndSigners: [],
            fastTrackInstructionsAndSigners: [],

            skipTimeout: true,
            // lookupTablePublicKey: bondTransactionsAndSignersChunks,
            connection,
            wallet,
            commitment,
            onAfterSend,
            onSuccess,
            onError,
          });
        }

        for (const txnAndSigners of v0InstructionsAndSigners) {
          await signAndSendV0TransactionWithLookupTablesSeparateSignatures({
            notBondTxns: [],
            createLookupTableTxns: [],
            extendLookupTableTxns: [],
            v0InstructionsAndSigners: [txnAndSigners],
            fastTrackInstructionsAndSigners: [],

            skipTimeout: true,
            // lookupTablePublicKey: bondTransactionsAndSignersChunks,
            connection,
            wallet,
            commitment,
            onAfterSend,
            onSuccess,
            onError,
          });
        }
        console.log(
          ' fastTrackInstructionsAndSigners length: ',
          fastTrackInstructionsAndSigners.map((transaction) => ({
            transaction,
            signers: [],
          })).length,
        );
        for (const txnsAndSigners of chunk(fastTrackInstructionsAndSigners, TXNS_IN_ONE_SIGN_FOR_LEDGER)) {
          await signAndSendV0TransactionWithLookupTablesSeparateSignatures({
            notBondTxns: [],
            createLookupTableTxns: [],
            extendLookupTableTxns: [],
            v0InstructionsAndSigners: [],
            fastTrackInstructionsAndSigners: [...txnsAndSigners],
            // lookupTablePublicKey: bondTransactionsAndSignersChunks,
            isLedger: false,
            skipTimeout: true,

            connection,
            wallet,
            commitment,
            onAfterSend: () => {},
            onSuccess: () => {},
            onError: () => {},
          });
        }

        // const allTransactionsAndSigners: TxnsAndSigners[] = [
        //   ...notBondTxns,
        //   ...createLookupTableTxns.map(transaction => ({ transaction, signers: [] })),
        //   ...extendLookupTableTxns.map(transaction => ({ transaction, signers: [] })),
        //   ...v0InstructionsAndSigners.map(instructionAndSigners => ({ transaction: new web3.Transaction().add(...instructionAndSigners.instructions), signers: instructionAndSigners. })),

        // ]

        return true;
      }

      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      const fastTrackV0Transactions = await Promise.all(
        fastTrackInstructionsAndSigners.map(async (ixAndSigner) => {
          console.log('STANDART_LOOKUP_TABLE: ', STANDART_LOOKUP_TABLE.toBase58());
          const lookupTable = (await connection.getAddressLookupTable(STANDART_LOOKUP_TABLE))
            .value as AddressLookupTableAccount;

          const transactionsMessageV0 = new VersionedTransaction(
            new TransactionMessage({
              payerKey: wallet.publicKey,
              recentBlockhash: blockhash,
              instructions: ixAndSigner.instructions,
            }).compileToV0Message([lookupTable]),
          );
          console.log('Goes here to txn v0? 2');

          transactionsMessageV0.sign([...(ixAndSigner.signers || [])]);
          console.log('Goes here to txn v0? 3');

          return transactionsMessageV0;
        }),
      );

      const txnsAndSigners: TxnsAndSigners[][] = [
        [
          ...notBondTxns,
          ...createLookupTableTxns.map((transaction) => ({
            transaction,
            signers: [],
          })),
        ],
        extendLookupTableTxns.map((transaction) => ({
          transaction,
          signers: [],
        })),
      ];
      //? Filter empty arrays from two-dimensional array
      const txnsAndSignersCreateAndExtendLookupTables = txnsAndSigners.filter((arr) => !!arr.length);

      onBeforeApprove?.();

      const transactionsFlatArrLookupTables = [
        ...fastTrackV0Transactions,
        ...txnsAndSignersCreateAndExtendLookupTables.flat().map(({ transaction, signers }) => {
          transaction.recentBlockhash = blockhash;
          transaction.feePayer = wallet.publicKey;

          if (signers?.length) {
            transaction.sign(...signers);
          }

          return transaction;
        }),
      ];

      const signedTransactionsLookupTables = await wallet.signAllTransactions([...transactionsFlatArrLookupTables]);

      // const txnsAndSignersWithV0Txns = [
      //   ...txnsAndSigners,
      //   // v0MainAndCloseTableTxns,
      // ];

      const txnsAndSignersWithFastTrack = [fastTrackV0Transactions, ...txnsAndSigners];
      let currentTxIndexLookupTable = 0;
      for (let i = 0; i < txnsAndSignersWithFastTrack.length; i++) {
        for (let r = 0; r < txnsAndSignersWithFastTrack[i].length; r++) {
          if (txnsAndSignersWithFastTrack[i].length === 0) continue;

          console.log('currentTxIndexLookupTable: ', currentTxIndexLookupTable);
          const txn = signedTransactionsLookupTables[currentTxIndexLookupTable];
          // lastSlot = await connection.getSlot();
          const tx = await connection.sendRawTransaction(txn.serialize(), {
            skipPreflight: !!skipPreflight,
            preflightCommitment: 'processed',
          });
          currentTxIndexLookupTable += 1;
          // console.log("MinContextSlot: ", txn.minNonceContextSlot)
        }
        if (!!skipTimeout === false || fastTrackV0Transactions.length < currentTxIndexLookupTable)
          await new Promise((r) => setTimeout(r, 8000));
        else {
          new Promise((r) => setTimeout(r, 2000));
        }
      }

      const addressesPerTxn = 20;

      const slotCorrection = txnsAndSigners.length + 2;
      // console.log('slotCorrection: ', slotCorrection);
      const lastSlot = (await connection.getSlot()) + slotCorrection;

      const v0Transactions = await Promise.all(
        v0InstructionsAndSigners.map(async (ixAndSigner) => {
          console.log('ixAndSigner.lookupTablePublicKeys: ', ixAndSigner.lookupTablePublicKeys);
          const lookupTables =
            // ixAndSigner.lookupTablePublicKeys.map(
            //   (tableData) =>
            //     new AddressLookupTableAccount({
            //       key: tableData.tablePubkey,
            //       state: {
            //         addresses: tableData.addresses,
            //         authority: wallet.publicKey,
            //         deactivationSlot:
            //           supposedBigIntDeactivationSlot + BigInt(lastSlot),
            //         lastExtendedSlot: lastSlot,
            //         lastExtendedSlotStartIndex:
            //           Math.floor(tableData.addresses.length / addressesPerTxn) *
            //           addressesPerTxn,
            //       },
            //     }),
            // );
            (await Promise.all(
              ixAndSigner.lookupTablePublicKeys.map(
                async (lookupTablePublicKey) =>
                  (
                    await connection.getAddressLookupTable(new PublicKey(lookupTablePublicKey.tablePubkey))
                  ).value,
              ),
            )) as AddressLookupTableAccount[];
          // .map(tableAccount => ({
          //   ...tableAccount, state: {
          //     ...tableAccount.state,
          //     lastExtendedSlot: lastSlot,
          //     deactivationSlot: supposedBigIntDeactivationSlot + BigInt(tableAccount.state.lastExtendedSlot)
          //   }
          // }));
          console.log('INITIALIZED LOOKUP TABLES SLOTS: ', lookupTables[0]?.state);
          console.log('Authority: ', lookupTables[0]?.state?.authority?.toBase58());

          const transactionsMessageV0 = new VersionedTransaction(
            new TransactionMessage({
              payerKey: wallet.publicKey,
              recentBlockhash: blockhash,
              instructions: ixAndSigner.instructions,
            }).compileToV0Message([...lookupTables]),
          );

          transactionsMessageV0.sign([...(ixAndSigner.signers || [])]);
          return transactionsMessageV0;
        }),
      );

      const deactivateLookupTableTxns = v0InstructionsAndSigners
        .map((ixAndSigners) => ixAndSigners.lookupTablePublicKeys)
        .flat()
        .map((lookupTableData) =>
          AddressLookupTableProgram.deactivateLookupTable({
            authority: wallet.publicKey,
            lookupTable: lookupTableData.tablePubkey,
          }),
        )
        .map((instructions) => new Transaction().add(instructions))
        .map((transaction) => {
          transaction.recentBlockhash = blockhash;
          transaction.feePayer = wallet.publicKey;
          return transaction;
        });

      // v0InstructionsAndSigners.map(ixAndSigners => ixAndSigners.lookupTablePublicKeys).flat().map(lookupTableData =>
      // ([
      //   AddressLookupTableProgram.deactivateLookupTable({
      //     authority: wallet.publicKey,
      //     lookupTable: lookupTableData.tablePubkey
      //   }),
      //   AddressLookupTableProgram.closeLookupTable({
      //     authority: wallet.publicKey,
      //     recipient: wallet.publicKey,
      //     lookupTable: lookupTableData.tablePubkey
      //   })])).map(instructions => new Transaction().add(instructions[0], instructions[1])).map(transaction => {
      //     transaction.recentBlockhash = blockhash;
      //     transaction.feePayer = wallet.publicKey;
      //     return transaction;
      //   });

      // const closeLook
      // AddressLookupTableProgram.closeLookupTable({
      //   authority: wallet.publicKey,
      //   lookupTable:
      // });

      const v0MainAndCloseTableTxns = [...v0Transactions, ...deactivateLookupTableTxns];

      if (v0MainAndCloseTableTxns.length > 0) {
        const signedTransactions = await wallet.signAllTransactions([...v0MainAndCloseTableTxns]);

        const txnsAndSignersWithV0Txns = [v0MainAndCloseTableTxns];

        let currentTxIndex = 0;
        for (let i = 0; i < txnsAndSignersWithV0Txns.length; i++) {
          for (let r = 0; r < txnsAndSignersWithV0Txns[i].length; r++) {
            if (txnsAndSigners[i].length === 0) continue;

            console.log('currentTxIndex: ', currentTxIndex);
            const txn = signedTransactions[currentTxIndex];
            // lastSlot = await connection.getSlot();
            const tx = await connection.sendRawTransaction(txn.serialize(), {
              skipPreflight: !!skipPreflight,
              preflightCommitment: 'processed',
            });
            currentTxIndex += 1;
            // console.log("MinContextSlot: ", txn.minNonceContextSlot)
          }
          if (currentTxIndex < signedTransactions.length - 1) await new Promise((r) => setTimeout(r, 7000));
        }
      }
      // const signedTransactionsV0 = await wallet.signAllTransactions(
      //   v0Transactions,
      // );

      // const txnSignatures = await Promise.all(
      //   signedTransactionsV0.map((signedTransaction) =>
      //     connection.sendTransaction(signedTransaction, { maxRetries: 5 }),
      //   ),
      // );

      //   );
      onAfterSend?.();

      // const actualTableAccounts =
      //   (await Promise.all(
      //     v0InstructionsAndSigners.map(r => r.lookupTablePublicKeys).flat().map(
      //       async (lookupTablePublicKey) =>
      //         (
      //           await connection.getAddressLookupTable(
      //             new PublicKey(lookupTablePublicKey.tablePubkey),
      //           )
      //         ).value,
      //     ),
      //   ));
      // console.log('actualTableAccounts: ', actualTableAccounts[0])
      // console.log('actualTableAccounts: ', JSON.stringify(actualTableAccounts, null, 2))
      // await new Promise((r) => setTimeout(r, 7000));
      // //? Can't cover this shit with types properly
      // const resultsContainErr = results
      //   .map((res) => !!(res as any)?.value?.value?.err)
      //   .find(Boolean);

      // if (resultsContainErr) {
      //   throw new Error('Transaction contains error');
      // }

      onSuccess?.();

      return true;
    } catch (error) {
      onError?.(error);
      return false;
    }
  };
