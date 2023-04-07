import { web3 } from '@project-serum/anchor';
import { anchorRawBNsAndPubkeysToNumsAndStrings } from '../../helpers';
import { returnAnchorProgram } from '../../helpers';
import {
  CollateralBox,
  FraktBond,
  HadoMarketRegistry,
  Validation,
  AuthorityAdapter,
  ClassicValidationWhitelist,
  HadoMarket,
  NftPairBox,
  NftSwapPair,
  NftValidationAdapter,
  AutocompoundDeposit,
} from '../../types';

export const getAllProgramAccounts = async (
  programId: web3.PublicKey,
  connection: web3.Connection,
): Promise<{
  fraktBonds: FraktBond[];
  collateralBoxes: CollateralBox[];
  hadoMarketRegistry: HadoMarketRegistry[];
  validations: Validation[];
  hadoMarkets: HadoMarket[];
  nftSwapPairs: NftSwapPair[];
  nftPairBoxes: NftPairBox[];
  classicValidationWhitelists: ClassicValidationWhitelist[];
  nftValidationAdapters: NftValidationAdapter[];
  authorityAdapters: AuthorityAdapter[];
  autocompoundDeposits: AutocompoundDeposit[];

  adapterWhitelists: any[];
  protocolSettingsV1: any[];
  protocolAdminMultisigs: any[];
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

  const validations = (await program.account.validation.all()).map((raw) =>
    anchorRawBNsAndPubkeysToNumsAndStrings(raw),
  );
  const hadoMarketsRaw = await program.account.hadoMarket.all();
  const hadoMarkets = hadoMarketsRaw.map((hadoMarketRaw) => anchorRawBNsAndPubkeysToNumsAndStrings(hadoMarketRaw));

  const nftSwapPairsRaw = await program.account.nftSwapPair.all();
  const nftSwapPairs = nftSwapPairsRaw.map((acc) => anchorRawBNsAndPubkeysToNumsAndStrings(acc));

  const classicValidationWhitelistsRaw = await program.account.classicValidationWhitelist.all();
  const classicValidationWhitelists = classicValidationWhitelistsRaw.map((acc) =>
    anchorRawBNsAndPubkeysToNumsAndStrings(acc),
  );

  const nftValidationAdaptersRaw = await program.account.nftValidationAdapter.all();
  const nftValidationAdapters = nftValidationAdaptersRaw.map((acc) => anchorRawBNsAndPubkeysToNumsAndStrings(acc));

  const authorityAdaptersRaw = await program.account.authorityAdapter.all();
  const authorityAdapters = authorityAdaptersRaw.map((acc) => anchorRawBNsAndPubkeysToNumsAndStrings(acc));

  const autocompoundDeposits = (await program.account.autocompoundDeposit.all([{ dataSize: 176 }])).map((raw) =>
    anchorRawBNsAndPubkeysToNumsAndStrings(raw),
  );

  const nftPairBoxesRaw = await program.account.nftPairBox.all();
  const nftPairBoxes = nftPairBoxesRaw.map((acc) => anchorRawBNsAndPubkeysToNumsAndStrings(acc));

  const adapterWhitelistsRaw = await program.account.adapterWhitelist.all();
  const adapterWhitelists = adapterWhitelistsRaw.map((acc) => anchorRawBNsAndPubkeysToNumsAndStrings(acc));

  const protocolSettingsV1Raws = await program.account.protocolSettingsV1.all();
  const protocolSettingsV1 = protocolSettingsV1Raws.map((acc) => anchorRawBNsAndPubkeysToNumsAndStrings(acc));

  const protocolAdminMultisigsRaw = await program.account.protocolAdminMultisig.all();
  const protocolAdminMultisigs = protocolAdminMultisigsRaw.map((acc) => anchorRawBNsAndPubkeysToNumsAndStrings(acc));

  return {
    fraktBonds,
    collateralBoxes,
    hadoMarketRegistry,
    validations,
    hadoMarkets,
    nftSwapPairs,
    nftPairBoxes,
    classicValidationWhitelists,
    nftValidationAdapters,
    authorityAdapters,
    autocompoundDeposits,

    adapterWhitelists,
    protocolSettingsV1,
    protocolAdminMultisigs,
  };
};
