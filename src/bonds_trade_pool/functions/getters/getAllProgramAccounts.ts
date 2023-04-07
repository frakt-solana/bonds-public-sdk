import { web3 } from '@project-serum/anchor';
import { anchorRawBNsAndPubkeysToNumsAndStrings, returnAnchorProgram } from '../../helpers';
import {
  BondsTradePool,
  TradeSettings,
  Investment,
  Trade,
} from '../../types';

export const getAllProgramAccounts = async (
  programId: web3.PublicKey,
  connection: web3.Connection,
): Promise<{
  bondsTradePools: BondsTradePool[];
  tradeSettingsAccounts: TradeSettings[];
  investments: Investment[];
  trades: Trade[];
}> => {
  const program = await returnAnchorProgram(programId, connection);

  const bondsTradePoolsRaw = await program.account.bondsTradePool.all();
  const bondsTradePools = bondsTradePoolsRaw.map((bondsTradePoolRaw) => anchorRawBNsAndPubkeysToNumsAndStrings(bondsTradePoolRaw));

  const tradeSettingsAccountsRaw = await program.account.tradeSettings.all();
  const tradeSettingsAccounts = tradeSettingsAccountsRaw.map((acc) => anchorRawBNsAndPubkeysToNumsAndStrings(acc));

  const investmentsRaw = await program.account.investment.all();
  const investments = investmentsRaw.map((acc) => anchorRawBNsAndPubkeysToNumsAndStrings(acc));

  // const tradesRaw = await program.account.trade.all();
  // const trades = tradesRaw.map((acc) => anchorRawBNsAndPubkeysToNumsAndStrings(acc));

  const trades = (await program.account.trade.all()).map((raw) =>
    anchorRawBNsAndPubkeysToNumsAndStrings(raw),
  );

  return {
    bondsTradePools,
    tradeSettingsAccounts,
    investments,
    trades,
  };
};
