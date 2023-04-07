import { web3, BN } from '@project-serum/anchor';

import { enumToAnchorEnum, returnAnchorProgram } from '../../../helpers';
import { EMPTY_PUBKEY, ENCODER, FEE_PREFIX, NFTS_OWNER_PREFIX, SOL_FUNDS_PREFIX } from '../../../constants';

type InitializeHadoMarket = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;

  args: {
    minBidCap: number;
    marketDecimals: number;
  };
  accounts: {
    userPubkey: web3.PublicKey;
    validationAdapterProgram: web3.PublicKey;
  };

  sendTxn: (transaction: web3.Transaction, signers: web3.Signer[]) => Promise<void>;
}) => Promise<{ account: web3.PublicKey; instructions: web3.TransactionInstruction[]; signers: web3.Signer[] }>;

export const initializeHadoMarket: InitializeHadoMarket = async ({
  programId,
  connection,
  accounts,
  args,
  sendTxn,
}) => {
  const program = returnAnchorProgram(programId, connection);
  const instructions: web3.TransactionInstruction[] = [];
  const hadoMarket = web3.Keypair.generate();

  instructions.push(
    await program.methods
      .initializeHadoMarket({
        minBidCap: new BN(args.minBidCap),
        marketDecimals: new BN(args.marketDecimals),
      })
      .accounts({
        hadoMarket: hadoMarket.publicKey,
        user: accounts.userPubkey,

        validationAdapterProgram: accounts.validationAdapterProgram,
        pairTokenMint: EMPTY_PUBKEY,

        systemProgram: web3.SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY,
      })
      .instruction(),
  );

  const transaction = new web3.Transaction();
  for (let instruction of instructions) transaction.add(instruction);

  const signers = [hadoMarket];
  await sendTxn(transaction, signers);
  return { account: hadoMarket.publicKey, instructions, signers };
};
