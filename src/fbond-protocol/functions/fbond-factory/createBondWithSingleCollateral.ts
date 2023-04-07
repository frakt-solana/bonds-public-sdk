import { BN, web3 } from '@project-serum/anchor';
import { ASSOCIATED_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token';
import { findAssociatedTokenAddress } from '../../../common';
import { AUTHORIZATION_RULES_PROGRAM, ENCODER, METADATA_PROGRAM_PUBKEY } from '../../constants';
import { BOND_PROOGRAM_AUTHORITY_PREFIX, RETURN_FUNDS_OWNER_PREFIX, COLLATERAL_BOX_PREFIX } from '../../constants';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';

import { findTokenRecordPda, getMetaplexEditionPda, getMetaplexMetadata, returnAnchorProgram } from './../../helpers';

type CreateBondWithSingleCollateral = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;

  args: {
    amountToDeposit: number;
    amountToReturn: number;
    bondDuration: number;
  };

  accounts: {
    userPubkey: web3.PublicKey;
    tokenMint: web3.PublicKey;
  };

  sendTxn: (transaction: web3.Transaction, signers: web3.Signer[]) => Promise<void>;
}) => Promise<{
  fbond: web3.PublicKey;
  fbondTokenMint: web3.PublicKey;
  collateralBox: web3.PublicKey;

  instructions: web3.TransactionInstruction[];
  signers: web3.Signer[];
}>;

export const createBondWithSingleCollateral: CreateBondWithSingleCollateral = async ({
  programId,
  connection,
  args,
  accounts,
  sendTxn,
}) => {
  const program = returnAnchorProgram(programId, connection);
  const instructions: web3.TransactionInstruction[] = [];
  const fbond = web3.Keypair.generate();
  const fbondsTokenMint = web3.Keypair.generate();

  const [bondProgramAuthority, bondProgramAuthoritySeed] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(BOND_PROOGRAM_AUTHORITY_PREFIX), fbond.publicKey.toBuffer()],
    program.programId,
  );

  const [returnFundsOwner, returnFundsOwnerSeed] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(RETURN_FUNDS_OWNER_PREFIX), fbond.publicKey.toBuffer()],
    program.programId,
  );

  const [collateralBox] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(COLLATERAL_BOX_PREFIX), fbond.publicKey.toBuffer(), ENCODER.encode('0')],
    program.programId,
  );

  const userTokenAccount = await findAssociatedTokenAddress(accounts.userPubkey, accounts.tokenMint);
  const collateralTokenAccount = await findAssociatedTokenAddress(bondProgramAuthority, accounts.tokenMint);
  const userFbondTokenAccount = await findAssociatedTokenAddress(accounts.userPubkey, fbondsTokenMint.publicKey);
  const editionInfo = getMetaplexEditionPda(accounts.tokenMint);

  instructions.push(
    await program.methods
      .createBondWithSingleCollateral(
        {
          bondProgramAuthoritySeed,
          returnFundsOwnerSeed,
        },
        new BN(args.amountToDeposit),
        {
          amountToReturn: new BN(args.amountToReturn),
          bondDuration: new BN(args.bondDuration),
        },
      )
      .accountsStrict({
        fbond: fbond.publicKey,
        bondProgramAuthority: bondProgramAuthority,

        fbondTokenMint: fbondsTokenMint.publicKey,
        user: accounts.userPubkey,

        userFbondTokenAccount: userFbondTokenAccount,

        collateralBox: collateralBox,
        tokenMint: accounts.tokenMint,
        userTokenAccount: userTokenAccount,
        collateralTokenAccount: collateralTokenAccount,

        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY,
        metadataProgram: METADATA_PROGRAM_PUBKEY,
        editionInfo: editionInfo,
      })
      .instruction(),
  );

  const transaction = new web3.Transaction();
  for (let instruction of instructions) transaction.add(instruction);

  const signers = [fbond, fbondsTokenMint];
  await sendTxn(transaction, signers);
  return {
    fbond: fbond.publicKey,
    fbondTokenMint: fbondsTokenMint.publicKey,
    collateralBox: collateralBox,
    instructions,
    signers,
  };
};
