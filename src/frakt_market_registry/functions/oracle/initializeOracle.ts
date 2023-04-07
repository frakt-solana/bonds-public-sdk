import { web3, BN } from '@project-serum/anchor';

import { returnAnchorProgram } from '../../helpers';
import { ENCODER, ORACLE_PREFIX} from '../../constants';

interface InitializeOracleArgs {
    oracleAuthority: web3.PublicKey;
    oracleInfo: web3.PublicKey;
    floor: number;
  }

type initializeOracle = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;

  args: InitializeOracleArgs;

  accounts: {
    fraktMarket: web3.PublicKey;
    userPubkey: web3.PublicKey;
  };

  sendTxn: (transaction: web3.Transaction, signers: web3.Signer[]) => Promise<void>;
}) => Promise<{ account: web3.PublicKey, instructions: web3.TransactionInstruction[]; signers: web3.Signer[] }>;

export const initializeOracle: initializeOracle = async ({
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
      .initializeOracle(
        args.oracleAuthority,
        args.oracleInfo,
        new BN(args.floor),
      )
      .accounts({
        fraktMarket: accounts.fraktMarket,
        user: accounts.userPubkey,
        oracle: oracle,
      })
      .instruction(),
  );

  const transaction = new web3.Transaction();
  for (let instruction of instructions) transaction.add(instruction);

  const signers = [];
  await sendTxn(transaction, signers);
  return { account: oracle, instructions, signers };
};
