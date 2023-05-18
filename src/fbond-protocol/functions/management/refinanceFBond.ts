import { BN, web3 } from '@project-serum/anchor';
import { ASSOCIATED_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token';
import { findAssociatedTokenAddress } from '../../../common';
import { AUTHORIZATION_RULES_PROGRAM, ENCODER, METADATA_PROGRAM_PUBKEY } from '../../constants';
import {
  AUTOCOMPOUND_DEPOSIT_PREFIX,
  BOND_PROOGRAM_AUTHORITY_PREFIX,
  RETURN_FUNDS_OWNER_PREFIX,
  COLLATERAL_BOX_PREFIX,
  VALIDATION_PREFIX,
  SOL_FUNDS_PREFIX,
  HADOMARKET_REGISTRY_PREFIX,
} from '../../constants';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';

import {
  findTokenRecordPda,
  getMetaplexEditionPda,
  getMetaplexMetadataPda,
  getMetaplexMetadata,
  returnAnchorProgram,
} from './../../helpers';
type RefinanceFBond = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;

  args: {
    nextBoxIndex: string;
    minAmountToGet: number;
    amountToSell: number;
    isAutocompoundOrAutoreceiveSol: boolean;
    amountToReturn: number;
    bondDuration: number;
  };

  accounts: {
    userPubkey: web3.PublicKey;
    fbond: web3.PublicKey;
    collateralTokenMint: web3.PublicKey;
    collateralTokenAccount: web3.PublicKey;
    fbondsTokenMint: web3.PublicKey;
    adminPubkey: web3.PublicKey;
    bondCollateralOrSolReceiver?: web3.PublicKey;

    fraktMarket: web3.PublicKey;
    oracleFloor: web3.PublicKey;

    whitelistEntry: web3.PublicKey;
    hadoMarket: web3.PublicKey;

    pair: web3.PublicKey;
    protocolFeeReceiver: web3.PublicKey;
    assetReceiver: web3.PublicKey;
  };

  sendTxn: (transaction: web3.Transaction, signers: web3.Signer[]) => Promise<void>;
}) => Promise<{
  instructions: web3.TransactionInstruction[];
  signers: web3.Signer[];
}>;

export const refinanceFBond: RefinanceFBond = async ({ programId, connection, accounts, args, sendTxn }) => {
  const program = returnAnchorProgram(programId, connection);
  const instructions: web3.TransactionInstruction[] = [];
  const newFbond = web3.Keypair.generate();
  const newFbondsTokenMint = web3.Keypair.generate();

  const [collateralBox] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(COLLATERAL_BOX_PREFIX), accounts.fbond.toBuffer(), ENCODER.encode(args.nextBoxIndex)],
    program.programId,
  );

  const [bondProgramAuthority] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(BOND_PROOGRAM_AUTHORITY_PREFIX), accounts.fbond.toBuffer()],
    program.programId,
  );

  const [newBondProgramAuthority] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(BOND_PROOGRAM_AUTHORITY_PREFIX), newFbond.publicKey.toBuffer()],
    program.programId,
  );
  const [newReturnFundsOwner] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(RETURN_FUNDS_OWNER_PREFIX), newFbond.publicKey.toBuffer()],
    program.programId,
  );

  const userTokenAccount = await findAssociatedTokenAddress(accounts.userPubkey, accounts.collateralTokenMint);
  // const collateralTokenAccount = await findAssociatedTokenAddress(bondProgramAuthority, accounts.collateralTokenMint);
  // const nftMetadata = getMetaplexMetadata(accounts.collateralTokenMint);
  // const ownerTokenRecord = findTokenRecordPda(accounts.collateralTokenMint, accounts.collateralTokenAccount);
  // const destTokenRecord = findTokenRecordPda(accounts.collateralTokenMint, userTokenAccount);
  // const meta = await Metadata.fromAccountAddress(connection, nftMetadata);
  // const ruleSet = meta.programmableConfig?.ruleSet;
  const userFbondTokenAccount = await findAssociatedTokenAddress(accounts.userPubkey, accounts.fbondsTokenMint);
  const userNewFbondTokenAccount = await findAssociatedTokenAddress(accounts.userPubkey, newFbondsTokenMint.publicKey);

  const [returnFundsOwner] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(RETURN_FUNDS_OWNER_PREFIX), accounts.fbond.toBuffer()],
    program.programId,
  );
  const newCollateralTokenAccount = await findAssociatedTokenAddress(
    newBondProgramAuthority,
    accounts.collateralTokenMint,
  );
  const [newCollateralBox] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(COLLATERAL_BOX_PREFIX), newFbond.publicKey.toBuffer(), ENCODER.encode('0')],
    program.programId,
  );

  let bondCollateralOrSolReceiver: web3.PublicKey;
  if (typeof accounts.bondCollateralOrSolReceiver !== 'undefined') {
    bondCollateralOrSolReceiver = accounts.bondCollateralOrSolReceiver;
  } else {
    bondCollateralOrSolReceiver = accounts.adminPubkey;
  }

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

  const [autocompoundDeposit] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(AUTOCOMPOUND_DEPOSIT_PREFIX), newFbondsTokenMint.publicKey.toBuffer(), accounts.pair.toBuffer()],
    program.programId,
  );

  const assetReceiverOrAutocompoundDepositTokenAccount = args.isAutocompoundOrAutoreceiveSol
    ? await findAssociatedTokenAddress(solFundsVault, newFbondsTokenMint.publicKey)
    : await findAssociatedTokenAddress(accounts.assetReceiver, newFbondsTokenMint.publicKey);
  const modifyComputeUnits = web3.ComputeBudgetProgram.setComputeUnitLimit({
    units: Math.round(800000 + Math.ceil(Math.random() * 10000)),
  });

  instructions.push(modifyComputeUnits);

  instructions.push(
    await program.methods
      .refinanceFbond(
        {},
        {
          amountToReturn: new BN(args.amountToReturn),
          bondDuration: new BN(args.bondDuration),
        },
        new BN(args.minAmountToGet),
        new BN(args.amountToSell),
      )
      .accountsStrict({
        collateralBox: collateralBox,
        fbond: accounts.fbond,
        bondProgramAuthority: bondProgramAuthority,
        returnFundsOwner: returnFundsOwner,
        fbondTokenMint: accounts.fbondsTokenMint,
        userFbondTokenAccount: userFbondTokenAccount,
        admin: accounts.adminPubkey,
        bondCollateralOrSolReceiver: bondCollateralOrSolReceiver,

        collateralTokenMint: accounts.collateralTokenMint,
        collateralTokenAccount: accounts.collateralTokenAccount,
        userTokenAccount: userTokenAccount,
        user: accounts.userPubkey,

        newFbond: newFbond.publicKey,
        newBondProgramAuthority: newBondProgramAuthority,
        newFbondTokenMint: newFbondsTokenMint.publicKey,
        userNewFbondTokenAccount: userNewFbondTokenAccount,
        newCollateralTokenAccount: newCollateralTokenAccount,
        newCollateralBox: newCollateralBox,

        validation: validation,
        autocompoundDeposit: autocompoundDeposit,
        pair: accounts.pair,
        hadoRegistry: hadoRegistry,
        fraktMarket: accounts.fraktMarket,
        oracleFloor: accounts.oracleFloor,
        whitelistEntry: accounts.whitelistEntry,
        assetReceiverOrAutocompoundDepositTokenAccount: assetReceiverOrAutocompoundDepositTokenAccount,
        assetReceiver: accounts.assetReceiver,
        fundsSolVault: solFundsVault,
        protocolFeeReceiver: accounts.protocolFeeReceiver,

        metadataInfo: metadataInfo,

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

  const signers = [newFbond, newFbondsTokenMint];
  // await sendTxn(transaction, signers);
  return { instructions, signers };
};
