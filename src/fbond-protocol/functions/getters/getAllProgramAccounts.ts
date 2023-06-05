import { web3 } from '@project-serum/anchor';
import { anchorRawBNsAndPubkeysToNumsAndStrings } from '../../helpers';
import { returnAnchorProgram } from '../../helpers';
import {
  CollateralBox,
  FraktBond,
  HadoMarketRegistry,
  Validation,
  AuthorityAdapter,
  HadoMarket,
  NftPairBox,
  NftSwapPair,
  NftValidationAdapter,
  AutocompoundDeposit,
  BondTradeTransactionV2,
  BondOfferV2,
} from '../../types';

export const getAllProgramAccounts = async (
  programId: web3.PublicKey,
  connection: web3.Connection,
): Promise<{
  bondTradeTransactionsV2: BondTradeTransactionV2[];
  bondOffersV2: BondOfferV2[];
  fraktBonds: FraktBond[];
  collateralBoxes: CollateralBox[];
  hadoMarketRegistry: HadoMarketRegistry[];
  hadoMarkets: HadoMarket[];
}> => {
  const program = await returnAnchorProgram(programId, connection);

  const fraktBondsRaw = await program.account.fraktBond.all();
  const fraktBonds = fraktBondsRaw.map((fraktBondRaw) => anchorRawBNsAndPubkeysToNumsAndStrings(fraktBondRaw));

  const collateralBoxesRaw = await program.account.collateralBox.all();
  const collateralBoxes = collateralBoxesRaw.map((collateralBoxRaw) =>
    anchorRawBNsAndPubkeysToNumsAndStrings(collateralBoxRaw),
  );

  const hadoMarketRegistry = (await program.account.hadoMarketRegistry.all()).map((raw) =>
    anchorRawBNsAndPubkeysToNumsAndStrings(raw),
  );

  const hadoMarketsRaw = await program.account.hadoMarket.all();
  const hadoMarkets = hadoMarketsRaw.map((hadoMarketRaw) => anchorRawBNsAndPubkeysToNumsAndStrings(hadoMarketRaw));

  const bondOffersV2Raw = await program.account.bondOfferV2.all();
  const bondOffersV2 = bondOffersV2Raw.map((acc) => anchorRawBNsAndPubkeysToNumsAndStrings(acc));

  const bondTradeTransactionV2Raw = await program.account.bondTradeTransactionV2.all();
  const bondTradeTransactionsV2: BondTradeTransactionV2[] = (
    bondTradeTransactionV2Raw.map((acc) => anchorRawBNsAndPubkeysToNumsAndStrings(acc)) as any
  ).filter((tradetxn) => tradetxn.publicKey !== 'CmFdBaFUGPvsV8Cs5AGRVwLFav3c2ptzEeXvhwP9UD9m');
  return {
    bondTradeTransactionsV2,
    bondOffersV2,
    fraktBonds,
    collateralBoxes,
    hadoMarketRegistry,
    hadoMarkets,
  };
};
