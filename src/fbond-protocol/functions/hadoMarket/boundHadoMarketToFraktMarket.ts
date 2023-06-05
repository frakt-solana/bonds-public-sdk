import { web3 } from '@project-serum/anchor';
import { ENCODER } from '../../constants';
import { HADOMARKET_REGISTRY_PREFIX } from '../../constants';

import { returnAnchorProgram } from '../../helpers';

type BoundHadoMarketToFraktMarket = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;
  accounts: {
    hadoMarket: web3.PublicKey;
    fraktMarket: web3.PublicKey;

    userPubkey: web3.PublicKey;
  };

  sendTxn: (transaction: web3.Transaction, signers: web3.Signer[]) => Promise<void>;
}) => Promise<{ account: web3.PublicKey; instructions: web3.TransactionInstruction[]; signers: web3.Signer[] }>;

export const boundHadoMarketToFraktMarket: BoundHadoMarketToFraktMarket = async ({ programId, connection, accounts, sendTxn }) => {
  const program = returnAnchorProgram(programId, connection);
  const instructions: web3.TransactionInstruction[] = [];

  const [hadoRegistry, registrySeed] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(HADOMARKET_REGISTRY_PREFIX), accounts.hadoMarket.toBuffer()],
    program.programId,
  );


  instructions.push(
    await program.methods
      .boundHadoMarketToFraktMarket()
      .accounts({
        hadoMarket: accounts.hadoMarket,
        fraktMarket: accounts.fraktMarket,

        hadoRegistry: hadoRegistry,

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
  return { account: hadoRegistry, instructions, signers };
};
