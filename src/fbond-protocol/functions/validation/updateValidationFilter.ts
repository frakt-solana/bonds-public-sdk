import { BN, web3 } from '@project-serum/anchor';
import { ADAPTER_PREFIX, HADOMARKET_REGISTRY_PREFIX, VALIDATION_PREFIX } from '../../constants';
import { returnAnchorProgram } from './../../helpers';
import { ENCODER, METADATA_PROGRAM_PUBKEY } from '../../constants';

type UpdateValidationFilter = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;
  args: {
    loanToValueFilter: number;
    maxDurationFilter: number;
    maxReturnAmountFilter: number;
  };
  accounts: {
    userPubkey: web3.PublicKey;
    pair: web3.PublicKey;
    authorityAdapter: web3.PublicKey;
  };

  sendTxn: (transaction: web3.Transaction, signers: web3.Signer[]) => Promise<void>;
}) => Promise<{ account: null; instructions: web3.TransactionInstruction[]; signers: web3.Signer[] }>;

export const updateValidationFilter: UpdateValidationFilter = async ({
  programId,
  connection,
  accounts,
  args,
  sendTxn,
}) => {
  const program = returnAnchorProgram(programId, connection);
  const instructions: web3.TransactionInstruction[] = [];
  const [validation] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(VALIDATION_PREFIX), accounts.pair.toBuffer()],
    program.programId,
  );

  instructions.push(
    await program.methods
      .updateValidation(
        new BN(args.loanToValueFilter),
        new BN(args.maxDurationFilter),
        new BN(args.maxReturnAmountFilter),
      )
      .accounts({
        pair: accounts.pair,
        authorityAdapter: accounts.authorityAdapter,
        user: accounts.userPubkey,
        validation: validation,
        systemProgram: web3.SystemProgram.programId,
      })
      .instruction(),
  );
  const transaction = new web3.Transaction();
  for (let instruction of instructions) transaction.add(instruction);

  const signers = [];
  await sendTxn(transaction, signers);
  return { account: null, instructions, signers };
};
