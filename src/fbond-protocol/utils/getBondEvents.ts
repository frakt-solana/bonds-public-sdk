import { web3 } from '@project-serum/anchor';
import { BondEventType } from '../types';
import { BOND_DECIMAL_DELTA } from './cartManager';

export const getBondEvents = async ({
  programId,
  //   fromThisSignature,
  eventslimit,
  untilThisSignature,
  connection,
}: {
  programId: web3.PublicKey;
  //   fromThisSignature?: string;
  eventslimit?: number;

  untilThisSignature?: string;
  connection: web3.Connection;
}) => {
  const LIMIT = !eventslimit || eventslimit > 100 ? 100 : eventslimit;
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
  while (newSignatureInfosLatestToPast.length === LIMIT && (!eventslimit || allSignaturesInfos.length >= eventslimit)) {
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
      programInstruction: currentProgramInstruction,
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
//   log === BondInstruction.LiquidateFBond ||
//   log === BondInstruction.RedeemFbonds;

// const isBondInstructionLog = (log: string) =>
//     log === BondInstruction.BuyNftFromPair ||
//     log === BondInstruction.SellNftToTokenToNftPair ||
//     log === BondInstruction.SellNftToLiquidityPair ||
//     log === BondInstruction.ValidateAndSellNftToTokenToNftPair ||
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
}

enum BondInstruction {
  CreateBondWithSingleCollateral = 'Program log: Instruction: CreateBondWithSingleCollateral',

  RepayFbond = 'Program log: Instruction: RepayFbond',
  ExtractCollateralToLiquidate = 'Program log: Instruction: ExtractCollateralToLiquidate',

  CreateBondWithSingleCollateralPnft = 'Program log: Instruction: CreateBondWithSingleCollateralPnft',
  ExtractCollateralToLiquidatePnft = 'Program log: Instruction: ExtractCollateralToLiquidatePnft',
  LiquidateReceivingNftFbondPnft = 'Program log: Instruction: LiquidateReceivingNftFbondPnft',

  DepositReturnedSolToLiquidatingBond = 'Program log: Instruction: DepositReturnedSolToLiquidatingBond',
  LiquidateFBond = 'Program log: Instruction: LiquidateFBond',
  RedeemAutocompoundAndAutoreceiveLiquidatedNft = 'Program log: Instruction: RedeemAutocompoundAndAutoreceiveLiquidatedNft',

  RedeemFbonds = 'Program log: Instruction: RedeemFbonds',
  RedeemFbondsFromAutocompoundToUser = 'Program log: Instruction: RedeemFbondsFromAutocompoundToUser',
  RedeemFbondsAutoreceiveSol = 'Program log: Instruction: RedeemFbondsAutoreceiveSol',
  RedeemFbondsFromAutocompoundToPair = 'Program log: Instruction: RedeemFbondsFromAutocompoundToPair',
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
    const solAmount = getTransferAmountFromInnerInstructions(innerInstruction);
    const bondsAmount = (innerInstruction.instructions.find((ix) => (ix as any).parsed.type == 'burn') as any)?.parsed
      ?.info?.amount;

    const user = programInstruction.accounts[5];
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
  [BondInstruction.RedeemAutocompoundAndAutoreceiveLiquidatedNft]: async ({
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
    const user = programInstruction.accounts[9];
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
  [BondInstruction.RedeemFbonds]: async ({
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
    const bondEventType = BondEventType.Redeem;
    const user = programInstruction.accounts[5];
    const fbond = programInstruction.accounts[0];
    const bondsAmount = (innerInstruction.instructions.find((ix) => (ix as any).parsed?.type == 'burn') as any)?.parsed
      ?.info?.amount;
    return [
      {
        timestamp: blockTime,
        signature: signature,
        bondEventType: bondEventType,

        fbond: fbond ? fbond.toBase58() : '',
        user: user ? user.toBase58() : '',

        solAmount: solAmount,
        bondsAmount: bondsAmount,
      },
    ];
  },
  [BondInstruction.RedeemFbondsFromAutocompoundToUser]: async ({
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
    const bondEventType = BondEventType.Redeem;
    const user = programInstruction.accounts[7];
    const fbond = programInstruction.accounts[0];
    const bondsAmount = (innerInstruction.instructions.find((ix) => (ix as any).parsed?.type == 'burn') as any)?.parsed
      ?.info?.amount;
    return [
      {
        timestamp: blockTime,
        signature: signature,
        bondEventType: bondEventType,

        fbond: fbond ? fbond.toBase58() : '',
        user: user ? user.toBase58() : '',

        solAmount: solAmount,
        bondsAmount: bondsAmount,
      },
    ];
  },
  [BondInstruction.RedeemFbondsFromAutocompoundToPair]: async ({
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
    const bondEventType = BondEventType.Redeem;
    const user = programInstruction.accounts[7];
    const fbond = programInstruction.accounts[0];
    const pair = programInstruction.accounts[5];

    const bondsAmount = (innerInstruction.instructions.find((ix) => (ix as any).parsed?.type == 'burn') as any)?.parsed
      ?.info?.amount;
    return [
      {
        timestamp: blockTime,
        signature: signature,
        bondEventType: bondEventType,

        fbond: fbond ? fbond.toBase58() : '',
        user: user ? user.toBase58() : '',
        pair: pair ? pair.toBase58() : '',

        solAmount: solAmount,
        bondsAmount: bondsAmount,
      },
    ];
  },
  [BondInstruction.RedeemFbondsAutoreceiveSol]: async ({
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
    const bondEventType = BondEventType.Redeem;
    const user = programInstruction.accounts[8];
    const fbond = programInstruction.accounts[0];
    const bondsAmount = (innerInstruction.instructions.find((ix) => (ix as any).parsed?.type == 'burn') as any)?.parsed
      ?.info?.amount;
    return [
      {
        timestamp: blockTime,
        signature: signature,
        bondEventType: bondEventType,

        fbond: fbond ? fbond.toBase58() : '',
        user: user ? user.toBase58() : '',

        solAmount: solAmount,
        bondsAmount: bondsAmount,
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
  [BondInstruction.CreateBondWithSingleCollateralPnft]: async ({
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
};

const getTransferAmountFromInnerInstructions = (innerInstruction: web3.ParsedInnerInstruction) => {
  return innerInstruction.instructions
    .filter((instruction) => (instruction as any).program === InnerProgramTypes.System)
    .filter((instruction: any) => instruction.parsed.type === InnerInstructionTypes.Transfer)
    .reduce((amount, instruction: any) => {
      return amount + instruction.parsed.info.lamports;
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
  return [instruction.accounts[0], instruction.accounts[2], solAmount];
};

enum InnerProgramTypes {
  System = 'system',
  SplToken = 'spl-token',
}

enum InnerInstructionTypes {
  Transfer = 'transfer',
}
