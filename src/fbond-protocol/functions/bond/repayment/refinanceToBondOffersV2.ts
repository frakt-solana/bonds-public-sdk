import { BN, web3 } from '@project-serum/anchor';
import { ASSOCIATED_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token';
import { findAssociatedTokenAddress } from '../../../../common';
import { AUTHORIZATION_RULES_PROGRAM, ENCODER, METADATA_PROGRAM_PUBKEY } from '../../../constants';
import {
  AUTOCOMPOUND_DEPOSIT_PREFIX,
  BOND_PROOGRAM_AUTHORITY_PREFIX,
  RETURN_FUNDS_OWNER_PREFIX,
  COLLATERAL_BOX_PREFIX,
  VALIDATION_PREFIX,
  SOL_FUNDS_PREFIX,
  HADOMARKET_REGISTRY_PREFIX,
  MUTUAL_BOND_TRADE_TXN_VAULT,
} from '../../../constants';
import { Metadata, TokenRecord, TokenStandard } from '@metaplex-foundation/mpl-token-metadata';
import {
  findTokenRecordPda,
  getMetaplexEditionPda,
  getMetaplexMetadataPda,
  getMetaplexMetadata,
  returnAnchorProgram,
} from './../../../helpers';
import { RepayAccounts } from './repayFbondToTradeTransactions';

export interface SellBondParamsAndAccounts {
  minAmountToGet: number;
  amountToSell: number;

  bondOfferV2: web3.PublicKey;
  assetReceiver: web3.PublicKey;
}

type RefinanceToBondOffersV2 = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;

  args: {
    nextBoxIndex: string;
    amountToReturn: number;
    bondDuration: number;
    sellBondParamsAndAccounts: SellBondParamsAndAccounts[];
    repayAccounts: RepayAccounts[];
  };
  addComputeUnits?: boolean;

  accounts: {
    userPubkey: web3.PublicKey;
    fbond: web3.PublicKey;
    collateralTokenMint: web3.PublicKey;
    collateralTokenAccount: web3.PublicKey;
    fbondsTokenMint: web3.PublicKey;
    adminPubkey: web3.PublicKey;

    fraktMarket: web3.PublicKey;
    oracleFloor: web3.PublicKey;

    whitelistEntry: web3.PublicKey;
    hadoMarket: web3.PublicKey;

    protocolFeeReceiver: web3.PublicKey;
  };

  sendTxn: (transaction: web3.Transaction, signers: web3.Signer[]) => Promise<void>;
}) => Promise<{
  instructions: web3.TransactionInstruction[];
  signers: web3.Signer[];
  fbond: web3.PublicKey;
  fbondTokenMint: web3.PublicKey;
  collateralBox: web3.PublicKey;
  addressesForLookupTable: web3.PublicKey[];
}>;

export const refinanceToBondOffersV2: RefinanceToBondOffersV2 = async ({
  programId,
  connection,
  accounts,
  addComputeUnits,
  args,
  sendTxn,
}) => {
  const program = returnAnchorProgram(programId, connection);
  const instructions: web3.TransactionInstruction[] = [];
  const newFbond = web3.Keypair.generate();
  const newFbondsTokenMint = web3.Keypair.generate();

  const [mutualBondTradeTxnVault] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(MUTUAL_BOND_TRADE_TXN_VAULT)],
    program.programId,
  );

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
  const [newReturnFundsOwner, newReturnFundsOwnerSeed] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(RETURN_FUNDS_OWNER_PREFIX), newFbond.publicKey.toBuffer()],
    program.programId,
  );

  const userTokenAccount = await findAssociatedTokenAddress(accounts.userPubkey, accounts.collateralTokenMint);

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

  const [hadoRegistry, registrySeed] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(HADOMARKET_REGISTRY_PREFIX), accounts.hadoMarket.toBuffer()],
    program.programId,
  );

  const metadataInfo = getMetaplexMetadataPda(accounts.collateralTokenMint);
  const editionInfo = getMetaplexEditionPda(accounts.collateralTokenMint);

  const nftMetadata = getMetaplexMetadata(accounts.collateralTokenMint);
  const ownerTokenRecord = findTokenRecordPda(accounts.collateralTokenMint, accounts.collateralTokenAccount);
  const destTokenRecord = findTokenRecordPda(accounts.collateralTokenMint, newCollateralTokenAccount);
  const meta = await Metadata.fromAccountAddress(connection, nftMetadata);
  const ruleSet = meta.programmableConfig?.ruleSet;
  const tokenRecordData = //{delegate: null};
    meta.tokenStandard === TokenStandard.ProgrammableNonFungible
      ? await TokenRecord.fromAccountAddress(connection, ownerTokenRecord)
      : { delegate: null };
  const delegatePubkey = tokenRecordData.delegate;

  const assetReceiverOrAutocompoundDepositTokenAccount = await findAssociatedTokenAddress(
    mutualBondTradeTxnVault,
    newFbondsTokenMint.publicKey,
  );

  const repayRemainingAccounts = args.repayAccounts
    .map((repayAccount) => {
      return [
        {
          pubkey: repayAccount.bondTradeTransaction,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: repayAccount.user,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: repayAccount.bondOffer,
          isSigner: false,
          isWritable: true,
        },
      ];
    })
    .flat();

  const sellBondParams = await Promise.all(
    args.sellBondParamsAndAccounts.map(async (sellBondParamsAndAccount) => {
      const [bondTradeTransactionV2, bondTradeTransactionV2Bump] = await web3.PublicKey.findProgramAddress(
        [
          ENCODER.encode(AUTOCOMPOUND_DEPOSIT_PREFIX),
          newFbondsTokenMint.publicKey.toBuffer(),
          sellBondParamsAndAccount.bondOfferV2.toBuffer(),
          ENCODER.encode(sellBondParamsAndAccount.minAmountToGet.toString()),
          ENCODER.encode(sellBondParamsAndAccount.amountToSell.toString()),
        ],
        program.programId,
      );
      return {
        minAmountToGet: new BN(sellBondParamsAndAccount.minAmountToGet),
        amountToSell: new BN(sellBondParamsAndAccount.amountToSell),
        bondTradeTransactionV2Bump: bondTradeTransactionV2Bump,
      };
    }),
  );

  const sellBondRemainingAccounts = (
    await Promise.all(
      args.sellBondParamsAndAccounts.map(async (sellBondParamsAndAccount) => {
        const [bondTradeTransactionV2, bondTradeTransactionV2Bump] = await web3.PublicKey.findProgramAddress(
          [
            ENCODER.encode(AUTOCOMPOUND_DEPOSIT_PREFIX),
            newFbondsTokenMint.publicKey.toBuffer(),
            sellBondParamsAndAccount.bondOfferV2.toBuffer(),
            ENCODER.encode(sellBondParamsAndAccount.minAmountToGet.toString()),
            ENCODER.encode(sellBondParamsAndAccount.amountToSell.toString()),
          ],
          program.programId,
        );

        return [
          {
            pubkey: sellBondParamsAndAccount.bondOfferV2,
            isSigner: false,
            isWritable: true,
          },
          {
            pubkey: bondTradeTransactionV2,
            isSigner: false,
            isWritable: true,
          },
        ];
      }),
    )
  ).flat();
  // const sellBondParams = [
  //   {
  //     minAmountToGet: new BN(args.minAmountToGet),
  //     amountToSell: new BN(args.amountToSell),
  //     bondTradeTransactionV2Bump: bondTradeTransactionV2Bump,
  //   },
  // ];
  const modifyComputeUnits = web3.ComputeBudgetProgram.setComputeUnitLimit({
    units: Math.round(800000 + Math.ceil(Math.random() * 10000)),
  });
  const requestHeap = web3.ComputeBudgetProgram.requestHeapFrame({ bytes: 1024 * 250 });
  instructions.push(requestHeap);

  if (!!addComputeUnits) instructions.push(modifyComputeUnits);
  const remainingAccountsPnft = [
    {
      pubkey: ruleSet || METADATA_PROGRAM_PUBKEY,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: delegatePubkey || METADATA_PROGRAM_PUBKEY,
      isSigner: false,
      isWritable: false,
    },
  ];
  const refinanceRemainingAccountsRaw = [
    ...sellBondRemainingAccounts,
    ...repayRemainingAccounts,
    ...remainingAccountsPnft,
  ];
  const refinanceRemainingAccounts = refinanceRemainingAccountsRaw.map((remainingAccount, i) => ({
    ...remainingAccount,
    isWritable: refinanceRemainingAccountsRaw.find(
      (remainingAccount2, i2) => remainingAccount.pubkey.toBase58() == remainingAccount2.pubkey.toBase58() && i > i2,
    )
      ? false
      : remainingAccount.isWritable,
  }));

  const accountsIntoInstruction = {
    collateralBox: collateralBox,
    fbond: accounts.fbond,
    bondProgramAuthority: bondProgramAuthority,
    fbondTokenMint: accounts.fbondsTokenMint,
    userFbondTokenAccount: userFbondTokenAccount,
    admin: accounts.adminPubkey,

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

    hadoRegistry: hadoRegistry,
    fraktMarket: accounts.fraktMarket,
    oracleFloor: accounts.oracleFloor,
    whitelistEntry: accounts.whitelistEntry,
    assetReceiverOrAutocompoundDepositTokenAccount: assetReceiverOrAutocompoundDepositTokenAccount,
    protocolFeeReceiver: accounts.protocolFeeReceiver,
    mutualBondTradeTxnVault: mutualBondTradeTxnVault,

    metadataInfo: metadataInfo,

    tokenProgram: TOKEN_PROGRAM_ID,
    associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
    nftMetadata,
    ownerTokenRecord,
    destTokenRecord,
    instructions: web3.SYSVAR_INSTRUCTIONS_PUBKEY,
    authorizationRulesProgram: AUTHORIZATION_RULES_PROGRAM,

    systemProgram: web3.SystemProgram.programId,
    rent: web3.SYSVAR_RENT_PUBKEY,
    metadataProgram: METADATA_PROGRAM_PUBKEY,
    editionInfo: editionInfo,
  };

  instructions.push(
    await program.methods
      .refinanceToBondOffersV2(
        {},
        {
          amountToReturn: new BN(args.amountToReturn),
          bondDuration: new BN(args.bondDuration),
        },
        null,
        sellBondParams,
      )
      .accountsStrict(accountsIntoInstruction)
      .remainingAccounts(refinanceRemainingAccounts)
      .instruction(),
  );

  const transaction = new web3.Transaction();
  for (let instruction of instructions) transaction.add(instruction);

  const remainingAccounts = refinanceRemainingAccounts.map(
    (refinanceRemainingAccount) => refinanceRemainingAccount.pubkey,
  );

  const addressesForLookupTable = [...Object.values(accountsIntoInstruction), ...remainingAccounts];
  const signers = [newFbond, newFbondsTokenMint];
  // await sendTxn(transaction, signers);
  return {
    instructions,
    signers,
    fbond: newFbond.publicKey,
    fbondTokenMint: newFbondsTokenMint.publicKey,
    collateralBox: newCollateralBox,
    addressesForLookupTable,
  };
};
