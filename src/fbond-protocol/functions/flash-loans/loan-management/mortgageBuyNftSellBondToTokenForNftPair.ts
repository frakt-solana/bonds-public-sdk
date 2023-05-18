import { BN, web3 } from '@project-serum/anchor';
import { ASSOCIATED_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token';
import { findAssociatedTokenAddress } from '../../../../common';
import { ENCODER } from '../../../constants';
import {
  METADATA_PROGRAM_PUBKEY,
  BOND_PROOGRAM_AUTHORITY_PREFIX,
  RETURN_FUNDS_OWNER_PREFIX,
  COLLATERAL_BOX_PREFIX,
  VALIDATION_PREFIX,
  SOL_FUNDS_PREFIX,
  HADOMARKET_REGISTRY_PREFIX,
  NFTS_OWNER_PREFIX,
  FEE_PREFIX,
  NFT_PAIR_BOX_PREFIX,
} from '../../../constants';

import { getMetaplexEditionPda, getMetaplexMetadataPda, returnAnchorProgram } from '../../../helpers';

type MortgageBuyNftSellBondToTokenForNftPair = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;

  args: {
    amountToDeposit: number;
    amountToReturn: number;
    bondDuration: number;
    proof: Buffer[];
    minAmountToGet: number;
    skipFailed: boolean;
    amountToSell: number;
    maxAmountToPay: number;
  };

  accounts: {
    userPubkey: web3.PublicKey;
    collateralTokenMint: web3.PublicKey;

    fraktMarket: web3.PublicKey;
    oracleFloor: web3.PublicKey;

    whitelistEntry: web3.PublicKey;
    hadoMarket: web3.PublicKey;

    pair: web3.PublicKey;
    protocolFeeReceiver: web3.PublicKey;
    assetReceiver: web3.PublicKey;

    pool: web3.PublicKey;

    hadeswapPair: web3.PublicKey;
    hadeswapProgramId: web3.PublicKey;
    hadeSwapPairAssetReceiver: web3.PublicKey;
    hadeswapProtocolFeeReceiver: web3.PublicKey;
  };

  sendTxn: (transaction: web3.Transaction, signers: web3.Signer[]) => Promise<void>;
}) => Promise<{
  fbond: web3.PublicKey;
  fbondTokenMint: web3.PublicKey;
  collateralBox: web3.PublicKey;

  instructions: web3.TransactionInstruction[];
  signers: web3.Signer[];
}>;

export const mortgageBuyNftSellBondToTokenForNftPair: MortgageBuyNftSellBondToTokenForNftPair = async ({
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

  const [bondProgramAuthority] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(BOND_PROOGRAM_AUTHORITY_PREFIX), fbond.publicKey.toBuffer()],
    program.programId,
  );

  const [returnFundsOwner] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(RETURN_FUNDS_OWNER_PREFIX), fbond.publicKey.toBuffer()],
    program.programId,
  );

  const [collateralBox] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(COLLATERAL_BOX_PREFIX), fbond.publicKey.toBuffer(), ENCODER.encode('0')],
    program.programId,
  );

  const userTokenAccount = await findAssociatedTokenAddress(accounts.userPubkey, accounts.collateralTokenMint);
  const collateralTokenAccount = await findAssociatedTokenAddress(bondProgramAuthority, accounts.collateralTokenMint);
  const userFbondTokenAccount = await findAssociatedTokenAddress(accounts.userPubkey, fbondsTokenMint.publicKey);
  const assetReceiverTokenAccount = await findAssociatedTokenAddress(accounts.assetReceiver, fbondsTokenMint.publicKey);

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

  const [poolSolFundsVault] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(SOL_FUNDS_PREFIX), accounts.pool.toBuffer()],
    program.programId,
  );

  const [hadeswapPairSolFundsVault] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(SOL_FUNDS_PREFIX), accounts.hadeswapPair.toBuffer()],
    accounts.hadeswapProgramId,
  );
  const [nftsOwner] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(NFTS_OWNER_PREFIX), accounts.hadeswapPair.toBuffer()],
    accounts.hadeswapProgramId,
  );
  const [feeSolVault] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(FEE_PREFIX), accounts.hadeswapPair.toBuffer()],
    accounts.hadeswapProgramId,
  );
  const [nftPairBox] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(NFT_PAIR_BOX_PREFIX), accounts.hadeswapPair.toBuffer(), accounts.collateralTokenMint.toBuffer()],
    accounts.hadeswapProgramId,
  );
  const vaultNftTokenAccount = await findAssociatedTokenAddress(nftsOwner, accounts.collateralTokenMint);

  instructions.push(
    await program.methods
      .mortgageBuyNftSellBondToTokenForNftPair(
        {},
        new BN(args.amountToDeposit),
        {
          amountToReturn: new BN(args.amountToReturn),
          bondDuration: new BN(args.bondDuration),
        },
        args.proof,
        new BN(args.minAmountToGet),
        args.skipFailed,
        new BN(args.amountToSell),
        new BN(args.maxAmountToPay),
      )
      .accounts({
        fbond: fbond.publicKey,
        bondProgramAuthority: bondProgramAuthority,

        fbondTokenMint: fbondsTokenMint.publicKey,
        user: accounts.userPubkey,

        userFbondTokenAccount: userFbondTokenAccount,

        collateralBox: collateralBox,
        collateralTokenMint: accounts.collateralTokenMint,
        collateralTokenAccount: collateralTokenAccount,

        validation: validation,
        pair: accounts.pair,
        //hadoMarket: accounts.hadoMarket,
        hadoRegistry: hadoRegistry,

        fraktMarket: accounts.fraktMarket,

        oracleFloor: accounts.oracleFloor,

        whitelistEntry: accounts.whitelistEntry,

        assetReceiverTokenAccount: assetReceiverTokenAccount,

        assetReceiver: accounts.assetReceiver,
        crossMintAmmPairFundsSolVault: solFundsVault,
        protocolFeeReceiver: accounts.protocolFeeReceiver,

        pool: accounts.pool,
        poolFundsSolVault: poolSolFundsVault,

        hadeswapNftPairBox: nftPairBox,
        hadeswapPair: accounts.hadeswapPair,
        hadeswapPairFundsSolVault: hadeswapPairSolFundsVault,
        hadeswapPairNftsOwner: nftsOwner,
        hadeswapPairFeeSolVault: feeSolVault,
        hadeswapPairVaultNftTokenAccount: vaultNftTokenAccount,
        hadeswapPairAssetReceiver: accounts.hadeSwapPairAssetReceiver,
        hadeswapProtocolFeeReceiver: accounts.hadeswapProtocolFeeReceiver,
        hadeswapProgram: accounts.hadeswapProgramId,

        metadataProgram: METADATA_PROGRAM_PUBKEY,

        metadataInfo: metadataInfo,
        editionInfo: editionInfo,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY,
      })
      .instruction(),
  );

  const transaction = new web3.Transaction();
  for (let instruction of instructions) transaction.add(instruction);

  const signers = [fbond, fbondsTokenMint];
  // await sendTxn(transaction, signers);
  return {
    fbond: fbond.publicKey,
    fbondTokenMint: fbondsTokenMint.publicKey,
    collateralBox: collateralBox,
    instructions,
    signers,
  };
};
