import { Signer, Transaction, TransactionInstruction } from '@solana/web3.js';

export interface IxnsData {
  instructions: TransactionInstruction[] | TransactionInstruction;
  signers: Signer[];
}

interface TxnData {
  transaction: Transaction;
  signers: Signer[];
}

export const mergeIxsIntoTxn = (ixs: IxnsData[]): TxnData => {
  const transaction = new Transaction();

  transaction.add(...ixs.map(({ instructions }) => instructions).flat());

  const signers = ixs.map(({ signers }) => signers).flat();

  return {
    transaction,
    signers,
  };
};
