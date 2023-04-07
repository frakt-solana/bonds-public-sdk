import { Program, AnchorProvider, web3, BN, utils, Idl } from '@project-serum/anchor';

import { FraktMarketRegistry, IDL } from './idl/frakt_market_registry';

import { createFakeWallet } from '../common';
// import { BASE_POINTS, EDITION_PREFIX, METADATA_PREFIX, METADATA_PROGRAM_PUBKEY } from './constants';

type ReturnAnchorProgram = (programId: web3.PublicKey, connection: web3.Connection) => Program<FraktMarketRegistry>;
export const returnAnchorProgram: ReturnAnchorProgram = (programId, connection) =>
  new Program<FraktMarketRegistry>(
    IDL as any,
    programId,
    new AnchorProvider(connection, createFakeWallet(), AnchorProvider.defaultOptions()),
  );

export const anchorRawBNsAndPubkeysToNumsAndStrings = (rawAccount: any) => {
  const copyRawAccount = { ...rawAccount };
  const newAccount = parseRawAccount(rawAccount.account);
  return { ...newAccount, publicKey: copyRawAccount.publicKey.toBase58() };
};

const parseRawAccount = (rawAccount: any) => {
  const copyRawAccount = { ...rawAccount };
  for (let key in copyRawAccount) {
    if (copyRawAccount[key] === null || copyRawAccount[key] === undefined) continue;
    if (copyRawAccount[key].toNumber) {
      copyRawAccount[key] = copyRawAccount[key].toNumber();
    }

    if (copyRawAccount[key].toBase58) {
      copyRawAccount[key] = copyRawAccount[key].toBase58();
    }
    if (typeof copyRawAccount[key] === 'object' && Object.keys(copyRawAccount[key]).length === 1) {
      copyRawAccount[key] = Object.keys(copyRawAccount[key])[0];
    } else if (typeof copyRawAccount[key] === 'object') {
      copyRawAccount[key] = parseRawAccount(copyRawAccount[key]);
    }
  }
  return copyRawAccount;
};

export const enumToAnchorEnum = (anyEnum: any) => ({ [anyEnum]: {} });
