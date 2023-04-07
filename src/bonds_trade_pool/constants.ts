import { web3 } from '@project-serum/anchor';
export const ORACLE_PREFIX = 'oracle';
export const ENCODER = new TextEncoder();
export const EMPTY_PUBKEY = new web3.PublicKey('11111111111111111111111111111111');
export const ADMIN_TRADE_POOL_PUBKEY = new web3.PublicKey('FTEnjqsWCCFHVLyt2Tq2cPRjxHXRjbUQoLnkKBuymNBm');
export const TRADE_SETTINGS_PREFIX = 'trade_settings';
export const INVESTMENT_PREFIX = 'investment';
export const TRADE_PREFIX = 'trade';
export const FEE_PREFIX = 'fee_vault';
export const VALIDATION_PREFIX = 'validation';
export const BOND_PROOGRAM_AUTHORITY_PREFIX = 'bond_program_authority';
export const RETURN_FUNDS_OWNER_PREFIX = 'return_funds_owner';

export const SOL_FUNDS_PREFIX = 'sol_funds_vault';

export const NFTS_OWNER_PREFIX = 'nfts_owner';