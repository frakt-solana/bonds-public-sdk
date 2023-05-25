import { Commitment, Connection, Signer, Transaction } from '@solana/web3.js';

export interface TxnsAndSigners {
  transaction: Transaction;
  signers?: Signer[];
}

type SignAndSendAllTransactionsInSequence = (props: {
  txnsAndSigners: TxnsAndSigners[][];
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
export const signAndSendAllTransactionsInSequence: SignAndSendAllTransactionsInSequence = async ({
  txnsAndSigners,
  connection,
  wallet,
  commitment = 'confirmed',
  onBeforeApprove,
  onAfterSend,
  onSuccess,
  onError,
}) => {
  try {
    //? Filter empty arrays from two-dimensional array
    const txnsAndSignersFiltered = txnsAndSigners.filter((arr) => !!arr.length);

    onBeforeApprove?.();

    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

    const transactionsFlatArr = txnsAndSignersFiltered.flat().map(({ transaction, signers = [] }) => {
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = wallet.publicKey;

      if (signers.length) {
        transaction.sign(...signers);
      }

      return transaction;
    });

    const signedTransactions = await wallet.signAllTransactions(transactionsFlatArr);

    const allTxnSignatures: Array<string> = [];

    let currentTxIndex = 0;
    for (let i = 0; i < txnsAndSigners.length; i++) {
      for (let r = 0; r < txnsAndSigners[i].length; r++) {
        console.log('currentTxIndex: ', currentTxIndex);
        const txn = signedTransactions[currentTxIndex];
        await connection.sendRawTransaction(txn.serialize(), {
          skipPreflight: false,
          preflightCommitment: 'processed',
        });
        currentTxIndex += 1;
      }
      if (txnsAndSigners[i].length > 0) await new Promise((r) => setTimeout(r, 7000));
    }

    onAfterSend?.();

    await new Promise((r) => setTimeout(r, 7000));

    // const results = await Promise.allSettled(
    //   allTxnSignatures.map((signature) =>
    //     connection.confirmTransaction(
    //       {
    //         signature,
    //         blockhash,
    //         lastValidBlockHeight,
    //       },
    //       commitment,
    //     ),
    //   ),
    // );

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
