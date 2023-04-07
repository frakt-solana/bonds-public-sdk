import { web3, BN } from '@project-serum/anchor';
import { ENCODER, WHITELIST_ENTRY_PREFIX } from '../../constants';
import { returnAnchorProgram } from '../../helpers';


type removeWhitelistFromMarket = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;

  accounts: {
    fraktMarket: web3.PublicKey;
    userPubkey: web3.PublicKey;
    whitelistedAddress: web3.PublicKey;
  };

  sendTxn: (transaction: web3.Transaction, signers: web3.Signer[]) => Promise<void>;
}) => Promise<{ instructions: web3.TransactionInstruction[]; signers: web3.Signer[] }>;

export const removeWhitelistFromMarket: removeWhitelistFromMarket = async ({
  programId,
  connection,
  accounts,
  sendTxn,
}) => {
  const program = returnAnchorProgram(programId, connection);
  const instructions: web3.TransactionInstruction[] = [];
  const [whitelistEntry, whitelistEntrySeed] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(WHITELIST_ENTRY_PREFIX), accounts.whitelistedAddress.toBuffer()],
    program.programId,
  );

  instructions.push(
    await program.methods
      .removeWhitelistFromMarket()
      .accounts({
        fraktMarket: accounts.fraktMarket,
        user: accounts.userPubkey,

        whitelistEntry: whitelistEntry,
        whitelistedAddress: accounts.whitelistedAddress,
        // systemProgram: web3.SystemProgram.programId,
        // rent: web3.SYSVAR_RENT_PUBKEY,
      })
      .instruction(),
  );

  const transaction = new web3.Transaction();
  for (let instruction of instructions) transaction.add(instruction);

  const signers = [];
  await sendTxn(transaction, signers);
  return { instructions, signers };
};
