import { BN, web3 } from '@project-serum/anchor';
import { ENCODER, SOL_FUNDS_PREFIX } from '../../../constants';

import { returnAnchorProgram } from '../../../helpers';

type DepositSolToFlashLoanPool = (params: {
    programId: web3.PublicKey;
    connection: web3.Connection;

    args: {
        solAmountToDeposit: number;
    };

    accounts: {
        userPubkey: web3.PublicKey;
        pool: web3.PublicKey;
    };

    sendTxn: (transaction: web3.Transaction, signers: web3.Signer[]) => Promise<void>;
}) => Promise<{
    solFundsVault: web3.PublicKey;
    instructions: web3.TransactionInstruction[];
    signers: web3.Signer[];
}>;

export const depositSolToFlashLoanPool: DepositSolToFlashLoanPool = async ({ programId, connection, args, accounts, sendTxn }) => {
    const program = returnAnchorProgram(programId, connection);
    const instructions: web3.TransactionInstruction[] = [];
    const [solFundsVault, ] = await web3.PublicKey.findProgramAddress(
        [ENCODER.encode(SOL_FUNDS_PREFIX), accounts.pool.toBuffer()],
        program.programId,
      );

    instructions.push(
        await program.methods
            .depositSolToFlashLoanPool(new BN(args.solAmountToDeposit))
            .accounts({
                pool: accounts.pool,
                user: accounts.userPubkey,
                fundsSolVault: solFundsVault,
                systemProgram: web3.SystemProgram.programId,
            })
            .instruction(),
    );

    const transaction = new web3.Transaction();
    for (let instruction of instructions) transaction.add(instruction);

    const signers = [];
    await sendTxn(transaction, signers);
    return { solFundsVault: solFundsVault, instructions, signers };
};
