import { web3 } from '@project-serum/anchor';
import { OrderType, PairType } from '../types';
import { TOKEN_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token';

export const getTradeActivities = async ({
  programId,
  //   fromThisSignature,
  untilThisSignature,
  connection,
}: {
  programId: web3.PublicKey;
  //   fromThisSignature?: string;
  untilThisSignature?: string;
  connection: web3.Connection;
}) => {
  const LIMIT = 100;
  let allSignaturesInfos: web3.ConfirmedSignatureInfo[] = [];
  const currentLastSignatureInfo = (
    await connection.getConfirmedSignaturesForAddress2(
      programId,
      {
        limit: 1,
      },
      'confirmed',
    )
  )[0];

  let currentLastSignature = currentLastSignatureInfo.signature;
  if (currentLastSignature == untilThisSignature) return [];
  let newSignatureInfosLatestToPast = await connection.getConfirmedSignaturesForAddress2(
    programId,
    {
      limit: LIMIT,
      before: currentLastSignature,
      until: untilThisSignature,
    },
    'confirmed',
  );
  if (newSignatureInfosLatestToPast.length == 0) return [];
  currentLastSignature = newSignatureInfosLatestToPast[newSignatureInfosLatestToPast.length - 1].signature;

  allSignaturesInfos = [...allSignaturesInfos, ...newSignatureInfosLatestToPast, currentLastSignatureInfo].filter(
    (signatureInfo) => !signatureInfo.err,
  );

  while (newSignatureInfosLatestToPast.length === LIMIT) {
    newSignatureInfosLatestToPast = await connection.getConfirmedSignaturesForAddress2(
      programId,
      {
        limit: LIMIT,
        before: currentLastSignature,
        until: untilThisSignature,
      },
      'confirmed',
    );
    currentLastSignature = newSignatureInfosLatestToPast[newSignatureInfosLatestToPast.length - 1].signature;

    allSignaturesInfos = [...allSignaturesInfos, ...newSignatureInfosLatestToPast].filter(
      (signatureInfo) => !signatureInfo.err,
    );
  }

  const tradeTransactions: web3.ParsedTransactionWithMeta[] = await getTradeTransactionsFromSignatures({
    signatures: allSignaturesInfos.map((signatureInfo) => signatureInfo.signature),
    connection,
  });
  let allTradeActivities: TradeActivity[] = [];
  //   console.log('tradeTransactions: ', tradeTransactions.length);
  for (let tradeTxn of tradeTransactions) {
    const tradeActivities = await parseTransactionInfoToTradeActivities({ tradeTxn, connection });
    allTradeActivities = [...allTradeActivities, ...tradeActivities];
  }

  return allTradeActivities;
};

export const getTradeActivitiesBySignatures = async ({
  signatures,
  connection,
}: {
  signatures: string[];
  connection: web3.Connection;
}): Promise<TradeActivity[]> => {
  const tradeTransactions: web3.ParsedTransactionWithMeta[] = await getTradeTransactionsFromSignatures({
    signatures,
    connection,
  });

  let allTradeActivities: TradeActivity[] = [];
  for (let tradeTxn of tradeTransactions) {
    const tradeActivities = await parseTransactionInfoToTradeActivities({ tradeTxn, connection });
    allTradeActivities = [...allTradeActivities, ...tradeActivities];
  }

  return allTradeActivities;
};

export const getTradeTransactionsFromSignatures = async ({
  signatures,
  connection,
}: {
  signatures: string[];
  connection: web3.Connection;
}): Promise<web3.ParsedTransactionWithMeta[]> => {
  const tradeTransactions: web3.ParsedTransactionWithMeta[] = [];
  for (let signature of signatures) {
    const currentTransactionInfo: web3.ParsedTransactionWithMeta | null = await connection.getParsedTransaction(
      signature,
      {
        commitment: 'confirmed',
        maxSupportedTransactionVersion: 0,
      },
    );
    if (!currentTransactionInfo || !isTradeTransactionInfo(currentTransactionInfo as any)) continue;
    tradeTransactions.push(currentTransactionInfo as any);
  }
  return tradeTransactions;
};

const isTradeTransactionInfo = (currentTransactionInfo: web3.ParsedTransactionWithMeta): boolean => {
  return currentTransactionInfo.meta?.logMessages?.find(isTradeInstructionLog) !== undefined;
};

const parseTransactionInfoToTradeActivities = async ({
  tradeTxn,
  connection,
}: {
  tradeTxn: web3.ParsedTransactionWithMeta;
  connection: web3.Connection;
}): Promise<TradeActivity[]> => {
  //   console.log(currentTransactionInfo);
  const instructionLogs: string[] = tradeTxn.meta?.logMessages?.reduce(
    (instructionLogs, log) => (isBondInstructionLog(log) ? [...instructionLogs, log] : instructionLogs),
    [] as string[],
  ) as any;

  const programInstructionsRaw: web3.PartiallyDecodedInstruction[] = tradeTxn.transaction.message.instructions as any;
  const innerInstructions: web3.ParsedInnerInstruction[] = tradeTxn.meta?.innerInstructions as any;
  const programInstructions: web3.PartiallyDecodedInstruction[] = programInstructionsRaw as any;

  const tradeActivities: TradeActivity[] = [];
  for (let i = 0; i < innerInstructions.length; i++) {
    const currentLog = instructionLogs[i];

    if (!isTradeInstructionLog(currentLog)) continue;

    const currentInnerInstruction = innerInstructions[i];
    const currentProgramInstruction = programInstructions[i];

    const currentSignature = tradeTxn.transaction.signatures[0];
    const blockTime = tradeTxn.blockTime;

    if (!TRADE_TRANSACTION_PARSERS[currentLog]) continue;
    const parsedTradeActivity = await TRADE_TRANSACTION_PARSERS[currentLog]({
      innerInstruction: currentInnerInstruction,
      programInstruction: currentProgramInstruction,
      signature: currentSignature,
      transaction: tradeTxn,
      blockTime,
      connection,
    });

    if (!parsedTradeActivity) continue;
    tradeActivities.push(parsedTradeActivity);
  }

  return tradeActivities;
};

const isTradeInstructionLog = (log: string) =>
  log === TradeInstruction.BuyNftFromPair ||
  log === TradeInstruction.SellNftToTokenToNftPair ||
  log === TradeInstruction.SellNftToLiquidityPair ||
  log === TradeInstruction.ValidateAndSellNftToTokenToNftPair;

const isBondInstructionLog = (log: string) =>
  log === TradeInstruction.BuyNftFromPair ||
  log === TradeInstruction.SellNftToTokenToNftPair ||
  log === TradeInstruction.SellNftToLiquidityPair ||
  log === TradeInstruction.ValidateAndSellNftToTokenToNftPair ||
  log === TradeInstruction.CreateBondWithSingleCollateral;

const isInstructionLog = (log: string) => log.startsWith('Program log: Instruction:');

export interface TradeActivity {
  timestamp: number;
  signature: string;
  pair: string;
  orderType: OrderType;
  pairType: PairType | null;

  nftMint: string;
  solAmount: number;

  amountOfTokens: number;
  userMaker: string | null;
  userTaker: string;
}

enum TradeInstruction {
  BuyNftFromPair = 'Program log: Instruction: BuyNftFromPair',
  SellNftToTokenToNftPair = 'Program log: Instruction: SellNftToTokenToNftPair',
  SellNftToLiquidityPair = 'Program log: Instruction: SellNftToLiquidityPair',
  ValidateAndSellNftToTokenToNftPair = 'Program log: Instruction: ValidateAndSellNftToTokenToNftPair',
  CreateBondWithSingleCollateral = 'Program log: Instruction: CreateBondWithSingleCollateral',
}

const TRADE_TRANSACTION_PARSERS = {
  [TradeInstruction.BuyNftFromPair]: async ({
    innerInstruction,
    programInstruction,
    signature,
    blockTime,
    transaction,
    connection,
  }: {
    innerInstruction: web3.ParsedInnerInstruction;
    programInstruction: web3.PartiallyDecodedInstruction;
    signature: string;
    blockTime: number;
    transaction: web3.ParsedTransactionWithMeta;

    connection: web3.Connection;
  }): Promise<TradeActivity> => {
    const solAmount = getTransferAmountFromInnerInstructions(innerInstruction);
    const orderType = OrderType.Buy;
    const pair = programInstruction.accounts[1];
    const userTaker = programInstruction.accounts[2];
    const userMaker = programInstruction.accounts[9];
    const nftMint = programInstruction.accounts[6];

    const preMintTokenBalance: any = transaction.meta?.preTokenBalances?.find(
      (preBalance) => preBalance.mint === nftMint.toBase58(),
    );
    if (!preMintTokenBalance) {
      return {
        timestamp: blockTime,
        signature: signature,
        pair: pair ? pair.toBase58() : '',
        orderType: orderType,
        pairType: null,
        nftMint: nftMint ? nftMint.toBase58() : '',
        solAmount: solAmount,
        amountOfTokens: 0,
        userMaker: userMaker ? userMaker.toBase58() : '',
        userTaker: userTaker ? userTaker.toBase58() : '',
      };
    }

    const postMintTokenBalance: any = transaction.meta?.postTokenBalances?.find(
      (preBalance) => preBalance.mint === nftMint.toBase58(),
    );

    const amountOfTokens = Math.abs(
      preMintTokenBalance.uiTokenAmount.uiAmount - postMintTokenBalance?.uiTokenAmount.uiAmountString,
    );

    return {
      timestamp: blockTime,
      signature: signature,
      pair: pair ? pair.toBase58() : '',
      orderType: orderType,
      pairType: null,
      nftMint: nftMint ? nftMint.toBase58() : '',
      solAmount: solAmount,
      amountOfTokens: amountOfTokens,
      userMaker: userMaker ? userMaker.toBase58() : '',
      userTaker: userTaker ? userTaker.toBase58() : '',
    };
  },
  [TradeInstruction.SellNftToTokenToNftPair]: async ({
    innerInstruction,
    programInstruction,
    signature,
    blockTime,
    transaction,
    connection,
  }: {
    innerInstruction: web3.ParsedInnerInstruction;
    programInstruction: web3.PartiallyDecodedInstruction;
    signature: string;
    blockTime: number;
    transaction: web3.ParsedTransactionWithMeta;

    connection: web3.Connection;
  }): Promise<TradeActivity> => {
    const solAmount = getTransferAmountFromInnerInstructions(innerInstruction);
    const orderType = OrderType.Sell;
    const pair = programInstruction.accounts[0];
    const userTaker = programInstruction.accounts[2];
    const userMaker = programInstruction.accounts[7];
    const nftMint = programInstruction.accounts[3];

    const preMintTokenBalance: any = transaction.meta?.preTokenBalances?.find(
      (preBalance) => preBalance.mint === nftMint.toBase58(),
    );
    if (!preMintTokenBalance) {
      return {
        timestamp: blockTime,
        signature: signature,
        pair: pair ? pair.toBase58() : '',
        orderType: orderType,
        pairType: null,
        nftMint: nftMint ? nftMint.toBase58() : '',
        solAmount: solAmount,
        amountOfTokens: 0,
        userMaker: userMaker ? userMaker.toBase58() : '',
        userTaker: userTaker ? userTaker.toBase58() : '',
      };
    }

    const postMintTokenBalance: any = transaction.meta?.postTokenBalances?.find(
      (preBalance) => preBalance.mint === nftMint.toBase58(),
    );

    const amountOfTokens = Math.abs(
      preMintTokenBalance.uiTokenAmount.uiAmount - postMintTokenBalance?.uiTokenAmount.uiAmountString,
    );

    return {
      timestamp: blockTime,
      signature: signature,
      pair: pair ? pair.toBase58() : '',
      orderType: orderType,
      pairType: PairType.TokenForNFT,
      nftMint: nftMint ? nftMint.toBase58() : '',
      solAmount: solAmount,
      amountOfTokens,
      userMaker: userMaker ? userMaker.toBase58() : '',
      userTaker: userTaker ? userTaker.toBase58() : '',
    };
  },
  [TradeInstruction.SellNftToLiquidityPair]: async ({
    innerInstruction,
    programInstruction,
    signature,
    blockTime,
    transaction,
    connection,
  }: {
    innerInstruction: web3.ParsedInnerInstruction;
    programInstruction: web3.PartiallyDecodedInstruction;
    signature: string;
    blockTime: number;
    transaction: web3.ParsedTransactionWithMeta;
    connection: web3.Connection;
  }): Promise<TradeActivity> => {
    // try {
    const solAmount = getTransferAmountFromInnerInstructions(innerInstruction);
    const orderType = OrderType.Sell;
    const pair = programInstruction.accounts[1];
    const userTaker = programInstruction.accounts[3];
    // const userMaker = programInstruction.accounts[7];
    const nftMint = programInstruction.accounts[4];

    const preMintTokenBalance: any = transaction.meta?.preTokenBalances?.find(
      (preBalance) => preBalance.mint === nftMint.toBase58(),
    );
    if (!preMintTokenBalance) {
      return {
        timestamp: blockTime,
        signature: signature,
        pair: pair ? pair.toBase58() : '',
        orderType: orderType,
        pairType: null,
        nftMint: nftMint ? nftMint.toBase58() : '',
        solAmount: solAmount,
        amountOfTokens: 0,
        userMaker: null,
        userTaker: userTaker ? userTaker.toBase58() : '',
      };
    }

    const postMintTokenBalance: any = transaction.meta?.postTokenBalances?.find(
      (preBalance) => preBalance.mint === nftMint.toBase58(),
    );

    const amountOfTokens = Math.abs(
      preMintTokenBalance.uiTokenAmount.uiAmount - postMintTokenBalance?.uiTokenAmount.uiAmountString,
    );

    return {
      timestamp: blockTime,
      signature: signature,
      pair: pair ? pair.toBase58() : '',
      orderType: orderType,
      pairType: PairType.LiquidityProvision,
      nftMint: nftMint ? nftMint.toBase58() : '',
      // bid_cap:
      solAmount: solAmount,
      amountOfTokens: amountOfTokens,
      userMaker: null,
      userTaker: userTaker ? userTaker.toBase58() : '',
    };
    // } catch(err) }
  },
  [TradeInstruction.ValidateAndSellNftToTokenToNftPair]: async ({
    innerInstruction,
    programInstruction,
    signature,
    blockTime,
    transaction,
    connection,
  }: {
    innerInstruction: web3.ParsedInnerInstruction;
    programInstruction: web3.PartiallyDecodedInstruction;
    signature: string;
    blockTime: number;
    transaction: web3.ParsedTransactionWithMeta;

    connection: web3.Connection;
  }): Promise<TradeActivity> => {
    const solAmount = getTransferAmountFromInnerInstructions(innerInstruction);
    const orderType = OrderType.Sell;
    const pair = programInstruction.accounts[5];
    const userTaker = programInstruction.accounts[10];
    const userMaker = programInstruction.accounts[13];
    const nftMint = programInstruction.accounts[4];

    const amountOfTokens =
      (innerInstruction.instructions.find((ix) => (ix as any).parsed.type == 'burn') as any)?.parsed?.info?.amount ||
      +(
        innerInstruction.instructions.find(
          (ix) => (ix as any).parsed.type == 'transfer' && ix.programId.toBase58() === TOKEN_PROGRAM_ID.toBase58(),
        ) as any
      ).parsed.info.amount;

    return {
      timestamp: blockTime,
      signature: signature,
      pair: pair ? pair.toBase58() : '',
      orderType: orderType,
      pairType: PairType.TokenForNFT,
      nftMint: nftMint ? nftMint.toBase58() : '',
      solAmount: +solAmount,
      amountOfTokens: +amountOfTokens,
      userMaker: userMaker ? userMaker.toBase58() : '',
      userTaker: userTaker ? userTaker.toBase58() : '',
    };
  },
};

const getTransferAmountFromInnerInstructions = (innerInstruction: web3.ParsedInnerInstruction) => {
  return innerInstruction.instructions
    .filter((instruction) => (instruction as any).program === InnerProgramTypes.System)
    .filter((instruction: any) => instruction.parsed.type === InnerInstructionTypes.Transfer)
    .reduce((amount, instruction: any) => {
      return amount + instruction.parsed.info.lamports;
    }, 0);
};

enum InnerProgramTypes {
  System = 'system',
  SplToken = 'spl-token',
}

enum InnerInstructionTypes {
  Transfer = 'transfer',
}
