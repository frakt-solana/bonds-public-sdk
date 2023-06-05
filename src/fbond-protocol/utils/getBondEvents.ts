import { web3 } from '@project-serum/anchor';
import { BondEventType } from '../types';
import { BOND_DECIMAL_DELTA } from './cartManager';

export const getBondEvents = async ({
  programId,
  fromThisSignature,
  eventslimit,
  signaturesLimit,
  untilThisSignature,
  connection,
}: {
  programId: web3.PublicKey;
  fromThisSignature?: string;
  eventslimit?: number;
  signaturesLimit?: number;

  untilThisSignature?: string;
  connection: web3.Connection;
}) => {
  const LIMIT = !eventslimit || eventslimit > 100 ? 100 : eventslimit;
  const limitSig = !signaturesLimit ? 1e10 : signaturesLimit;
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

  let currentLastSignature = fromThisSignature || currentLastSignatureInfo.signature;
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
  while (
    newSignatureInfosLatestToPast.length === LIMIT &&
    (!eventslimit || allSignaturesInfos.length >= eventslimit) &&
    allSignaturesInfos.length < limitSig
  ) {
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
  const bondTransactions: web3.ParsedTransactionWithMeta[] = await getBondTransactionsFromSignatures({
    signatures: allSignaturesInfos.map((signatureInfo) => signatureInfo.signature),
    connection,
  });
  let allBondEvents: BondEvent[] = [];

  for (let bondTxn of bondTransactions) {
    const bondEvents = await parseTransactionInfoToBondEvents({ bondTxn, connection });
    allBondEvents = [...allBondEvents, ...bondEvents];
  }

  return allBondEvents;
};

export const getBondEventsBySignatures = async ({
  signatures,
  connection,
}: {
  signatures: string[];
  connection: web3.Connection;
}): Promise<BondEvent[]> => {
  const bondTransactions: web3.ParsedTransactionWithMeta[] = await getBondTransactionsFromSignatures({
    signatures,
    connection,
  });

  let allbondEvents: BondEvent[] = [];
  for (let bondTxn of bondTransactions) {
    const bondEvents = await parseTransactionInfoToBondEvents({ bondTxn, connection });
    allbondEvents = [...allbondEvents, ...bondEvents];
  }

  return allbondEvents;
};

export const getBondTransactionsFromSignatures = async ({
  signatures,
  connection,
}: {
  signatures: string[];
  connection: web3.Connection;
}): Promise<web3.ParsedTransactionWithMeta[]> => {
  const bondTransactions: web3.ParsedTransactionWithMeta[] = [];
  for (let signature of signatures) {
    const currentTransactionInfo: web3.ParsedTransactionWithMeta | null = await connection.getParsedTransaction(
      signature,
      {
        commitment: 'confirmed',
        maxSupportedTransactionVersion: 0,
      },
    );

    if (!currentTransactionInfo || !isBondTransactionInfo(currentTransactionInfo as any)) continue;
    bondTransactions.push(currentTransactionInfo as any);
  }
  return bondTransactions;
};

const isBondTransactionInfo = (currentTransactionInfo: web3.ParsedTransactionWithMeta): boolean => {
  return currentTransactionInfo.meta?.logMessages?.find(isBondInstructionLog) !== undefined;
};

const parseTransactionInfoToBondEvents = async ({
  bondTxn,
  connection,
}: {
  bondTxn: web3.ParsedTransactionWithMeta;
  connection: web3.Connection;
}): Promise<BondEvent[]> => {
  const instructionLogs: string[] = bondTxn.meta?.logMessages?.reduce(
    (instructionLogs, log) => (isBondInstructionLog(log) ? [...instructionLogs, log] : instructionLogs),
    [] as string[],
  ) as any;

  const programInstructionsRaw: web3.PartiallyDecodedInstruction[] = bondTxn.transaction.message.instructions as any;
  const innerInstructions: web3.ParsedInnerInstruction[] = bondTxn.meta?.innerInstructions as any;
  const programInstructions: web3.PartiallyDecodedInstruction[] = programInstructionsRaw as any;

  let bondEvents: BondEvent[] = [];
  for (let i = 0; i < innerInstructions.length; i++) {
    const currentLog = instructionLogs[i];

    if (!isBondInstructionLog(currentLog)) continue;
    const currentSignature = bondTxn.transaction.signatures[0];

    const currentInnerInstruction = innerInstructions[i];
    const currentProgramInstruction =
      programInstructions[i].accounts.length == 0 ? programInstructions[i + 1] : programInstructions[i];

    const blockTime = bondTxn.blockTime;
    if (!BOND_TRANSACTION_PARSERS[currentLog]) continue;
    const parsedBondEvents = await BOND_TRANSACTION_PARSERS[currentLog]({
      innerInstruction: currentInnerInstruction,
      programInstruction:
        currentProgramInstruction.accounts.length == 0 ? programInstructions[i + 2] : currentProgramInstruction,
      signature: currentSignature,
      transaction: bondTxn,
      blockTime,
      connection,
    });

    if (!parsedBondEvents) continue;
    bondEvents = [...bondEvents, ...parsedBondEvents];
  }

  return bondEvents;
};

const isBondInstructionLog = (log: string) => Object.values<string>(BondInstruction).includes(log);
// log in BondInstruction;
//   log === BondInstruction.CreateBondWithSingleCollateral ||
//   log === BondInstruction.RepayFbond ||
//   log === BondInstruction.ExtractCollateralToLiquidate ||
//   log === BondInstruction.DepositReturnedSolToLiquidatingBond ||
//   log === BondInstruction.LiquidateFBond;

// const isBondInstructionLog = (log: string) =>
//     log === BondInstruction.BuyNftFromPair ||
//     log === BondInstruction.SellNftToTokenToNftPair ||
//     log === BondInstruction.SellNftToLiquidityPair ||
//     log === BondInstruction.CreateBondWithSingleCollateral;

const isInstructionLog = (log: string) => log.startsWith('Program log: Instruction:');

export interface BondEvent {
  timestamp: number;
  signature: string;
  bondEventType: BondEventType;

  fbond: string;
  user: string;
  pair?: string;

  solAmount: number | null;
  bondsAmount: number | null;

  nft?: string;
}

enum BondInstruction {
  CreateBondWithSingleCollateral = 'Program log: Instruction: CreateBondWithSingleCollateral',

  RepayFbond = 'Program log: Instruction: RepayFbond',
  ExtractCollateralToLiquidate = 'Program log: Instruction: ExtractCollateralToLiquidate',

  ExtractCollateralToLiquidatePnft = 'Program log: Instruction: ExtractCollateralToLiquidatePnft',
  LiquidateReceivingNftFbondPnft = 'Program log: Instruction: LiquidateReceivingNftFbondPnft',

  DepositReturnedSolToLiquidatingBond = 'Program log: Instruction: DepositReturnedSolToLiquidatingBond',
  LiquidateFBond = 'Program log: Instruction: LiquidateFBond',

  RepayFbondToTradeTransactions = 'Program log: Instruction: RepayFbondToTradeTransactions',
  CreateBondAndSellToOffers = 'Program log: Instruction: CreateBondAndSellToOffers',
  RefinanceToBondOffersV2 = 'Program log: Instruction: RefinanceToBondOffersV2',
  LiquidateBondOnAuction = 'Program log: Instruction: LiquidateBondOnAuction',
}

const BOND_TRANSACTION_PARSERS = {
  [BondInstruction.RepayFbond]: async ({
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
  }): Promise<BondEvent[]> => {
    const bondsAmount = (innerInstruction.instructions.find((ix) => (ix as any).parsed.type == 'burn') as any)?.parsed
      ?.info?.amount;

    const user = programInstruction.accounts[5];
    const solAmount = getTransferAmountFromInnerInstructionsWithoutFee(innerInstruction);

    const fbond = programInstruction.accounts[0];
    const bondCollateralOrSolReceiver = programInstruction.accounts[7];

    const isRedeemedInThisTransaction = !!innerInstruction.instructions
      .filter((instruction) => (instruction as any).program === InnerProgramTypes.System)
      .filter((instruction: any) => instruction.parsed.type === InnerInstructionTypes.Transfer)
      .find((instruction) => (instruction as any).parsed.info.destination === bondCollateralOrSolReceiver.toBase58());
    // console.log('isRedeemedInThisTransaction: ', (isRedeemedInThisTransaction[0] as any).parsed);
    // .find((instruction: any) => instruction.parsed.);

    return [
      {
        timestamp: blockTime,
        signature: signature,
        bondEventType: BondEventType.Repay,

        fbond: fbond ? fbond.toBase58() : '',
        user: user ? user.toBase58() : '',

        solAmount: solAmount,
        bondsAmount: bondsAmount || solAmount / BOND_DECIMAL_DELTA,
      },
      ...(isRedeemedInThisTransaction
        ? [
            {
              timestamp: blockTime,
              signature: signature,
              bondEventType: BondEventType.Redeem,

              fbond: fbond ? fbond.toBase58() : '',
              user: bondCollateralOrSolReceiver ? bondCollateralOrSolReceiver.toBase58() : '',

              solAmount: solAmount,
              bondsAmount: bondsAmount || solAmount / BOND_DECIMAL_DELTA,
            },
          ]
        : []),
    ];
  },
  [BondInstruction.ExtractCollateralToLiquidate]: async ({
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
  }): Promise<BondEvent[]> => {
    // const solAmount = getTransferAmountFromInnerInstructions(innerInstruction);
    const bondEventType = BondEventType.Liquidating;
    const user = programInstruction.accounts[5];
    const fbond = programInstruction.accounts[0];
    return [
      {
        timestamp: blockTime,
        signature: signature,
        bondEventType: bondEventType,

        fbond: fbond ? fbond.toBase58() : '',
        user: user ? user.toBase58() : '',

        solAmount: null,
        bondsAmount: null,
      },
    ];
  },
  [BondInstruction.ExtractCollateralToLiquidatePnft]: async ({
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
  }): Promise<BondEvent[]> => {
    // const solAmount = getTransferAmountFromInnerInstructions(innerInstruction);
    const bondEventType = BondEventType.Liquidating;
    const user = programInstruction.accounts[5];
    const fbond = programInstruction.accounts[0];
    return [
      {
        timestamp: blockTime,
        signature: signature,
        bondEventType: bondEventType,

        fbond: fbond ? fbond.toBase58() : '',
        user: user ? user.toBase58() : '',

        solAmount: null,
        bondsAmount: null,
      },
    ];
  },
  [BondInstruction.DepositReturnedSolToLiquidatingBond]: async ({
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
  }): Promise<BondEvent[]> => {
    const bondEventType = BondEventType.Liquidated;
    const [user, fbond, solAmount] =
      programInstruction.accounts.length == 4
        ? [
            programInstruction.accounts[2],
            programInstruction.accounts[0],
            getTransferAmountFromInnerInstructions(innerInstruction),
          ]
        : getFbondAndUserAccountsFromInnerInstructionsDepositReturnedSol(innerInstruction);

    return [
      {
        timestamp: blockTime,
        signature: signature,
        bondEventType: bondEventType,

        fbond: fbond ? fbond.toBase58() : '',
        user: user ? user.toBase58() : '',

        solAmount: solAmount,
        bondsAmount: null,
      },
    ];
  },
  [BondInstruction.LiquidateFBond]: async ({
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
  }): Promise<BondEvent[]> => {
    const solAmount = getTransferAmountFromInnerInstructions(innerInstruction);
    const bondEventType = BondEventType.Liquidated;
    const user = programInstruction.accounts[5];
    const fbond = programInstruction.accounts[0];

    return [
      {
        timestamp: blockTime,
        signature: signature,
        bondEventType: bondEventType,

        fbond: fbond ? fbond.toBase58() : '',
        user: user ? user.toBase58() : '',

        solAmount: solAmount,
        bondsAmount: null,
      },
    ];
  },
  [BondInstruction.LiquidateReceivingNftFbondPnft]: async ({
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
  }): Promise<BondEvent[]> => {
    const solAmount = getTransferAmountFromInnerInstructions(innerInstruction);
    const bondEventType = BondEventType.Liquidated;
    const user = programInstruction.accounts[5];
    const fbond = programInstruction.accounts[0];

    return [
      {
        timestamp: blockTime,
        signature: signature,
        bondEventType: bondEventType,

        fbond: fbond ? fbond.toBase58() : '',
        user: user ? user.toBase58() : '',

        solAmount: solAmount,
        bondsAmount: null,
      },
    ];
  },

  [BondInstruction.CreateBondWithSingleCollateral]: async ({
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
  }): Promise<BondEvent[]> => {
    const bondEventType = BondEventType.Creation;
    const bondsAmount = (innerInstruction.instructions.find((ix) => (ix as any)?.parsed?.type == 'mintTo') as any)
      ?.parsed?.info?.amount;
    const user = programInstruction.accounts[3];
    const fbond = programInstruction.accounts[0];
    return [
      {
        timestamp: blockTime,
        signature: signature,
        bondEventType: bondEventType,

        fbond: fbond ? fbond.toBase58() : '',
        user: user ? user.toBase58() : '',

        solAmount: null,
        bondsAmount: bondsAmount,
      },
    ];
  },
  [BondInstruction.RepayFbondToTradeTransactions]: async ({
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
  }): Promise<BondEvent[]> => {
    const bondsAmount = (innerInstruction.instructions.find((ix) => (ix as any)?.parsed?.type == 'burn') as any)?.parsed
      ?.info?.amount;

    const user = programInstruction.accounts[8];
    const solAmount = getTransferAmountFromInnerInstructions(innerInstruction);

    const fbond = programInstruction.accounts[1];

    return [
      {
        timestamp: blockTime,
        signature: signature,
        bondEventType: BondEventType.Repay,

        fbond: fbond ? fbond.toBase58() : '',
        user: user ? user.toBase58() : '',

        solAmount: solAmount,
        bondsAmount: bondsAmount || solAmount / BOND_DECIMAL_DELTA,
      },
    ];
  },
  [BondInstruction.CreateBondAndSellToOffers]: async ({
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
  }): Promise<BondEvent[]> => {
    const bondsAmount = (innerInstruction.instructions.find((ix) => (ix as any)?.parsed?.type == 'mintTo') as any)
      ?.parsed?.info?.amount;

    const user = programInstruction.accounts[3];
    const fbond = programInstruction.accounts[0];

    return [
      {
        timestamp: blockTime,
        signature: signature,
        bondEventType: BondEventType.Creation,

        fbond: fbond ? fbond.toBase58() : '',
        user: user ? user.toBase58() : '',

        solAmount: null,
        bondsAmount: bondsAmount,
      },
    ];
  },
  [BondInstruction.RefinanceToBondOffersV2]: async ({
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
  }): Promise<BondEvent[]> => {
    const bondsAmountRepay = (innerInstruction.instructions.find((ix) => (ix as any)?.parsed?.type == 'burn') as any)
      ?.parsed?.info?.amount;

    const user = programInstruction.accounts[9];

    const fbondRepay = programInstruction.accounts[1];

    const bondsAmountCreate = (innerInstruction.instructions.find((ix) => (ix as any)?.parsed?.type == 'mintTo') as any)
      ?.parsed?.info?.amount;

    const fbondCreate = programInstruction.accounts[15];
    return [
      {
        timestamp: blockTime,
        signature: signature,
        bondEventType: BondEventType.Refinance,

        fbond: fbondRepay ? fbondRepay.toBase58() : '',
        user: user ? user.toBase58() : '',

        solAmount: 0,
        bondsAmount: bondsAmountRepay || 0,
      },
      {
        timestamp: blockTime,
        signature: signature,
        bondEventType: BondEventType.Creation,

        fbond: fbondCreate ? fbondCreate.toBase58() : '',
        user: user ? user.toBase58() : '',

        solAmount: null,
        bondsAmount: bondsAmountCreate,
      },
    ];
  },
  [BondInstruction.LiquidateBondOnAuction]: async ({
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
  }): Promise<BondEvent[]> => {
    const solAmount = getTransferAmountFromInnerInstructions(innerInstruction);
    const bondEventType = BondEventType.Liquidated;
    const user = programInstruction.accounts[7];
    const fbond = programInstruction.accounts[1];

    return [
      {
        timestamp: blockTime,
        signature: signature,
        bondEventType: bondEventType,

        fbond: fbond ? fbond.toBase58() : '',
        user: user ? user.toBase58() : '',

        solAmount: solAmount,
        bondsAmount: null,
      },
    ];
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

const getTransferAmountFromInnerInstructionsWithoutFee = (innerInstruction: web3.ParsedInnerInstruction) => {
  // console.log(
  //   'transfer ix: ',
  //   innerInstruction.instructions
  //     .filter((instruction) => (instruction as any).program === InnerProgramTypes.System)
  //     .filter((instruction: any) => instruction.parsed.type === InnerInstructionTypes.Transfer)
  //     .slice(0, 1)
  //     .map((ix: any) => ix.parsed.info),
  // );
  return innerInstruction.instructions
    .filter((instruction) => (instruction as any).program === InnerProgramTypes.System)
    .filter((instruction: any) => instruction.parsed.type === InnerInstructionTypes.Transfer)
    .slice(0, 1)
    .reduce((amount, instruction: any) => {
      return Math.max(amount + instruction.parsed.info.lamports);
    }, 0);
};

const getFbondAndUserAccountsFromInnerInstructionsDepositReturnedSol = (
  innerInstruction: web3.ParsedInnerInstruction,
) => {
  const filteredInstructions = innerInstruction.instructions
    .filter(
      (instruction) => (instruction as any).programId.toString() == '4tdmkuY6EStxbS6Y8s5ueznL3VPMSugrvQuDeAHGZhSt',
    )
    .filter((instruction) => (instruction as any).accounts.length == 4);
  const instruction = filteredInstructions[0] as any;
  const solAmount = getTransferAmountFromInnerInstructions(innerInstruction) / 2;
  return [instruction.accounts[2], instruction.accounts[0], solAmount];
};

enum InnerProgramTypes {
  System = 'system',
  SplToken = 'spl-token',
}

enum InnerInstructionTypes {
  Transfer = 'transfer',
}
