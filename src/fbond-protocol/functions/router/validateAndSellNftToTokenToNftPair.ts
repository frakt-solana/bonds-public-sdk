import { BN, web3 } from '@project-serum/anchor';
import { ASSOCIATED_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token';
import { findAssociatedTokenAddress } from '../../../common';
import {
  EMPTY_PUBKEY,
  ENCODER,
  NFTS_OWNER_PREFIX,
  METADATA_PROGRAM_PUBKEY,
  SOL_FUNDS_PREFIX,
  VALIDATION_PREFIX,
  HADOMARKET_REGISTRY_PREFIX,
  AUTOCOMPOUND_DEPOSIT_PREFIX,
} from '../../constants';

import { getMetaplexEditionPda, getMetaplexMetadataPda, returnAnchorProgram } from '../../helpers';

type ValidateAndSellNftToTokenToNftPair = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;

  args: {
    proof: Buffer[];
    minAmountToGet: number;
    skipFailed: boolean;
    amountToSell: number;
    isAutocompoundOrAutoreceiveSol: boolean;
  };

  accounts: {
    collateralBox: web3.PublicKey;
    fbond: web3.PublicKey;
    fbondTokenMint: web3.PublicKey;

    collateralTokenMint: web3.PublicKey;

    fraktMarket: web3.PublicKey;
    oracleFloor: web3.PublicKey;

    whitelistEntry: web3.PublicKey;
    hadoMarket: web3.PublicKey;

    pair: web3.PublicKey;
    userPubkey: web3.PublicKey;
    protocolFeeReceiver: web3.PublicKey;
    assetReceiver: web3.PublicKey;
  };

  sendTxn: (transaction: web3.Transaction, signers: web3.Signer[]) => Promise<void>;
}) => Promise<{ account: web3.PublicKey; instructions: web3.TransactionInstruction[]; signers: web3.Signer[] }>;

export const validateAndSellNftToTokenToNftPair: ValidateAndSellNftToTokenToNftPair = async ({
  programId,
  connection,
  args,
  accounts,
  sendTxn,
}) => {
  const program = returnAnchorProgram(programId, connection);
  const instructions: web3.TransactionInstruction[] = [];

  const userNftTokenAccount = await findAssociatedTokenAddress(accounts.userPubkey, accounts.fbondTokenMint);
  // const assetReceiverTokenAccount = await findAssociatedTokenAddress(accounts.assetReceiver, accounts.fbondTokenMint);
  // const autocompoundDeposit = web3.Keypair.generate();

  // const [autocompoundBondsVault] = await web3.PublicKey.findProgramAddress(
  //   [ENCODER.encode(AUTOCOMPOUND_B0NDS_VAULT), autocompoundDeposit.publicKey.toBuffer()],
  //   program.programId,
  // );
  // const autocompoundBondsTokenAccount = await findAssociatedTokenAddress(
  //   autocompoundBondsVault,
  //   accounts.fbondTokenMint,
  // );

  const [validation] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(VALIDATION_PREFIX), accounts.pair.toBuffer()],
    program.programId,
  );

  const [solFundsVault, solVaultSeed] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(SOL_FUNDS_PREFIX), accounts.pair.toBuffer()],
    program.programId,
  );

  const [hadoRegistry, registrySeed] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(HADOMARKET_REGISTRY_PREFIX), accounts.hadoMarket.toBuffer()],
    program.programId,
  );

  const metadataInfo = getMetaplexMetadataPda(accounts.collateralTokenMint);
  const editionInfo = getMetaplexEditionPda(accounts.collateralTokenMint);

  // const autocompoundDeposit = web3.Keypair.generate();
  const [autocompoundDeposit] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(AUTOCOMPOUND_DEPOSIT_PREFIX), accounts.fbondTokenMint.toBuffer(), accounts.pair.toBuffer()],
    program.programId,
  );

  const assetReceiverOrAutocompoundDepositTokenAccount = args.isAutocompoundOrAutoreceiveSol
    ? await findAssociatedTokenAddress(solFundsVault, accounts.fbondTokenMint)
    : await findAssociatedTokenAddress(accounts.assetReceiver, accounts.fbondTokenMint);
  instructions.push(
    await program.methods
      .validateAndSellNftToTokenToNftPair(
        args.proof,
        new BN(args.minAmountToGet),
        args.skipFailed,
        new BN(args.amountToSell),
      )
      .accounts({
        validation: validation,
        collateralBox: accounts.collateralBox,
        fbond: accounts.fbond,
        autocompoundDeposit: autocompoundDeposit,
        fbondTokenMint: accounts.fbondTokenMint,
        pair: accounts.pair,
        //hadoMarket: accounts.hadoMarket,
        hadoRegistry: hadoRegistry,
        // autocompoundDeposit: autocompoundDeposit.publicKey,
        // autocompoundBondsVault: autocompoundBondsVault,
        // autocompoundBondsTokenAccount: autocompoundBondsTokenAccount,

        fraktMarket: accounts.fraktMarket,

        oracleFloor: accounts.oracleFloor,

        whitelistEntry: accounts.whitelistEntry,

        user: accounts.userPubkey,
        assetReceiverOrAutocompoundDepositTokenAccount: assetReceiverOrAutocompoundDepositTokenAccount,
        nftUserTokenAccount: userNftTokenAccount,

        assetReceiver: accounts.assetReceiver,
        fundsSolVault: solFundsVault,
        protocolFeeReceiver: accounts.protocolFeeReceiver,

        systemProgram: web3.SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY,

        metadataProgram: METADATA_PROGRAM_PUBKEY,

        metadataInfo: metadataInfo,
        editionInfo: editionInfo,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
      })
      .instruction(),
  );
  const transaction = new web3.Transaction();
  for (let instruction of instructions) transaction.add(instruction);

  const signers = [];
  await sendTxn(transaction, signers);
  return { account: autocompoundDeposit, instructions, signers };
};
