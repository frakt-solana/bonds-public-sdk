export type FraktMarketRegistry = {
  version: '0.1.0';
  name: 'frakt_market_registry';
  instructions: [
    {
      name: 'initializeFraktMarket';
      accounts: [
        {
          name: 'fraktMarket';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'user';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'admin';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [];
      returns: undefined;
    },
    {
      name: 'addWhitelistToMarket';
      accounts: [
        {
          name: 'fraktMarket';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'user';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'whitelistEntry';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'whitelistedAddress';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'whitelistType';
          type: {
            defined: 'NftValidationWhitelistType';
          };
        },
        {
          name: 'root';
          type: {
            array: ['u8', 32];
          };
        },
      ];
      returns: undefined;
    },
    {
      name: 'removeWhitelistFromMarket';
      accounts: [
        {
          name: 'fraktMarket';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'user';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'whitelistEntry';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'whitelistedAddress';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [];
      returns: undefined;
    },
    {
      name: 'activateFraktMarket';
      accounts: [
        {
          name: 'fraktMarket';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'user';
          isMut: true;
          isSigner: true;
        },
      ];
      args: [];
      returns: undefined;
    },
    {
      name: 'initializeOracle';
      accounts: [
        {
          name: 'fraktMarket';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'user';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'oracle';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'oracleAuthority';
          type: 'publicKey';
        },
        {
          name: 'oracleInfo';
          type: 'publicKey';
        },
        {
          name: 'floor';
          type: 'u64';
        },
      ];
      returns: undefined;
    },
    {
      name: 'setOracleAuthority';
      accounts: [
        {
          name: 'fraktMarket';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'user';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'oracle';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'newOracleAuthority';
          type: 'publicKey';
        },
      ];
      returns: undefined;
    },
    {
      name: 'setOracleFloor';
      accounts: [
        {
          name: 'fraktMarket';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'user';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'oracle';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'rent';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'newFloor';
          type: 'u64';
        },
      ];
      returns: undefined;
    },
  ];
  accounts: [
    {
      name: 'fraktMarket';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'authority';
            type: 'publicKey';
          },
          {
            name: 'whitelistQuantity';
            type: 'u64';
          },
          {
            name: 'state';
            type: {
              defined: 'FraktMarketState';
            };
          },
        ];
      };
    },
    {
      name: 'oracleFloor';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'fraktMarket';
            type: 'publicKey';
          },
          {
            name: 'oracleAuthority';
            type: 'publicKey';
          },
          {
            name: 'oracleInfo';
            type: 'publicKey';
          },
          {
            name: 'floor';
            type: 'u64';
          },
          {
            name: 'lastUpdatedAt';
            type: 'u64';
          },
        ];
      };
    },
    {
      name: 'whitelistEntry';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'fraktMarket';
            type: 'publicKey';
          },
          {
            name: 'whitelistType';
            type: {
              defined: 'NftValidationWhitelistType';
            };
          },
          {
            name: 'whitelistedAddress';
            type: 'publicKey';
          },
          {
            name: 'root';
            type: {
              array: ['u8', 32];
            };
          },
        ];
      };
    },
  ];
  types: [
    {
      name: 'FraktMarketState';
      type: {
        kind: 'enum';
        variants: [
          {
            name: 'Initialized';
          },
          {
            name: 'Active';
          },
        ];
      };
    },
    {
      name: 'NftValidationWhitelistType';
      type: {
        kind: 'enum';
        variants: [
          {
            name: 'Creator';
          },
          {
            name: 'Nft';
          },
          {
            name: 'MerkleTree';
          },
          {
            name: 'CollectionId';
          },
        ];
      };
    },
  ];
  errors: [
    {
      code: 6000;
      name: 'MetadataDoesntExist';
      msg: 'MetadataDoesntExist';
    },
    {
      code: 6001;
      name: 'DerivedKeyInvalid';
      msg: 'DerivedKeyInvalid';
    },
    {
      code: 6002;
      name: 'InvalidCollectionDetails';
      msg: 'InvalidCollectionDetails';
    },
    {
      code: 6003;
      name: 'InvalidCollection';
      msg: 'InvalidCollection';
    },
    {
      code: 6004;
      name: 'InvalidCollectionMint';
      msg: 'InvalidCollectionMint';
    },
    {
      code: 6005;
      name: 'NftNotVerified';
      msg: 'NftNotVerified';
    },
    {
      code: 6006;
      name: 'InvalidOwner';
      msg: 'InvalidOwner';
    },
    {
      code: 6007;
      name: 'InvalidDelta';
      msg: 'InvalidDelta';
    },
    {
      code: 6008;
      name: 'InvalidFee';
      msg: 'InvalidFee';
    },
    {
      code: 6009;
      name: 'InvalidPairType';
      msg: 'InvalidPairType';
    },
    {
      code: 6010;
      name: 'NotEnoughInTokenAccount';
      msg: 'NotEnoughInTokenAccount';
    },
    {
      code: 6011;
      name: 'InvalidMint';
      msg: 'InvalidMint';
    },
    {
      code: 6012;
      name: 'InvalidSolVault';
      msg: 'InvalidSolVault';
    },
    {
      code: 6013;
      name: 'InvalidFundingAmount';
      msg: 'InvalidFundingAmount';
    },
    {
      code: 6014;
      name: 'NotEnoughLamports';
      msg: 'NotEnoughLamports';
    },
    {
      code: 6015;
      name: 'InvalidJpegOwner';
      msg: 'InvalidJpegOwner';
    },
    {
      code: 6016;
      name: 'InvalidTokenAccount';
      msg: 'InvalidTokenAccount';
    },
    {
      code: 6017;
      name: 'InvalidPayer';
      msg: 'InvalidPayer';
    },
    {
      code: 6018;
      name: 'ShouldBeActive';
      msg: 'ShouldBeActive';
    },
    {
      code: 6019;
      name: 'CantMakeZeroOrders';
      msg: "Can't make 0 orders";
    },
    {
      code: 6020;
      name: 'OnlyClassicAuthority';
      msg: 'OnlyClassicAuthority';
    },
    {
      code: 6021;
      name: 'NotValidAuthorityAdapter';
      msg: 'NotValidAuthorityAdapter';
    },
    {
      code: 6022;
      name: 'UserDoesntHaveAuthority';
      msg: 'UserDoesntHaveAuthority';
    },
    {
      code: 6023;
      name: 'WrongSeed';
      msg: 'WrongSeed';
    },
    {
      code: 6024;
      name: 'CanDepositSolOnlyToTokenToNft';
      msg: 'CanDepositSolOnlyToTokenToNft';
    },
    {
      code: 6025;
      name: 'MaxAmountOfOrdersSucceeded';
      msg: 'MaxAmountOfOrdersSucceeded';
    },
    {
      code: 6026;
      name: 'CanDepositNftOnlyToNftToToken';
      msg: 'CanDepositNftOnlyToNftToToken';
    },
    {
      code: 6027;
      name: 'TokenAccountDoesntContainNft';
      msg: 'TokenAccountDoesntContainNft';
    },
    {
      code: 6028;
      name: 'MarketAuthorityIncorrect';
      msg: 'MarketAuthorityIncorrect';
    },
    {
      code: 6029;
      name: 'CanAddWhitelistOnlyToInitializingMarket';
      msg: 'CanAddWhitelistOnlyToInitializingMarket';
    },
    {
      code: 6030;
      name: 'CanPutPairsOnlyToAvailableMarkets';
      msg: 'CanPutPairsOnlyToAvailableMarkets';
    },
    {
      code: 6031;
      name: 'PairAndNftValidationMarketDoesntMatch';
      msg: 'PairAndNftValidationMarketDoesntMatch';
    },
    {
      code: 6032;
      name: 'OnlyMarketScopeSupported';
      msg: 'OnlyMarketScopeSupported';
    },
    {
      code: 6033;
      name: 'NotWhitelistedNftForThisMarket';
      msg: 'NotWhitelistedNftForThisMarket';
    },
    {
      code: 6034;
      name: 'CanDepositOnlyToLiquidityProvision';
      msg: 'CanDepositOnlyToLiquidityProvision';
    },
    {
      code: 6035;
      name: 'NftBoxDoesntMatchPair';
      msg: 'NftBoxDoesntMatchPair';
    },
    {
      code: 6036;
      name: 'NftBoxShouldBeActive';
      msg: 'NftBoxShouldBeActive';
    },
    {
      code: 6037;
      name: 'NftBoxDoesntMatchMint';
      msg: 'NftBoxDoesntMatchMint';
    },
    {
      code: 6038;
      name: 'CantBuyNftFromTokenForNft';
      msg: 'CantBuyNftFromTokenForNft';
    },
    {
      code: 6039;
      name: 'OnlyTokenForNftIsEligibleForThisSell';
      msg: 'OnlyTokenForNftIsEligibleForThisSell';
    },
    {
      code: 6040;
      name: 'NoBuyOrdersOnThisPair';
      msg: 'NoBuyOrdersOnThisPair';
    },
    {
      code: 6041;
      name: 'OnlyLiquidityProvisionIsEligibleForThisSell';
      msg: 'OnlyLiquidityProvisionIsEligibleForThisSell';
    },
    {
      code: 6042;
      name: 'OnlyTokenForNftIsEligibleForThisWithdrawal';
      msg: 'OnlyTokenForNftIsEligibleForThisWithdrawal';
    },
    {
      code: 6043;
      name: 'OnlyNftForTokenIsEligibleForThisWithdrawal';
      msg: 'OnlyNftForTokenIsEligibleForThisWithdrawal';
    },
    {
      code: 6044;
      name: 'OnlyLiquidityProvisionIsEligibleForThisWithdrawal';
      msg: 'OnlyLiquidityProvisionIsEligibleForThisWithdrawal';
    },
    {
      code: 6045;
      name: 'InstructionIsNotSupported';
      msg: 'InstructionIsNotSupported';
    },
    {
      code: 6046;
      name: 'CanTradeOnlyWithPairsOnMarket';
      msg: 'CanTradeOnlyWithPairsOnMarket';
    },
    {
      code: 6047;
      name: 'NoLiquidityFeesToWithdraw';
      msg: 'NoLiquidityFeesToWithdraw';
    },
    {
      code: 6048;
      name: 'MaxAmountToPayExceeded';
      msg: 'MaxAmountToPayExceeded';
    },
    {
      code: 6049;
      name: 'GettingLessThanMinAmountToGet';
      msg: 'GettingLessThanMinAmountToGet';
    },
    {
      code: 6050;
      name: 'UserDoesntHaveHadomarketAuthority';
      msg: 'UserDoesntHaveHadomarketAuthority';
    },
    {
      code: 6051;
      name: 'HadomarketAlreadyFinished';
      msg: 'HadomarketAlreadyFinished';
    },
    {
      code: 6052;
      name: 'CanDepositLiqudityOnlyToVirtualOrInitializingPairs';
      msg: 'CanDepositLiqudityOnlyToVirtualOrInitializingPairs';
    },
    {
      code: 6053;
      name: 'CanModifyOnlyToVirtualOrInitializingPairs';
      msg: 'CanModifyOnlyToVirtualOrInitializingPairs';
    },
    {
      code: 6054;
      name: 'LiquidityProvisionOrderPairDoesntMatch';
      msg: 'LiquidityProvisionOrderPairDoesntMatch';
    },
    {
      code: 6055;
      name: 'OnlyVirtualLpOrdersCanBeWithdrawnByThisFunction';
      msg: 'OnlyVirtualLpOrdersCanBeWithdrawnByThisFunction';
    },
    {
      code: 6056;
      name: 'OnlyVirtualOrTokenizedLpOrdersCanBeReplacedByThisFunction';
      msg: 'OnlyVirtualOrTokenizedLpOrdersCanBeReplacedByThisFunction';
    },
    {
      code: 6057;
      name: 'LiquidityProvisionOrderNotEdge';
      msg: 'LiquidityProvisionOrderNotEdge';
    },
    {
      code: 6058;
      name: 'NftPairBoxNotParsingFromRemaining';
      msg: 'NftPairBoxNotParsingFromRemaining';
    },
    {
      code: 6059;
      name: 'VaultNftTokenAccountNotParsingFromRemaining';
      msg: 'VaultNftTokenAccountNotParsingFromRemaining';
    },
    {
      code: 6060;
      name: 'UserTokenAccountNotParsingFromRemaining';
      msg: 'UserTokenAccountNotParsingFromRemaining';
    },
    {
      code: 6061;
      name: 'WithdrawingOnlyAtLeastOneBuyAndOneSellPairs';
      msg: 'WithdrawingOnlyAtLeastOneBuyAndOneSellPairs';
    },
    {
      code: 6062;
      name: 'VaultDoesntMatchBox';
      msg: 'VaultDoesntMatchBox';
    },
    {
      code: 6063;
      name: 'WithdrawingOnlyBuyOrdersPairs';
      msg: 'WithdrawingOnlyBuyOrdersPairs';
    },
    {
      code: 6064;
      name: 'WithdrawingOnlySellOrdersPairs';
      msg: 'WithdrawingOnlySellOrdersPairs';
    },
    {
      code: 6065;
      name: 'LiquidityProvisionOrderIsWithdrawn';
      msg: 'LiquidityProvisionOrderIsWithdrawn';
    },
    {
      code: 6066;
      name: 'LiquidityProvisionOrderIsNotCorrectOrderForPair';
      msg: 'LiquidityProvisionOrderIsNotCorrectOrderForPair';
    },
    {
      code: 6067;
      name: 'OnlyMarketVirtualPairsCanBeTokenized';
      msg: 'OnlyMarketVirtualPairsCanBeTokenized';
    },
    {
      code: 6068;
      name: 'OnlyLiquidityProvisionPairsCanBeTokenized';
      msg: 'OnlyLiquidityProvisionPairsCanBeTokenized';
    },
    {
      code: 6069;
      name: 'OnlyInitializingPairsCanBePutOnMarket';
      msg: 'OnlyInitializingPairsCanBePutOnMarket';
    },
    {
      code: 6070;
      name: 'CanMakeLpOrderTokenizedOnlyFromTokenizedPair';
      msg: 'CanMakeLpOrderTokenizedOnlyFromTokenizedPair';
    },
    {
      code: 6071;
      name: 'OnlyVirtualLpOrderCanBeTokenized';
      msg: 'OnlyVirtualLpOrderCanBeTokenized';
    },
    {
      code: 6072;
      name: 'OnlyTokenizedLpOrdersCanWithdrawFees';
      msg: 'OnlyTokenizedLpOrdersCanWithdrawFees';
    },
    {
      code: 6073;
      name: 'UserLpTokenAccountDoesntContainNft';
      msg: 'UserLpTokenAccountDoesntContainNft';
    },
    {
      code: 6074;
      name: 'OnlyTokenizedLpOrdersCanBeWithdrawnByThisFunction';
      msg: 'OnlyTokenizedLpOrdersCanBeWithdrawnByThisFunction';
    },
    {
      code: 6075;
      name: 'LpTokenMintDoesntMatchOrder';
      msg: 'LpTokenMintDoesntMatchOrder';
    },
    {
      code: 6076;
      name: 'CanCloseVirtualPoolOnlyIfNoLiquidityLeft';
      msg: 'CanCloseVirtualPoolOnlyIfNoLiquidityLeft';
    },
    {
      code: 6077;
      name: 'CantSetBidCapSmallerThanMarketMinimum';
      msg: 'CantSetBidCapSmallerThanMarketMinimum';
    },
    {
      code: 6078;
      name: 'CantDepositNftWithNotMarketDecimals';
      msg: 'CantDepositNftWithNotMarketDecimals';
    },
    {
      code: 6079;
      name: 'FndAmountCantExceedBidCap';
      msg: 'FndAmountCantExceedBidCap';
    },
    {
      code: 6080;
      name: 'CantBuyMoreThatRemainingBidSettlement';
      msg: 'CantBuyMoreThatRemainingBidSettlement';
    },
    {
      code: 6081;
      name: 'CantBuyMoreThanActiveTokensAmount';
      msg: 'CantBuyMoreThanActiveTokensAmount';
    },
    {
      code: 6082;
      name: 'CantSellMoreThanActiveTokensAmount';
      msg: 'CantSellMoreThanActiveTokensAmount';
    },
    {
      code: 6083;
      name: 'CantDepositMoreThanBidCap';
      msg: 'CantDepositMoreThanBidCap';
    },
    {
      code: 6084;
      name: 'CantDepositZero';
      msg: 'CantDepositZero';
    },
    {
      code: 6085;
      name: 'CantWithdrawMoreThanBidCap';
      msg: 'CantWithdrawMoreThanBidCap';
    },
    {
      code: 6086;
      name: 'CantWithdrawZero';
      msg: 'CantWithdrawZero';
    },
    {
      code: 6087;
      name: 'CantWithdrawMoreThanNftBoxActiveTokens';
      msg: 'CantWithdrawMoreThanNftBoxActiveTokens';
    },
    {
      code: 6088;
      name: 'NftIsNotMasterEdition';
      msg: 'NftIsNotMasterEdition';
    },
    {
      code: 6089;
      name: 'CanGetOnlyRepaidCollateral';
      msg: 'CanGetOnlyRepaidCollateral';
    },
    {
      code: 6090;
      name: 'BondAuthorityIssuerDoesntMatch';
      msg: 'BondAuthorityIssuerDoesntMatch';
    },
    {
      code: 6091;
      name: 'CollateralBoxDoesntBelongFbond';
      msg: 'CollateralBoxDoesntBelongFbond';
    },
    {
      code: 6092;
      name: 'HadoMarketDoesntMatchAuthority';
      msg: 'HadoMarketDoesntMatchAuthority';
    },
    {
      code: 6093;
      name: 'PairDoesntMatchHadomarket';
      msg: 'PairDoesntMatchHadomarket';
    },
    {
      code: 6094;
      name: 'WrongCrossMintAmmProgramAddress';
      msg: 'WrongCrossMintAmmProgramAddress';
    },
    {
      code: 6095;
      name: 'PairScopeValidationNotSupportedNow';
      msg: 'PairScopeValidationNotSupportedNow';
    },
    {
      code: 6096;
      name: 'InvalidAdminAddress';
      msg: 'InvalidAdminAddress';
    },
    {
      code: 6097;
      name: 'WhitelistLimitExceeded';
      msg: 'WhitelistLimitExceeded';
    },
    {
      code: 6098;
      name: 'CanRemoveWhitelistOnlyFromInitializingMarket';
      msg: 'CanRemoveWhitelistOnlyFromInitializingMarket';
    },
    {
      code: 6099;
      name: 'WhitelistDoesntBelongMarket';
      msg: 'WhitelistDoesntBelongMarket';
    },
    {
      code: 6100;
      name: 'MarketAlreadyActive';
      msg: 'MarketAlreadyActive';
    },
    {
      code: 6101;
      name: 'WhitelistedAddressShouldBeEmptyForMerkleTree';
      msg: 'WhitelistedAddressShouldBeEmptyForMerkleTree';
    },
  ];
};

export const IDL: FraktMarketRegistry = {
  version: '0.1.0',
  name: 'frakt_market_registry',
  instructions: [
    {
      name: 'initializeFraktMarket',
      accounts: [
        {
          name: 'fraktMarket',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'user',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'admin',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
      returns: undefined,
    },
    {
      name: 'addWhitelistToMarket',
      accounts: [
        {
          name: 'fraktMarket',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'user',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'whitelistEntry',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'whitelistedAddress',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'whitelistType',
          type: {
            defined: 'NftValidationWhitelistType',
          },
        },
        {
          name: 'root',
          type: {
            array: ['u8', 32],
          },
        },
      ],
      returns: undefined,
    },
    {
      name: 'removeWhitelistFromMarket',
      accounts: [
        {
          name: 'fraktMarket',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'user',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'whitelistEntry',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'whitelistedAddress',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
      returns: undefined,
    },
    {
      name: 'activateFraktMarket',
      accounts: [
        {
          name: 'fraktMarket',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'user',
          isMut: true,
          isSigner: true,
        },
      ],
      args: [],
      returns: undefined,
    },
    {
      name: 'initializeOracle',
      accounts: [
        {
          name: 'fraktMarket',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'user',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'oracle',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'oracleAuthority',
          type: 'publicKey',
        },
        {
          name: 'oracleInfo',
          type: 'publicKey',
        },
        {
          name: 'floor',
          type: 'u64',
        },
      ],
      returns: undefined,
    },
    {
      name: 'setOracleAuthority',
      accounts: [
        {
          name: 'fraktMarket',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'user',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'oracle',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'newOracleAuthority',
          type: 'publicKey',
        },
      ],
      returns: undefined,
    },
    {
      name: 'setOracleFloor',
      accounts: [
        {
          name: 'fraktMarket',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'user',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'oracle',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'newFloor',
          type: 'u64',
        },
      ],
      returns: undefined,
    },
  ],
  accounts: [
    {
      name: 'fraktMarket',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'authority',
            type: 'publicKey',
          },
          {
            name: 'whitelistQuantity',
            type: 'u64',
          },
          {
            name: 'state',
            type: {
              defined: 'FraktMarketState',
            },
          },
        ],
      },
    },
    {
      name: 'oracleFloor',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'fraktMarket',
            type: 'publicKey',
          },
          {
            name: 'oracleAuthority',
            type: 'publicKey',
          },
          {
            name: 'oracleInfo',
            type: 'publicKey',
          },
          {
            name: 'floor',
            type: 'u64',
          },
          {
            name: 'lastUpdatedAt',
            type: 'u64',
          },
        ],
      },
    },
    {
      name: 'whitelistEntry',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'fraktMarket',
            type: 'publicKey',
          },
          {
            name: 'whitelistType',
            type: {
              defined: 'NftValidationWhitelistType',
            },
          },
          {
            name: 'whitelistedAddress',
            type: 'publicKey',
          },
          {
            name: 'root',
            type: {
              array: ['u8', 32],
            },
          },
        ],
      },
    },
  ],
  types: [
    {
      name: 'FraktMarketState',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Initialized',
          },
          {
            name: 'Active',
          },
        ],
      },
    },
    {
      name: 'NftValidationWhitelistType',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Creator',
          },
          {
            name: 'Nft',
          },
          {
            name: 'MerkleTree',
          },
          {
            name: 'CollectionId',
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: 'MetadataDoesntExist',
      msg: 'MetadataDoesntExist',
    },
    {
      code: 6001,
      name: 'DerivedKeyInvalid',
      msg: 'DerivedKeyInvalid',
    },
    {
      code: 6002,
      name: 'InvalidCollectionDetails',
      msg: 'InvalidCollectionDetails',
    },
    {
      code: 6003,
      name: 'InvalidCollection',
      msg: 'InvalidCollection',
    },
    {
      code: 6004,
      name: 'InvalidCollectionMint',
      msg: 'InvalidCollectionMint',
    },
    {
      code: 6005,
      name: 'NftNotVerified',
      msg: 'NftNotVerified',
    },
    {
      code: 6006,
      name: 'InvalidOwner',
      msg: 'InvalidOwner',
    },
    {
      code: 6007,
      name: 'InvalidDelta',
      msg: 'InvalidDelta',
    },
    {
      code: 6008,
      name: 'InvalidFee',
      msg: 'InvalidFee',
    },
    {
      code: 6009,
      name: 'InvalidPairType',
      msg: 'InvalidPairType',
    },
    {
      code: 6010,
      name: 'NotEnoughInTokenAccount',
      msg: 'NotEnoughInTokenAccount',
    },
    {
      code: 6011,
      name: 'InvalidMint',
      msg: 'InvalidMint',
    },
    {
      code: 6012,
      name: 'InvalidSolVault',
      msg: 'InvalidSolVault',
    },
    {
      code: 6013,
      name: 'InvalidFundingAmount',
      msg: 'InvalidFundingAmount',
    },
    {
      code: 6014,
      name: 'NotEnoughLamports',
      msg: 'NotEnoughLamports',
    },
    {
      code: 6015,
      name: 'InvalidJpegOwner',
      msg: 'InvalidJpegOwner',
    },
    {
      code: 6016,
      name: 'InvalidTokenAccount',
      msg: 'InvalidTokenAccount',
    },
    {
      code: 6017,
      name: 'InvalidPayer',
      msg: 'InvalidPayer',
    },
    {
      code: 6018,
      name: 'ShouldBeActive',
      msg: 'ShouldBeActive',
    },
    {
      code: 6019,
      name: 'CantMakeZeroOrders',
      msg: "Can't make 0 orders",
    },
    {
      code: 6020,
      name: 'OnlyClassicAuthority',
      msg: 'OnlyClassicAuthority',
    },
    {
      code: 6021,
      name: 'NotValidAuthorityAdapter',
      msg: 'NotValidAuthorityAdapter',
    },
    {
      code: 6022,
      name: 'UserDoesntHaveAuthority',
      msg: 'UserDoesntHaveAuthority',
    },
    {
      code: 6023,
      name: 'WrongSeed',
      msg: 'WrongSeed',
    },
    {
      code: 6024,
      name: 'CanDepositSolOnlyToTokenToNft',
      msg: 'CanDepositSolOnlyToTokenToNft',
    },
    {
      code: 6025,
      name: 'MaxAmountOfOrdersSucceeded',
      msg: 'MaxAmountOfOrdersSucceeded',
    },
    {
      code: 6026,
      name: 'CanDepositNftOnlyToNftToToken',
      msg: 'CanDepositNftOnlyToNftToToken',
    },
    {
      code: 6027,
      name: 'TokenAccountDoesntContainNft',
      msg: 'TokenAccountDoesntContainNft',
    },
    {
      code: 6028,
      name: 'MarketAuthorityIncorrect',
      msg: 'MarketAuthorityIncorrect',
    },
    {
      code: 6029,
      name: 'CanAddWhitelistOnlyToInitializingMarket',
      msg: 'CanAddWhitelistOnlyToInitializingMarket',
    },
    {
      code: 6030,
      name: 'CanPutPairsOnlyToAvailableMarkets',
      msg: 'CanPutPairsOnlyToAvailableMarkets',
    },
    {
      code: 6031,
      name: 'PairAndNftValidationMarketDoesntMatch',
      msg: 'PairAndNftValidationMarketDoesntMatch',
    },
    {
      code: 6032,
      name: 'OnlyMarketScopeSupported',
      msg: 'OnlyMarketScopeSupported',
    },
    {
      code: 6033,
      name: 'NotWhitelistedNftForThisMarket',
      msg: 'NotWhitelistedNftForThisMarket',
    },
    {
      code: 6034,
      name: 'CanDepositOnlyToLiquidityProvision',
      msg: 'CanDepositOnlyToLiquidityProvision',
    },
    {
      code: 6035,
      name: 'NftBoxDoesntMatchPair',
      msg: 'NftBoxDoesntMatchPair',
    },
    {
      code: 6036,
      name: 'NftBoxShouldBeActive',
      msg: 'NftBoxShouldBeActive',
    },
    {
      code: 6037,
      name: 'NftBoxDoesntMatchMint',
      msg: 'NftBoxDoesntMatchMint',
    },
    {
      code: 6038,
      name: 'CantBuyNftFromTokenForNft',
      msg: 'CantBuyNftFromTokenForNft',
    },
    {
      code: 6039,
      name: 'OnlyTokenForNftIsEligibleForThisSell',
      msg: 'OnlyTokenForNftIsEligibleForThisSell',
    },
    {
      code: 6040,
      name: 'NoBuyOrdersOnThisPair',
      msg: 'NoBuyOrdersOnThisPair',
    },
    {
      code: 6041,
      name: 'OnlyLiquidityProvisionIsEligibleForThisSell',
      msg: 'OnlyLiquidityProvisionIsEligibleForThisSell',
    },
    {
      code: 6042,
      name: 'OnlyTokenForNftIsEligibleForThisWithdrawal',
      msg: 'OnlyTokenForNftIsEligibleForThisWithdrawal',
    },
    {
      code: 6043,
      name: 'OnlyNftForTokenIsEligibleForThisWithdrawal',
      msg: 'OnlyNftForTokenIsEligibleForThisWithdrawal',
    },
    {
      code: 6044,
      name: 'OnlyLiquidityProvisionIsEligibleForThisWithdrawal',
      msg: 'OnlyLiquidityProvisionIsEligibleForThisWithdrawal',
    },
    {
      code: 6045,
      name: 'InstructionIsNotSupported',
      msg: 'InstructionIsNotSupported',
    },
    {
      code: 6046,
      name: 'CanTradeOnlyWithPairsOnMarket',
      msg: 'CanTradeOnlyWithPairsOnMarket',
    },
    {
      code: 6047,
      name: 'NoLiquidityFeesToWithdraw',
      msg: 'NoLiquidityFeesToWithdraw',
    },
    {
      code: 6048,
      name: 'MaxAmountToPayExceeded',
      msg: 'MaxAmountToPayExceeded',
    },
    {
      code: 6049,
      name: 'GettingLessThanMinAmountToGet',
      msg: 'GettingLessThanMinAmountToGet',
    },
    {
      code: 6050,
      name: 'UserDoesntHaveHadomarketAuthority',
      msg: 'UserDoesntHaveHadomarketAuthority',
    },
    {
      code: 6051,
      name: 'HadomarketAlreadyFinished',
      msg: 'HadomarketAlreadyFinished',
    },
    {
      code: 6052,
      name: 'CanDepositLiqudityOnlyToVirtualOrInitializingPairs',
      msg: 'CanDepositLiqudityOnlyToVirtualOrInitializingPairs',
    },
    {
      code: 6053,
      name: 'CanModifyOnlyToVirtualOrInitializingPairs',
      msg: 'CanModifyOnlyToVirtualOrInitializingPairs',
    },
    {
      code: 6054,
      name: 'LiquidityProvisionOrderPairDoesntMatch',
      msg: 'LiquidityProvisionOrderPairDoesntMatch',
    },
    {
      code: 6055,
      name: 'OnlyVirtualLpOrdersCanBeWithdrawnByThisFunction',
      msg: 'OnlyVirtualLpOrdersCanBeWithdrawnByThisFunction',
    },
    {
      code: 6056,
      name: 'OnlyVirtualOrTokenizedLpOrdersCanBeReplacedByThisFunction',
      msg: 'OnlyVirtualOrTokenizedLpOrdersCanBeReplacedByThisFunction',
    },
    {
      code: 6057,
      name: 'LiquidityProvisionOrderNotEdge',
      msg: 'LiquidityProvisionOrderNotEdge',
    },
    {
      code: 6058,
      name: 'NftPairBoxNotParsingFromRemaining',
      msg: 'NftPairBoxNotParsingFromRemaining',
    },
    {
      code: 6059,
      name: 'VaultNftTokenAccountNotParsingFromRemaining',
      msg: 'VaultNftTokenAccountNotParsingFromRemaining',
    },
    {
      code: 6060,
      name: 'UserTokenAccountNotParsingFromRemaining',
      msg: 'UserTokenAccountNotParsingFromRemaining',
    },
    {
      code: 6061,
      name: 'WithdrawingOnlyAtLeastOneBuyAndOneSellPairs',
      msg: 'WithdrawingOnlyAtLeastOneBuyAndOneSellPairs',
    },
    {
      code: 6062,
      name: 'VaultDoesntMatchBox',
      msg: 'VaultDoesntMatchBox',
    },
    {
      code: 6063,
      name: 'WithdrawingOnlyBuyOrdersPairs',
      msg: 'WithdrawingOnlyBuyOrdersPairs',
    },
    {
      code: 6064,
      name: 'WithdrawingOnlySellOrdersPairs',
      msg: 'WithdrawingOnlySellOrdersPairs',
    },
    {
      code: 6065,
      name: 'LiquidityProvisionOrderIsWithdrawn',
      msg: 'LiquidityProvisionOrderIsWithdrawn',
    },
    {
      code: 6066,
      name: 'LiquidityProvisionOrderIsNotCorrectOrderForPair',
      msg: 'LiquidityProvisionOrderIsNotCorrectOrderForPair',
    },
    {
      code: 6067,
      name: 'OnlyMarketVirtualPairsCanBeTokenized',
      msg: 'OnlyMarketVirtualPairsCanBeTokenized',
    },
    {
      code: 6068,
      name: 'OnlyLiquidityProvisionPairsCanBeTokenized',
      msg: 'OnlyLiquidityProvisionPairsCanBeTokenized',
    },
    {
      code: 6069,
      name: 'OnlyInitializingPairsCanBePutOnMarket',
      msg: 'OnlyInitializingPairsCanBePutOnMarket',
    },
    {
      code: 6070,
      name: 'CanMakeLpOrderTokenizedOnlyFromTokenizedPair',
      msg: 'CanMakeLpOrderTokenizedOnlyFromTokenizedPair',
    },
    {
      code: 6071,
      name: 'OnlyVirtualLpOrderCanBeTokenized',
      msg: 'OnlyVirtualLpOrderCanBeTokenized',
    },
    {
      code: 6072,
      name: 'OnlyTokenizedLpOrdersCanWithdrawFees',
      msg: 'OnlyTokenizedLpOrdersCanWithdrawFees',
    },
    {
      code: 6073,
      name: 'UserLpTokenAccountDoesntContainNft',
      msg: 'UserLpTokenAccountDoesntContainNft',
    },
    {
      code: 6074,
      name: 'OnlyTokenizedLpOrdersCanBeWithdrawnByThisFunction',
      msg: 'OnlyTokenizedLpOrdersCanBeWithdrawnByThisFunction',
    },
    {
      code: 6075,
      name: 'LpTokenMintDoesntMatchOrder',
      msg: 'LpTokenMintDoesntMatchOrder',
    },
    {
      code: 6076,
      name: 'CanCloseVirtualPoolOnlyIfNoLiquidityLeft',
      msg: 'CanCloseVirtualPoolOnlyIfNoLiquidityLeft',
    },
    {
      code: 6077,
      name: 'CantSetBidCapSmallerThanMarketMinimum',
      msg: 'CantSetBidCapSmallerThanMarketMinimum',
    },
    {
      code: 6078,
      name: 'CantDepositNftWithNotMarketDecimals',
      msg: 'CantDepositNftWithNotMarketDecimals',
    },
    {
      code: 6079,
      name: 'FndAmountCantExceedBidCap',
      msg: 'FndAmountCantExceedBidCap',
    },
    {
      code: 6080,
      name: 'CantBuyMoreThatRemainingBidSettlement',
      msg: 'CantBuyMoreThatRemainingBidSettlement',
    },
    {
      code: 6081,
      name: 'CantBuyMoreThanActiveTokensAmount',
      msg: 'CantBuyMoreThanActiveTokensAmount',
    },
    {
      code: 6082,
      name: 'CantSellMoreThanActiveTokensAmount',
      msg: 'CantSellMoreThanActiveTokensAmount',
    },
    {
      code: 6083,
      name: 'CantDepositMoreThanBidCap',
      msg: 'CantDepositMoreThanBidCap',
    },
    {
      code: 6084,
      name: 'CantDepositZero',
      msg: 'CantDepositZero',
    },
    {
      code: 6085,
      name: 'CantWithdrawMoreThanBidCap',
      msg: 'CantWithdrawMoreThanBidCap',
    },
    {
      code: 6086,
      name: 'CantWithdrawZero',
      msg: 'CantWithdrawZero',
    },
    {
      code: 6087,
      name: 'CantWithdrawMoreThanNftBoxActiveTokens',
      msg: 'CantWithdrawMoreThanNftBoxActiveTokens',
    },
    {
      code: 6088,
      name: 'NftIsNotMasterEdition',
      msg: 'NftIsNotMasterEdition',
    },
    {
      code: 6089,
      name: 'CanGetOnlyRepaidCollateral',
      msg: 'CanGetOnlyRepaidCollateral',
    },
    {
      code: 6090,
      name: 'BondAuthorityIssuerDoesntMatch',
      msg: 'BondAuthorityIssuerDoesntMatch',
    },
    {
      code: 6091,
      name: 'CollateralBoxDoesntBelongFbond',
      msg: 'CollateralBoxDoesntBelongFbond',
    },
    {
      code: 6092,
      name: 'HadoMarketDoesntMatchAuthority',
      msg: 'HadoMarketDoesntMatchAuthority',
    },
    {
      code: 6093,
      name: 'PairDoesntMatchHadomarket',
      msg: 'PairDoesntMatchHadomarket',
    },
    {
      code: 6094,
      name: 'WrongCrossMintAmmProgramAddress',
      msg: 'WrongCrossMintAmmProgramAddress',
    },
    {
      code: 6095,
      name: 'PairScopeValidationNotSupportedNow',
      msg: 'PairScopeValidationNotSupportedNow',
    },
    {
      code: 6096,
      name: 'InvalidAdminAddress',
      msg: 'InvalidAdminAddress',
    },
    {
      code: 6097,
      name: 'WhitelistLimitExceeded',
      msg: 'WhitelistLimitExceeded',
    },
    {
      code: 6098,
      name: 'CanRemoveWhitelistOnlyFromInitializingMarket',
      msg: 'CanRemoveWhitelistOnlyFromInitializingMarket',
    },
    {
      code: 6099,
      name: 'WhitelistDoesntBelongMarket',
      msg: 'WhitelistDoesntBelongMarket',
    },
    {
      code: 6100,
      name: 'MarketAlreadyActive',
      msg: 'MarketAlreadyActive',
    },
    {
      code: 6101,
      name: 'WhitelistedAddressShouldBeEmptyForMerkleTree',
      msg: 'WhitelistedAddressShouldBeEmptyForMerkleTree',
    },
  ],
};
