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
  MUTUAL_BOND_TRADE_TXN_VAULT,
} from '../../constants';

import { getMetaplexEditionPda, getMetaplexMetadataPda, returnAnchorProgram } from '../../helpers';

export interface SellBondParamsAndAccounts {
  minAmountToGet: number;
  amountToSell: number;

  bondOfferV2: web3.PublicKey;
  assetReceiver: web3.PublicKey;
}

type ValidateAndSellToBondOffersV2 = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;

  args: {
    sellBondParamsAndAccounts: SellBondParamsAndAccounts[];
  };
  addComputeUnits?: boolean;

  accounts: {
    collateralBox: web3.PublicKey;
    fbond: web3.PublicKey;
    fbondTokenMint: web3.PublicKey;

    collateralTokenMint: web3.PublicKey;

    fraktMarket: web3.PublicKey;
    oracleFloor: web3.PublicKey;

    whitelistEntry: web3.PublicKey;
    hadoMarket: web3.PublicKey;

    userPubkey: web3.PublicKey;
    protocolFeeReceiver: web3.PublicKey;
  };

  sendTxn: (transaction: web3.Transaction, signers: web3.Signer[]) => Promise<void>;
}) => Promise<{
  account: web3.PublicKey | null;
  instructions: web3.TransactionInstruction[];
  signers: web3.Signer[];
  addressesForLookupTable: web3.PublicKey[];
}>;

export const validateAndSellToBondOffersV2: ValidateAndSellToBondOffersV2 = async ({
  programId,
  connection,
  args,
  accounts,
  addComputeUnits,
  sendTxn,
}) => {
  const program = returnAnchorProgram(programId, connection);
  const instructions: web3.TransactionInstruction[] = [];

  const userNftTokenAccount = await findAssociatedTokenAddress(accounts.userPubkey, accounts.fbondTokenMint);

  const [mutualBondTradeTxnVault] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(MUTUAL_BOND_TRADE_TXN_VAULT)],
    program.programId,
  );

  const [hadoRegistry, registrySeed] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(HADOMARKET_REGISTRY_PREFIX), accounts.hadoMarket.toBuffer()],
    program.programId,
  );

  const metadataInfo = getMetaplexMetadataPda(accounts.collateralTokenMint);
  const editionInfo = getMetaplexEditionPda(accounts.collateralTokenMint);

  const assetReceiverOrAutocompoundDepositTokenAccount = await findAssociatedTokenAddress(
    mutualBondTradeTxnVault,
    accounts.fbondTokenMint,
  );

  const sellBondParams = await Promise.all(
    args.sellBondParamsAndAccounts.map(async (sellBondParamsAndAccount) => {
      const [bondTradeTransactionV2, bondTradeTransactionV2Bump] = await web3.PublicKey.findProgramAddress(
        [
          ENCODER.encode(AUTOCOMPOUND_DEPOSIT_PREFIX),
          accounts.fbondTokenMint.toBuffer(),
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
            accounts.fbondTokenMint.toBuffer(),
            sellBondParamsAndAccount.bondOfferV2.toBuffer(),
            ENCODER.encode(sellBondParamsAndAccount.minAmountToGet.toString()),
            ENCODER.encode(sellBondParamsAndAccount.amountToSell.toString()),
          ],
          program.programId,
        );
        // console.log('bondTradeTransactionV2: ', bondTradeTransactionV2.toBase58());

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
  const accountsIntoInstruction = {
    collateralBox: accounts.collateralBox,
    fbond: accounts.fbond,
    fbondTokenMint: accounts.fbondTokenMint,
    hadoRegistry: hadoRegistry,
    fraktMarket: accounts.fraktMarket,

    oracleFloor: accounts.oracleFloor,

    whitelistEntry: accounts.whitelistEntry,

    user: accounts.userPubkey,
    assetReceiverOrAutocompoundDepositTokenAccount: assetReceiverOrAutocompoundDepositTokenAccount,
    mutualBondTradeTxnVault: mutualBondTradeTxnVault,

    nftUserTokenAccount: userNftTokenAccount,

    protocolFeeReceiver: accounts.protocolFeeReceiver,

    systemProgram: web3.SystemProgram.programId,
    rent: web3.SYSVAR_RENT_PUBKEY,

    metadataProgram: METADATA_PROGRAM_PUBKEY,

    metadataInfo: metadataInfo,
    editionInfo: editionInfo,
    tokenProgram: TOKEN_PROGRAM_ID,
    associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
  };

  instructions.push(
    await program.methods
      .validateAndSellToBondOffersV2(sellBondParams)
      .accountsStrict(accountsIntoInstruction)
      .remainingAccounts(sellBondRemainingAccounts)
      .instruction(),
  );
  const transaction = new web3.Transaction();
  for (let instruction of instructions) transaction.add(instruction);
  const remainingAccounts = sellBondRemainingAccounts.map(
    (sellBondRemainingAccount) => sellBondRemainingAccount.pubkey,
  );

  const addressesForLookupTable = [...Object.values(accountsIntoInstruction), ...remainingAccounts];
  const signers = [];
  await sendTxn(transaction, signers);
  return { account: null, instructions, signers, addressesForLookupTable };
};
