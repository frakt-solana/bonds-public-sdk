import { BN, web3 } from '@project-serum/anchor';
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
} from '../../../constants';

import {
  anchorRawBNsAndPubkeysToNumsAndStrings,
  getMetaplexEditionPda,
  getMetaplexMetadataPda,
  returnAnchorProgram,
} from '../../../helpers';
import { SellBondParamsAndAccounts } from '../repayment';

type ExitValidateAndSellToBondOffersV2 = (params: {
  programId: web3.PublicKey;
  connection: web3.Connection;

  args: {
    sellBondParamsAndAccounts: SellBondParamsAndAccounts[];
    userBondTradeTransactions: web3.PublicKey[];
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

export const exitValidateAndSellToBondOffersV2: ExitValidateAndSellToBondOffersV2 = async ({
  programId,
  connection,
  args,
  accounts,
  addComputeUnits,
  sendTxn,
}) => {
  const program = returnAnchorProgram(programId, connection);
  const instructions: web3.TransactionInstruction[] = [];

  const [hadoRegistry, registrySeed] = await web3.PublicKey.findProgramAddress(
    [ENCODER.encode(HADOMARKET_REGISTRY_PREFIX), accounts.hadoMarket.toBuffer()],
    program.programId,
  );

  const metadataInfo = getMetaplexMetadataPda(accounts.collateralTokenMint);
  const editionInfo = getMetaplexEditionPda(accounts.collateralTokenMint);

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

  const userBondTradeTransactionAccounts = args.userBondTradeTransactions.map((userBondTradeTransaction) => ({
    pubkey: userBondTradeTransaction,
    isSigner: false,
    isWritable: true,
  }));
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

    protocolFeeReceiver: accounts.protocolFeeReceiver,

    systemProgram: web3.SystemProgram.programId,
    rent: web3.SYSVAR_RENT_PUBKEY,

    metadataProgram: METADATA_PROGRAM_PUBKEY,

    metadataInfo: metadataInfo,
    editionInfo: editionInfo,
  };

  console.log(
    'accounts: ',
    anchorRawBNsAndPubkeysToNumsAndStrings({ publicKey: hadoRegistry, account: accountsIntoInstruction }),
  );

  instructions.push(
    await program.methods
      .exitValidateAndSellToBondOffersV2(sellBondParams)
      .accountsStrict(accountsIntoInstruction)
      .remainingAccounts([...sellBondRemainingAccounts, ...userBondTradeTransactionAccounts])
      .instruction(),
  );
  const transaction = new web3.Transaction();
  for (let instruction of instructions) transaction.add(instruction);
  const remainingAccounts = [
    ...sellBondRemainingAccounts.map((sellBondRemainingAccount) => sellBondRemainingAccount.pubkey),
    ...args.userBondTradeTransactions,
  ];

  const addressesForLookupTable = [...Object.values(accountsIntoInstruction), ...remainingAccounts];
  const signers = [];
  await sendTxn(transaction, signers);
  return { account: null, instructions, signers, addressesForLookupTable };
};
