import { web3 } from '@project-serum/anchor';

import { returnAnchorProgram } from '../../../helpers';

type InitializeFlashLoanPool = (params: {
    programId: web3.PublicKey;
    connection: web3.Connection;

    args: {
        loanFeePoints: number;
    };

    accounts: {
        userPubkey: web3.PublicKey;
    };

    sendTxn: (transaction: web3.Transaction, signers: web3.Signer[]) => Promise<void>;
}) => Promise<{
    pool: web3.PublicKey;
    instructions: web3.TransactionInstruction[];
    signers: web3.Signer[];
}>;

export const initializeFlashLoanPool: InitializeFlashLoanPool = async ({ programId, connection, args, accounts, sendTxn }) => {
    const program = returnAnchorProgram(programId, connection);
    const instructions: web3.TransactionInstruction[] = [];
    const pool = web3.Keypair.generate();

    instructions.push(
        await program.methods
            .initializeFlashLoanPool(args.loanFeePoints)
            .accounts({
                pool: pool.publicKey,
                user: accounts.userPubkey,
                systemProgram: web3.SystemProgram.programId,
                rent: web3.SYSVAR_RENT_PUBKEY,
            })
            .instruction(),
    );

    const transaction = new web3.Transaction();
    for (let instruction of instructions) transaction.add(instruction);

    const signers = [pool];
    await sendTxn(transaction, signers);
    return { pool: pool.publicKey, instructions, signers };
};
