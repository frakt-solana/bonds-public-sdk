export interface FraktBond {
  fraktBondState: FraktBondState;
  bondProgramAuthoritySeed: number;
  collateralBoxesQuantity: number;
  returnTokenMint: string;
  returnTokenAccount: string;
  amountToReturn: number;
  actualReturnedAmount: number;
  returnFundsOwnerSeed: number;
  fbondTokenMint: string;
  fbondTokenSupply: number;
  activatedAt: number;
  liquidatingAt: number;
  fbondIssuer: string;
  bondCollateralOrSolReceiver: string;

  publicKey: string;
}

export enum FraktBondState {
  Initialized = 'initialized',
  Active = 'active',
  Repaid = 'repaid',
  Liquidating = 'liquidating',
  Liquidated = 'liquidated',
}

export interface CollateralBox {
  fbond: string;
  collateralBoxType: CollateralBoxType;
  collateralTokenMint: string;
  collateralTokenAccount: string;
  collateralAmount: number;

  publicKey: string;
}

export enum CollateralBoxType {
  Escrow = 'escrow',
  Escrowless = 'escrowless',
}

export interface Validation {
  pair: string;
  user: string;
  loanToValueFilter: number;
  durationFilter: number;
  maxReturnAmountFilter: number;
  bondFeatures: BondFeatures;
}

export enum BondFeatures {
  None = 'none',
  Autocompound = 'autocompound',
  ReceiveNftOnLiquidation = 'receiveNftOnLiquidation',
  AutoreceiveSol = 'autoreceiveSol',
  AutoCompoundAndReceiveNft = 'autoCompoundAndReceiveNft',
  AutoReceiveAndReceiveNft = 'autoReceiveAndReceiveNft',
}

export interface HadoMarketRegistry {
  hadoMarket: string;
  fraktMarket: string;
}

export enum BondingCurveType {
  Linear = 'linear',
  Exponential = 'exponential',
}

export enum PairType {
  TokenForNFT = 'tokenForNft',
  NftForToken = 'nftForToken',
  LiquidityProvision = 'liquidityProvision',
}

export enum NftValidationWhitelistType {
  Creator = 'creator',
  Nft = 'nft',
  MerkleTree = 'merkleTree',
  CollectionId = 'collectionId',
}

export enum OrderType {
  Buy = 'buy',
  Sell = 'sell',
}

export interface HadoMarket {
  marketAuthority: string;
  marketState: MarketState;
  marketTrustType: MarketTrustType;
  pairValidationType: PairValidationType;
  validationAdapterProgram: string;
  minBidCap: number;
  marketDecimals: number;
  pairTokenType: PairTokenType;
  pairTokenMint: string;
  publicKey: string;
}

export enum MarketState {
  Initializing = 'initializing',
  Available = 'available',
}

export enum MarketTrustType {
  Unverified = 'unverified',
  Verified = 'verified',
}

export enum PairValidationType {
  ClassicValidation = 'classicValidation',
  CustomValidation = 'customValidation',
}

export enum PairTokenType {
  NativeSol = 'nativeSol',
  Spl = 'spl',
}

export interface ClassicValidationWhitelist {
  hadoMarket: string;
  pair: string;
  whitelistType: WhitelistType;
  whitelistedAddress: string;
  root: Buffer;

  publicKey: string;
}

export enum WhitelistType {
  Nft = 'nft',
  Creator = 'creator',
}

export interface NftSwapPair {
  hadoMarket: string;
  pairType: PairType;
  pairState: PairState;
  pairAuthorityType: PairAuthorityType;
  pairAuthorityAdapterProgram: string;
  lpTokensMint: string;
  lpTokensInCirculation: number;
  bondingCurve: BondingCurve;
  baseSpotPrice: number;
  fee: number;
  mathCounter: number;
  currentSpotPrice: number;
  bidCap: number;
  bidSettlement: number;
  edgeSettlement: number;
  feeTokenAccount: string;
  feeVaultSeed: number;
  solOrTokenFeeAmount: number;
  fundsTokenAccount: string;
  fundsSolVaultSeed: number;
  fundsSolOrTokenBalance: number;
  initialFundsSolOrTokenBalance: number;
  buyOrdersQuantity: number;
  nftsSeed: number;
  sellOrdersCount: number;
  lastTransactedAt: number;
  concentrationIndex: number;

  assetReceiver: string;
  publicKey: string;
}

export enum PairState {
  Initializing = 'initializing',
  OnMarketVirtual = 'onMarketVirtual',
  OnMarketTokenized = 'onMarketTokenized',
  Frozen = 'frozen',
}

export enum PairAuthorityType {
  ClassicAuthority = 'classicAuthority',
  CustomAuthority = 'customAuthority',
}

export interface BondingCurve {
  delta: number;
  bondingType: BondingCurveType;
}

// #[repr(C)]
// #[derive(Clone, Copy, AnchorDeserialize, AnchorSerialize)]
// pub struct BondingCurve {
//     pub delta: u64,
//     pub bonding_type: BondingCurveType,
// }

export interface AuthorityAdapter {
  pair: string;
  authorityAdapterProgram: string;
  authorityOwner: string;
  authorityType: AuthorityType;
  expiringAt: number;
  authorityState: AuthorityState;

  publicKey: string;
}

export enum AuthorityType {
  Persistent = 'persistent',
  OneTime = 'oneTime',
}

export enum AuthorityState {
  Active = 'active',
  Used = 'used',
  Expired = 'expired',
  Revoked = 'revoked',
}

export enum ScopeType {
  Market = 'market',
  Pair = 'pair',
}

export interface NftValidationAdapter {
  hadoMarket: string;
  scopeType: ScopeType;
  pair: string;
  nftValidationProgram: string;
  nftValidationWhitelistType: WhitelistType;
  whitelistedAddress: string;
  nftValidationDurationType: NftValidationDurationType;
  validUntil: number;
  root: Buffer;
  publicKey: string;
}

export enum NftValidationDurationType {
  Finite = 'finite',
  Infinite = 'infinite',
}

export interface NftPairBox {
  pair: string;
  nftMint: string;
  nftMetadata: string;
  nftBoxType: NftBoxType;
  vault_token_account: string;
  active_tokens_amount: number;
  status: NftBoxState;
}

export enum NftBoxType {
  Escrow = 'escrow',
  Escrowless = 'escrowless',
}

export enum NftBoxState {
  NotActive = 'notActive',
  Active = 'active',
}

export interface AutocompoundDeposit {
  fraktBondState: AutocompoundDepositState;
  pair: string;
  user: string;
  amountOfBonds: number;
  depositedAt: number;
  autocompoundType: AutocompoundType;
  fbondTokenMint: string;
  collateralTokenMint: string;
  solAmount: number;
  publicKey: string;
}

export enum AutocompoundDepositState {
  NotActive = 'notActive',
  Active = 'active',
}

export enum AutocompoundType {
  Autocompound = 'autocompound',
  AutoreceiveSol = 'autoreceiveSol',
  AutocompoundAndReceiveNft = 'autocompoundAndReceiveNft'
}

export enum BondEventType {
  Creation = 'creation',
  Repay = 'repay',
  Liquidating = 'liquidating',
  Liquidated = 'liquidated',
  Redeem = 'redeem',
}
