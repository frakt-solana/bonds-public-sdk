import { web3, BN } from '@project-serum/anchor';

import { returnAnchorProgram } from '../../helpers';
import { ENCODER, ORACLE_PREFIX} from '../../constants';



type setOracleFloor = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;

  args: {
    newFloor: number;
  };

  accounts: {
    fraktMarket: web3.PublicKey;
    userPubkey: web3.PublicKey;
  };

  sendTxn: (transaction: web3.Transaction, signers: web3.Signer[]) => Promise<void>;
}) => Promise<{ instructions: web3.TransactionInstruction[]; signers: web3.Signer[] }>;

export const setOracleFloor: setOracleFloor = async ({
  programId,
  connection,
  args,
  accounts,
  sendTxn,
}) => {
  const program = returnAnchorProgram(programId, connection);
  const instructions: web3.TransactionInstruction[] = [];

  const [oracle, oracleSeed] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(ORACLE_PREFIX), accounts.fraktMarket.toBuffer()],
    program.programId,
  );
  

  instructions.push(
    await program.methods
      .setOracleFloor(
        new BN(args.newFloor),
      )
      .accounts({
        fraktMarket: accounts.fraktMarket,
        user: accounts.userPubkey,
        oracle: oracle,
        systemProgram: web3.SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY,
      })
      .instruction(),
  );

  const transaction = new web3.Transaction();
  for (let instruction of instructions) transaction.add(instruction);

  const signers = [];
  await sendTxn(transaction, signers);
  return { instructions, signers };
};
