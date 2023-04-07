import { web3, BN } from '@project-serum/anchor';

import { enumToAnchorEnum, returnAnchorProgram } from '../../helpers';
import { ENCODER, WHITELIST_ENTRY_PREFIX } from '../../constants';
import { NftValidationWhitelistType } from '../../types';

type AddWhitelistToMarket = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;

  args: {
    whitelistType: NftValidationWhitelistType;
    root?: Buffer;
  };

  accounts: {
    fraktMarket: web3.PublicKey;
    userPubkey: web3.PublicKey;
    whitelistedAddress: web3.PublicKey;
  };

  sendTxn: (transaction: web3.Transaction, signers: web3.Signer[]) => Promise<void>;
}) => Promise<{ account: web3.PublicKey; instructions: web3.TransactionInstruction[]; signers: web3.Signer[] }>;

export const addWhitelistToMarket: AddWhitelistToMarket = async ({
  programId,
  connection,
  args,
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
      .addWhitelistToMarket(enumToAnchorEnum(args.whitelistType), args.root ? [...args.root] : new Array(32).fill(0))
      .accounts({
        fraktMarket: accounts.fraktMarket,
        user: accounts.userPubkey,

        whitelistEntry: whitelistEntry,
        whitelistedAddress: accounts.whitelistedAddress,

        systemProgram: web3.SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY,
      })
      .instruction(),
  );

  const transaction = new web3.Transaction();
  for (let instruction of instructions) transaction.add(instruction);

  const signers = [];
  await sendTxn(transaction, signers);
  return { account: whitelistEntry, instructions, signers };
};
