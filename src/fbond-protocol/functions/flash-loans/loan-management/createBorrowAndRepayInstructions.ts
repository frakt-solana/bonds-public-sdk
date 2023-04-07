import { BN, web3 } from '@project-serum/anchor';
import { ENCODER, SOL_FUNDS_PREFIX } from '../../../constants';

import { returnAnchorProgram } from '../../../helpers';

type CreateBorrowAndRepayInstructions = (params: {
    programId: web3.PublicKey;
    connection: web3.Connection;

    args: {
        solAmountToBorrow: number;
        solAmountToRepay: number;
    };

    accounts: {
        userPubkey: web3.PublicKey;
        pool: web3.PublicKey;
    };

}) => Promise<{
    borrowInstruction: web3.TransactionInstruction;
    repayInstruction: web3.TransactionInstruction;
}>;

export const createBorrowAndRepayInstructions: CreateBorrowAndRepayInstructions = async ({ programId, connection, args, accounts }) => {
    const program = returnAnchorProgram(programId, connection);
    const instructions: web3.TransactionInstruction[] = [];
    const [solFundsVault, ] = await web3.PublicKey.findProgramAddress(
        [ENCODER.encode(SOL_FUNDS_PREFIX), accounts.pool.toBuffer()],
        program.programId,
      );
    const SYSVAR_INSTRUCTIONS_PUBKEY = web3.SYSVAR_INSTRUCTIONS_PUBKEY;

    instructions.push(
        await program.methods
            .takeFlashLoan(new BN(args.solAmountToBorrow))
            .accounts({
                pool: accounts.pool,
                user: accounts.userPubkey,
                fundsSolVault: solFundsVault,
                instructions: SYSVAR_INSTRUCTIONS_PUBKEY,
                systemProgram: web3.SystemProgram.programId,
            })
            .instruction(),
    );

    instructions.push(
        await program.methods
            .repayFlashLoan(new BN(args.solAmountToRepay))
            .accounts({
                pool: accounts.pool,
                user: accounts.userPubkey,
                fundsSolVault: solFundsVault,
                instructions: SYSVAR_INSTRUCTIONS_PUBKEY,
                systemProgram: web3.SystemProgram.programId,
            })
            .instruction(),
    );

    return { borrowInstruction: instructions[0], repayInstruction: instructions[1] };
};
