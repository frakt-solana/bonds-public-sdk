import { web3 } from '@project-serum/anchor';
import { anchorRawBNsAndPubkeysToNumsAndStrings } from '../../helpers';
import { returnAnchorProgram } from '../../helpers';
import { FraktMarket, OracleFloor, WhitelistEntry } from '../../types';
// import { anchorRawBNsAndPubkeysToNumsAndStrings, returnAnchorProgram } from '../../helpers';

export const getAllProgramAccounts = async (
  programId: web3.PublicKey,
  connection: web3.Connection,
): Promise<{
  fraktMarkets: FraktMarket[];
  whitelistEntries: WhitelistEntry[];
  oracleFloors: OracleFloor[];
}> => {
  const program = await returnAnchorProgram(programId, connection);

  const fraktMarkets = (await program.account.fraktMarket.all()).map((raw) =>
    anchorRawBNsAndPubkeysToNumsAndStrings(raw),
  );

  const whitelistEntries = (
    await program.account.whitelistEntry.all([
      {
        dataSize: 105,
      },
    ])
  ).map((raw) => anchorRawBNsAndPubkeysToNumsAndStrings(raw));

  const oracleFloors = (await program.account.oracleFloor.all()).map((raw) =>
    anchorRawBNsAndPubkeysToNumsAndStrings(raw),
  );

  return {
    fraktMarkets,
    whitelistEntries,
    oracleFloors,
  };
};
