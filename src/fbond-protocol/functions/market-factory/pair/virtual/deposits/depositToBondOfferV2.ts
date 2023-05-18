import { BN, web3 } from '@project-serum/anchor';
import { EMPTY_PUBKEY, ENCODER, SOL_FUNDS_PREFIX } from '../../../../../constants';

import { returnAnchorProgram } from '../../../../../helpers';

type DepositToBondOfferV2 = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;

  args: {
    amountOfTokensToBuy: number;
  };

  accounts: {
    bondOfferV2: web3.PublicKey;
    userPubkey: web3.PublicKey;
  };

  sendTxn: (transaction: web3.Transaction, signers: web3.Signer[]) => Promise<void>;
}) => Promise<{ account: null; instructions: web3.TransactionInstruction[]; signers: web3.Signer[] }>;

export const depositToBondOfferV2: DepositToBondOfferV2 = async ({
  programId,
  connection,
  accounts,
  args,
  sendTxn,
}) => {
  const encoder = new TextEncoder();

  const program = returnAnchorProgram(programId, connection);
  const instructions: web3.TransactionInstruction[] = [];

  const [solFundsVault, solVaultSeed] = await web3.PublicKey.findProgramAddress(
    [encoder.encode(SOL_FUNDS_PREFIX), accounts.bondOfferV2.toBuffer()],
    program.programId,
  );

  instructions.push(
    await program.methods
      .depositToBondOfferV2(new BN(args.amountOfTokensToBuy))
      .accounts({
        bondOfferV2: accounts.bondOfferV2,
        user: accounts.userPubkey,
        systemProgram: web3.SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY,
      })
      .instruction(),
  );
  const transaction = new web3.Transaction();
  for (let instruction of instructions) transaction.add(instruction);

  const signers = [];
  await sendTxn(transaction, signers);
  return { account: null, instructions, signers };
};
