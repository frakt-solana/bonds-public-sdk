import { web3 } from '@project-serum/anchor';
import { BN } from '../../../../../..';

import { enumToAnchorEnum, returnAnchorProgram } from '../../../../../helpers';
import {
  VALIDATION_PREFIX,
  EMPTY_PUBKEY,
  ENCODER,
  FEE_PREFIX,
  NFTS_OWNER_PREFIX,
  SOL_FUNDS_PREFIX,
  BOND_OFFER_PREFIX,
} from '../../../../../constants';
import { BondFeatures, BondingCurveType, PairType } from '../../../../../types';

type MigratePairToBondOfferV2 = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;
  accounts: {
    pair: web3.PublicKey;

    userPubkey: web3.PublicKey;
  };

  sendTxn: (transaction: web3.Transaction, signers: web3.Signer[]) => Promise<void>;
}) => Promise<{
  bondOfferV2: web3.PublicKey;
  instructions: web3.TransactionInstruction[];
  signers: web3.Signer[];
}>;

export const migratePairToBondOfferV2: MigratePairToBondOfferV2 = async ({
  programId,
  connection,
  accounts,
  sendTxn,
}) => {
  const program = returnAnchorProgram(programId, connection);
  const instructions: web3.TransactionInstruction[] = [];
  // const bondOfferV2 = web3.Keypair.generate();

  const [validation] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(VALIDATION_PREFIX), accounts.pair.toBuffer()],
    program.programId,
  );
  const [solFundsVault, solVaultSeed] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(SOL_FUNDS_PREFIX), accounts.pair.toBuffer()],
    program.programId,
  );
  const bondOfferSeed = Math.ceil(Math.random() * 1000000);
  const [bondOfferV2] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(BOND_OFFER_PREFIX), accounts.userPubkey.toBuffer(), ENCODER.encode(bondOfferSeed.toString())],
    program.programId,
  );
  instructions.push(
    await program.methods
      .migratePairToBondOfferV2(new BN(bondOfferSeed))
      .accountsStrict({
        bondOfferV2: bondOfferV2,
        pair: accounts.pair,
        validation: validation,
        user: accounts.userPubkey,
        fundsSolVault: solFundsVault,

        systemProgram: web3.SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY,
      })
      .instruction(),
  );

  const transaction = new web3.Transaction();
  for (let instruction of instructions) transaction.add(instruction);

  const signers = [];
  await sendTxn(transaction, signers);
  return { bondOfferV2: bondOfferV2, instructions, signers };
};
