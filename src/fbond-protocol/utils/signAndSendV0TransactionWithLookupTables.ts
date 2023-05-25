import { TxnsAndSigners } from './signAndSendAllTransactionsInSequence';
import { LOOKUP_TABLE } from '../constants';
import {
  PublicKey,
  Commitment,
  Connection,
  Signer,
  Transaction,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
  AddressLookupTableAccount,
  AddressLookupTableProgram,
} from '@solana/web3.js';

const STANDART_LOOKUP_TABLE = new PublicKey(LOOKUP_TABLE);

export interface InstructionsAndSigners {
  instructions: TransactionInstruction[];
  signers?: Signer[];
  lookupTablePublicKeys: {
    tablePubkey: PublicKey;
    addresses: PublicKey[];
  }[];
}

type SignAndSendV0TransactionWithLookupTables = (props: {
  // lookupTablePublicKeys: PublicKey[];
  createLookupTableTxns: Transaction[];
  extendLookupTableTxns: Transaction[];

  v0InstructionsAndSigners: InstructionsAndSigners[];
  fastTrackInstructionsAndSigners: InstructionsAndSigners[];

  connection: Connection;
  wallet: any;
  commitment?: Commitment;
  onBeforeApprove?: () => void;
  onAfterSend?: () => void;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) => Promise<boolean>;

//? Sequence means that transactions will be signed at once, but will be sent in a sequence by chunks.
//? F.e. txnsAndSigners: [[x, x, x], [y, y, y], [z, z, z]]. Sign all txns at once. But first send [x, x, x], wait for confirmation, send [y, y, y] wait for confirmation, send [z, z, z]
//? It needs when transactions from next chunk are related to transactions from previos chunk
export const signAndSendV0TransactionWithLookupTables: SignAndSendV0TransactionWithLookupTables = async ({
  createLookupTableTxns,
  extendLookupTableTxns,
  v0InstructionsAndSigners,
  fastTrackInstructionsAndSigners,
  connection,
  wallet,
  commitment = 'confirmed',
  onBeforeApprove,
  onAfterSend,
  onSuccess,
  onError,
}) => {
  try {
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
      createLookupTableTxns.map((transaction) => ({
        transaction,
        signers: [],
      })),
      extendLookupTableTxns.map((transaction) => ({
        transaction,
        signers: [],
      })),
    ];
    //? Filter empty arrays from two-dimensional array
    const txnsAndSignersFiltered = txnsAndSigners.filter((arr) => !!arr.length);

    onBeforeApprove?.();

    const addressesPerTxn = 20;

    const supposedBigIntDeactivationSlot = BigInt('18446744073518870550');
    const slotCorrection = txnsAndSigners.length + 2;
    console.log('slotCorrection: ', slotCorrection);
    const lastSlot = (await connection.getSlot()) + slotCorrection;

    const v0Transactions = await Promise.all(
      v0InstructionsAndSigners.map(async (ixAndSigner) => {
        console.log('ixAndSigner.lookupTablePublicKeys: ', ixAndSigner.lookupTablePublicKeys);
        const lookupTables: AddressLookupTableAccount[] = ixAndSigner.lookupTablePublicKeys.map(
          (tableData) =>
            new AddressLookupTableAccount({
              key: tableData.tablePubkey,
              state: {
                addresses: tableData.addresses,
                authority: wallet.publicKey,
                deactivationSlot: supposedBigIntDeactivationSlot + BigInt(lastSlot),
                lastExtendedSlot: lastSlot,
                lastExtendedSlotStartIndex: Math.floor(tableData.addresses.length / addressesPerTxn) * addressesPerTxn,
              },
            }),
        );
        // (await Promise.all(
        //   ixAndSigner.lookupTablePublicKeys.map(
        //     async (lookupTablePublicKey) =>
        //       (
        //         await connection.getAddressLookupTable(
        //           new PublicKey(lookupTablePublicKey.tablePubkey),
        //         )
        //       ).value,
        //   ),
        // )).map(tableAccount => ({
        //   ...tableAccount, state: {
        //     ...tableAccount.state,
        //     lastExtendedSlot: lastSlot,
        //     deactivationSlot: supposedBigIntDeactivationSlot + BigInt(tableAccount.state.lastExtendedSlot)
        //   }
        // }));
        console.log('INITIALIZED LOOKUP TABLES SLOTS: ', lookupTables[0].state);
        console.log('Authority: ', lookupTables[0].state?.authority?.toBase58());

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

    const transactionsFlatArr = [
      ...fastTrackV0Transactions,
      ...txnsAndSignersFiltered.flat().map(({ transaction, signers = [] }) => {
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = wallet.publicKey;

        if (signers.length) {
          transaction.sign(...signers);
        }

        return transaction;
      }),
      ...v0MainAndCloseTableTxns,
    ];

    const signedTransactions = await wallet.signAllTransactions([...transactionsFlatArr]);

    const txnsAndSignersWithV0Txns = [[...fastTrackV0Transactions, ...txnsAndSigners], v0MainAndCloseTableTxns];
    console.log('goes here to sending?');
    console.log('txnsAndSignersWithV0Txns: ', txnsAndSignersWithV0Txns);
    console.log('signedTransactions: ', signedTransactions);

    let currentTxIndex = 0;
    for (let i = 0; i < txnsAndSignersWithV0Txns.length; i++) {
      if (txnsAndSignersWithV0Txns[i].length === 0) continue;
      for (let r = 0; r < txnsAndSignersWithV0Txns[i].length; r++) {
        console.log('currentTxIndex: ', currentTxIndex);
        const txn = signedTransactions[currentTxIndex];
        if (!txn) continue;
        // lastSlot = await connection.getSlot();
        const tx = await connection.sendRawTransaction(txn.serialize(), {
          skipPreflight: false,
          preflightCommitment: 'processed',
        });
        currentTxIndex += 1;
        // console.log("MinContextSlot: ", txn.minNonceContextSlot)
      }
      if (txnsAndSignersWithV0Txns[i].length > 0) await new Promise((r) => setTimeout(r, 8000));
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
