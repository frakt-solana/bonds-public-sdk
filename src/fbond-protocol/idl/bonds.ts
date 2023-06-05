export type Bonds = {
  "version": "0.1.0",
  "name": "bonds",
  "instructions": [
    {
      "name": "boundHadoMarketToFraktMarket",
      "accounts": [
        {
          "name": "hadoMarket",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fraktMarket",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "hadoRegistry",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "createBondOfferV2",
      "accounts": [
        {
          "name": "bondOfferV2",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "hadoMarket",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bondOfferRandomSeed",
          "type": "u64"
        },
        {
          "name": "params",
          "type": {
            "defined": "PairParams"
          }
        },
        {
          "name": "bondingCurveType",
          "type": {
            "defined": "BondOfferBondingCurveType"
          }
        },
        {
          "name": "amountOfTokensToBuy",
          "type": "u64"
        },
        {
          "name": "loanToValueFilter",
          "type": "u64"
        },
        {
          "name": "durationFilter",
          "type": "u64"
        },
        {
          "name": "maxReturnAmountFilter",
          "type": "u64"
        },
        {
          "name": "bondFeatures",
          "type": {
            "defined": "BondFeatures"
          }
        }
      ]
    },
    {
      "name": "updateBondOfferV2",
      "accounts": [
        {
          "name": "bondOfferV2",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "PairParams"
          }
        },
        {
          "name": "loanToValueFilter",
          "type": "u64"
        },
        {
          "name": "durationFilter",
          "type": "u64"
        },
        {
          "name": "maxReturnAmountFilter",
          "type": "u64"
        }
      ]
    },
    {
      "name": "depositToBondOfferV2",
      "accounts": [
        {
          "name": "bondOfferV2",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amountOfTokensToBuy",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdrawFromBondOfferV2",
      "accounts": [
        {
          "name": "bondOfferV2",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amountOfTokensToWithdraw",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initializeHadoMarket",
      "accounts": [
        {
          "name": "hadoMarket",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "validationAdapterProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK Custom validation adapter"
          ]
        },
        {
          "name": "pairTokenMint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK Custom token mint"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "marketParams",
          "type": {
            "defined": "InitializeHadoMarketParams"
          }
        }
      ]
    },
    {
      "name": "finishHadoMarket",
      "accounts": [
        {
          "name": "hadoMarket",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "removeBondOfferV2",
      "accounts": [
        {
          "name": "bondOfferV2",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "repayFbondToTradeTransactions",
      "accounts": [
        {
          "name": "collateralBox",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fbond",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bondProgramAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fbondTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authRules",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "editionInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ownerTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "instructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authorizationRulesProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK : admin address"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userFbondTokenAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "authorizationData",
          "type": {
            "option": {
              "defined": "AuthorizationDataLocal"
            }
          }
        }
      ]
    },
    {
      "name": "exitValidateAndSellToBondOffersV2",
      "accounts": [
        {
          "name": "collateralBox",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fbond",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fbondTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "hadoRegistry",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fraktMarket",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleFloor",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "whitelistEntry",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "protocolFeeReceiver",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "editionInfo",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "sellBondParams",
          "type": {
            "vec": {
              "defined": "SellBondParams"
            }
          }
        }
      ]
    },
    {
      "name": "refinanceToBondOffersV2",
      "accounts": [
        {
          "name": "collateralBox",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fbond",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bondProgramAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fbondTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "newFbondTokenMint",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "hadoRegistry",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fraktMarket",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleFloor",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "whitelistEntry",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK : admin address"
          ]
        },
        {
          "name": "assetReceiverOrAutocompoundDepositTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userFbondTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "newFbond",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "newBondProgramAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userNewFbondTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "newCollateralTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "newCollateralBox",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mutualBondTradeTxnVault",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK vault for sol"
          ]
        },
        {
          "name": "protocolFeeReceiver",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "editionInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ownerTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "instructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authorizationRulesProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "newFbondBumps",
          "type": {
            "defined": "FBondBumps"
          }
        },
        {
          "name": "newFbondParams",
          "type": {
            "defined": "FBondParams"
          }
        },
        {
          "name": "authorizationData",
          "type": {
            "option": {
              "defined": "AuthorizationDataLocal"
            }
          }
        },
        {
          "name": "sellBondParams",
          "type": {
            "vec": {
              "defined": "SellBondParams"
            }
          }
        }
      ]
    },
    {
      "name": "createBondAndSellToOffers",
      "accounts": [
        {
          "name": "fbond",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "bondProgramAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fbondTokenMint",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "collateralBox",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "hadoRegistry",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fraktMarket",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleFloor",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "whitelistEntry",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "assetReceiverOrAutocompoundDepositTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mutualBondTradeTxnVault",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK vault for sol"
          ]
        },
        {
          "name": "protocolFeeReceiver",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "editionInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ownerTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "instructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authorizationRulesProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bumps",
          "type": {
            "defined": "FBondBumps"
          }
        },
        {
          "name": "amountToDeposit",
          "type": "u64"
        },
        {
          "name": "params",
          "type": {
            "defined": "FBondParams"
          }
        },
        {
          "name": "authorizationData",
          "type": {
            "option": {
              "defined": "AuthorizationDataLocal"
            }
          }
        },
        {
          "name": "sellBondParams",
          "type": {
            "vec": {
              "defined": "SellBondParams"
            }
          }
        }
      ]
    },
    {
      "name": "liquidateBondOnAuction",
      "accounts": [
        {
          "name": "collateralBox",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fbond",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bondProgramAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralOwner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "fraktMarket",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleFloor",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "whitelistEntry",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "returnFundsOwner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "editionInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ownerTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "instructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authorizationRulesProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK : admin address"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "authorizationData",
          "type": {
            "option": {
              "defined": "AuthorizationDataLocal"
            }
          }
        }
      ]
    },
    {
      "name": "liquidateBondOnAuctionPnft",
      "accounts": [
        {
          "name": "collateralBox",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fbond",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bondProgramAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "middleTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bondProgramAuthorityTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralOwner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "fraktMarket",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleFloor",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "whitelistEntry",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "returnFundsOwner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "editionInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ownerTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "instructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authorizationRulesProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK : admin address"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "authorizationData",
          "type": {
            "option": {
              "defined": "AuthorizationDataLocal"
            }
          }
        }
      ]
    },
    {
      "name": "claimNftByLender",
      "accounts": [
        {
          "name": "collateralBox",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fbond",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fbondTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bondTradeTxnTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mutualBondTradeTxnVault",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK vault for sol"
          ]
        },
        {
          "name": "bondTradeTransactionV2",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bondProgramAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralOwner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "editionInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ownerTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "instructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authorizationRulesProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "authorizationData",
          "type": {
            "option": {
              "defined": "AuthorizationDataLocal"
            }
          }
        }
      ]
    },
    {
      "name": "claimNftByLenderPnft",
      "accounts": [
        {
          "name": "collateralBox",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fbond",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fbondTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bondTradeTxnTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "middleTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bondProgramAuthorityTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mutualBondTradeTxnVault",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK vault for sol"
          ]
        },
        {
          "name": "bondTradeTransactionV2",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bondProgramAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralOwner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "editionInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ownerTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "instructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authorizationRulesProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "authorizationData",
          "type": {
            "option": {
              "defined": "AuthorizationDataLocal"
            }
          }
        }
      ]
    },
    {
      "name": "createBondAndSellToOffersForTest",
      "accounts": [
        {
          "name": "fbond",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "bondProgramAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fbondTokenMint",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "collateralBox",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "hadoRegistry",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fraktMarket",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleFloor",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "whitelistEntry",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "assetReceiverOrAutocompoundDepositTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mutualBondTradeTxnVault",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK vault for sol"
          ]
        },
        {
          "name": "protocolFeeReceiver",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "editionInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ownerTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "instructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authorizationRulesProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bumps",
          "type": {
            "defined": "FBondBumps"
          }
        },
        {
          "name": "amountToDeposit",
          "type": "u64"
        },
        {
          "name": "params",
          "type": {
            "defined": "FBondParams"
          }
        },
        {
          "name": "authorizationData",
          "type": {
            "option": {
              "defined": "AuthorizationDataLocal"
            }
          }
        },
        {
          "name": "sellBondParams",
          "type": {
            "vec": {
              "defined": "SellBondParams"
            }
          }
        }
      ]
    },
    {
      "name": "patchBondOffer",
      "accounts": [
        {
          "name": "bondOfferV2",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "collateralBox",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "fbond",
            "type": "publicKey"
          },
          {
            "name": "collateralBoxType",
            "type": {
              "defined": "CollateralBoxType"
            }
          },
          {
            "name": "collateralTokenMint",
            "type": "publicKey"
          },
          {
            "name": "collateralTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "collateralAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "fraktBond",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "fraktBondState",
            "type": {
              "defined": "FraktBondState"
            }
          },
          {
            "name": "bondTradeTransactionsCounter",
            "type": "u8"
          },
          {
            "name": "collateralBoxesQuantity",
            "type": "u64"
          },
          {
            "name": "returnTokenMint",
            "type": "publicKey"
          },
          {
            "name": "fraktMarket",
            "type": "publicKey"
          },
          {
            "name": "amountToReturn",
            "type": "u64"
          },
          {
            "name": "actualReturnedAmount",
            "type": "u64"
          },
          {
            "name": "terminatedCounter",
            "type": "u8"
          },
          {
            "name": "fbondTokenMint",
            "type": "publicKey"
          },
          {
            "name": "fbondTokenSupply",
            "type": "u64"
          },
          {
            "name": "activatedAt",
            "type": "u64"
          },
          {
            "name": "liquidatingAt",
            "type": "u64"
          },
          {
            "name": "fbondIssuer",
            "type": "publicKey"
          },
          {
            "name": "bondCollateralOrSolReceiver",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "hadoMarketRegistry",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "hadoMarket",
            "type": "publicKey"
          },
          {
            "name": "fraktMarket",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "hadoMarket",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "marketAuthority",
            "type": "publicKey"
          },
          {
            "name": "marketState",
            "type": {
              "defined": "MarketState"
            }
          },
          {
            "name": "marketTrustType",
            "type": {
              "defined": "MarketTrustType"
            }
          },
          {
            "name": "pairValidationType",
            "type": {
              "defined": "PairValidationType"
            }
          },
          {
            "name": "validationAdapterProgram",
            "type": "publicKey"
          },
          {
            "name": "minBidCap",
            "type": "u64"
          },
          {
            "name": "minMarketFee",
            "type": "u64"
          },
          {
            "name": "pairTokenType",
            "type": {
              "defined": "PairTokenType"
            }
          },
          {
            "name": "pairTokenMint",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "bondOfferV2",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "hadoMarket",
            "type": "publicKey"
          },
          {
            "name": "pairState",
            "type": {
              "defined": "PairState"
            }
          },
          {
            "name": "bondingCurve",
            "type": {
              "defined": "BondOfferBondingCurve"
            }
          },
          {
            "name": "baseSpotPrice",
            "type": "u64"
          },
          {
            "name": "mathCounter",
            "type": "i64"
          },
          {
            "name": "currentSpotPrice",
            "type": "u64"
          },
          {
            "name": "concentrationIndex",
            "type": "u64"
          },
          {
            "name": "bidCap",
            "type": "u64"
          },
          {
            "name": "bidSettlement",
            "type": "i64"
          },
          {
            "name": "edgeSettlement",
            "type": "u64"
          },
          {
            "name": "fundsSolOrTokenBalance",
            "type": "u64"
          },
          {
            "name": "buyOrdersQuantity",
            "type": "u64"
          },
          {
            "name": "lastTransactedAt",
            "type": "u64"
          },
          {
            "name": "assetReceiver",
            "type": "publicKey"
          },
          {
            "name": "validation",
            "type": {
              "defined": "BondOfferValidation"
            }
          }
        ]
      }
    },
    {
      "name": "bondTradeTransactionV2",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bondTradeTransactionState",
            "type": {
              "defined": "BondTradeTransactionV2State"
            }
          },
          {
            "name": "bondOffer",
            "type": "publicKey"
          },
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "amountOfBonds",
            "type": "u64"
          },
          {
            "name": "solAmount",
            "type": "u64"
          },
          {
            "name": "feeAmount",
            "type": "u64"
          },
          {
            "name": "bondTradeTransactionType",
            "type": {
              "defined": "BondTradeTransactionV2Type"
            }
          },
          {
            "name": "fbondTokenMint",
            "type": "publicKey"
          },
          {
            "name": "soldAt",
            "type": "u64"
          },
          {
            "name": "redeemedAt",
            "type": "u64"
          },
          {
            "name": "redeemResult",
            "type": {
              "defined": "RedeemResult"
            }
          },
          {
            "name": "seller",
            "type": "publicKey"
          },
          {
            "name": "isDirectSell",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "SellBondParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "minAmountToGet",
            "type": "u64"
          },
          {
            "name": "amountToSell",
            "type": "u64"
          },
          {
            "name": "bondTradeTransactionV2Bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "FBondParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amountToReturn",
            "type": "u64"
          },
          {
            "name": "bondDuration",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "FBondBumps",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "PairParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "delta",
            "type": "u64"
          },
          {
            "name": "spotPrice",
            "type": "u64"
          },
          {
            "name": "fee",
            "type": "u64"
          },
          {
            "name": "bidCap",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "PairBumps",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "fundsSolVaultSeed",
            "type": "u8"
          },
          {
            "name": "feeVaultSeed",
            "type": "u8"
          },
          {
            "name": "nftsSeed",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "InitializeHadoMarketParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "minBidCap",
            "type": "u64"
          },
          {
            "name": "minMarketFee",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "BondOfferValidation",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "loanToValueFilter",
            "type": "u64"
          },
          {
            "name": "durationFilter",
            "type": "u64"
          },
          {
            "name": "maxReturnAmountFilter",
            "type": "u64"
          },
          {
            "name": "bondFeatures",
            "type": {
              "defined": "BondFeatures"
            }
          }
        ]
      }
    },
    {
      "name": "BondOfferBondingCurve",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "delta",
            "type": "u64"
          },
          {
            "name": "bondingType",
            "type": {
              "defined": "BondOfferBondingCurveType"
            }
          }
        ]
      }
    },
    {
      "name": "AuthorizationDataLocal",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "payload",
            "type": {
              "vec": {
                "defined": "TaggedPayload"
              }
            }
          }
        ]
      }
    },
    {
      "name": "TaggedPayload",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "payload",
            "type": {
              "defined": "PayloadTypeLocal"
            }
          }
        ]
      }
    },
    {
      "name": "SeedsVecLocal",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "seeds",
            "docs": [
              "The vector of derivation seeds."
            ],
            "type": {
              "vec": "bytes"
            }
          }
        ]
      }
    },
    {
      "name": "ProofInfoLocal",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "proof",
            "docs": [
              "The merkle proof."
            ],
            "type": {
              "vec": {
                "array": [
                  "u8",
                  32
                ]
              }
            }
          }
        ]
      }
    },
    {
      "name": "CollateralBoxType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Escrow"
          },
          {
            "name": "Escrowless"
          }
        ]
      }
    },
    {
      "name": "FraktBondState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Initialized"
          },
          {
            "name": "Active"
          },
          {
            "name": "Repaid"
          },
          {
            "name": "Liquidating"
          },
          {
            "name": "Liquidated"
          }
        ]
      }
    },
    {
      "name": "MarketTrustType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Unverified"
          },
          {
            "name": "Verified"
          }
        ]
      }
    },
    {
      "name": "MarketState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Initializing"
          },
          {
            "name": "Available"
          }
        ]
      }
    },
    {
      "name": "PairValidationType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "ClassicValidation"
          },
          {
            "name": "CustomValidation"
          }
        ]
      }
    },
    {
      "name": "PairTokenType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "NativeSol"
          },
          {
            "name": "Spl"
          }
        ]
      }
    },
    {
      "name": "BondFeatures",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "None"
          },
          {
            "name": "Autocompound"
          },
          {
            "name": "ReceiveNftOnLiquidation"
          },
          {
            "name": "AutoreceiveSol"
          },
          {
            "name": "AutoCompoundAndReceiveNft"
          },
          {
            "name": "AutoReceiveAndReceiveNft"
          }
        ]
      }
    },
    {
      "name": "PairState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Initializing"
          },
          {
            "name": "OnMarketVirtual"
          },
          {
            "name": "OnMarketTokenized"
          },
          {
            "name": "Frozen"
          },
          {
            "name": "Closed"
          }
        ]
      }
    },
    {
      "name": "BondOfferBondingCurveType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Linear"
          },
          {
            "name": "Exponential"
          }
        ]
      }
    },
    {
      "name": "BondTradeTransactionV2State",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "NotActive"
          },
          {
            "name": "Active"
          }
        ]
      }
    },
    {
      "name": "BondTradeTransactionV2Type",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "None"
          },
          {
            "name": "Autocompound"
          },
          {
            "name": "ReceiveNftOnLiquidation"
          },
          {
            "name": "AutoreceiveSol"
          },
          {
            "name": "AutoCompoundAndReceiveNft"
          },
          {
            "name": "AutoReceiveAndReceiveNft"
          }
        ]
      }
    },
    {
      "name": "RedeemResult",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "None"
          },
          {
            "name": "AutoReceiveSol"
          },
          {
            "name": "Autocompound"
          },
          {
            "name": "Nft"
          },
          {
            "name": "ExitSol"
          }
        ]
      }
    },
    {
      "name": "PayloadTypeLocal",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Pubkey",
            "fields": [
              "publicKey"
            ]
          },
          {
            "name": "Seeds",
            "fields": [
              {
                "defined": "SeedsVecLocal"
              }
            ]
          },
          {
            "name": "MerkleProof",
            "fields": [
              {
                "defined": "ProofInfoLocal"
              }
            ]
          },
          {
            "name": "Number",
            "fields": [
              "u64"
            ]
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "MetadataDoesntExist",
      "msg": "MetadataDoesntExist"
    },
    {
      "code": 6001,
      "name": "DerivedKeyInvalid",
      "msg": "DerivedKeyInvalid"
    },
    {
      "code": 6002,
      "name": "InvalidCollectionDetails",
      "msg": "InvalidCollectionDetails"
    },
    {
      "code": 6003,
      "name": "InvalidCollection",
      "msg": "InvalidCollection"
    },
    {
      "code": 6004,
      "name": "InvalidCollectionMint",
      "msg": "InvalidCollectionMint"
    },
    {
      "code": 6005,
      "name": "NftNotVerified",
      "msg": "NftNotVerified"
    },
    {
      "code": 6006,
      "name": "InvalidOwner",
      "msg": "InvalidOwner"
    },
    {
      "code": 6007,
      "name": "InvalidDelta",
      "msg": "InvalidDelta"
    },
    {
      "code": 6008,
      "name": "InvalidFee",
      "msg": "InvalidFee"
    },
    {
      "code": 6009,
      "name": "InvalidPairType",
      "msg": "InvalidPairType"
    },
    {
      "code": 6010,
      "name": "NotEnoughInTokenAccount",
      "msg": "NotEnoughInTokenAccount"
    },
    {
      "code": 6011,
      "name": "InvalidMint",
      "msg": "InvalidMint"
    },
    {
      "code": 6012,
      "name": "InvalidSolVault",
      "msg": "InvalidSolVault"
    },
    {
      "code": 6013,
      "name": "InvalidFundingAmount",
      "msg": "InvalidFundingAmount"
    },
    {
      "code": 6014,
      "name": "NotEnoughLamports",
      "msg": "NotEnoughLamports"
    },
    {
      "code": 6015,
      "name": "InvalidJpegOwner",
      "msg": "InvalidJpegOwner"
    },
    {
      "code": 6016,
      "name": "InvalidTokenAccount",
      "msg": "InvalidTokenAccount"
    },
    {
      "code": 6017,
      "name": "InvalidPayer",
      "msg": "InvalidPayer"
    },
    {
      "code": 6018,
      "name": "ShouldBeActive",
      "msg": "ShouldBeActive"
    },
    {
      "code": 6019,
      "name": "CantMakeZeroOrders",
      "msg": "Can't make 0 orders"
    },
    {
      "code": 6020,
      "name": "OnlyClassicAuthority",
      "msg": "OnlyClassicAuthority"
    },
    {
      "code": 6021,
      "name": "NotValidAuthorityAdapter",
      "msg": "NotValidAuthorityAdapter"
    },
    {
      "code": 6022,
      "name": "UserDoesntHaveAuthority",
      "msg": "UserDoesntHaveAuthority"
    },
    {
      "code": 6023,
      "name": "WrongSeed",
      "msg": "WrongSeed"
    },
    {
      "code": 6024,
      "name": "CanDepositSolOnlyToTokenToNft",
      "msg": "CanDepositSolOnlyToTokenToNft"
    },
    {
      "code": 6025,
      "name": "MaxAmountOfOrdersSucceeded",
      "msg": "MaxAmountOfOrdersSucceeded"
    },
    {
      "code": 6026,
      "name": "CanDepositNftOnlyToNftToToken",
      "msg": "CanDepositNftOnlyToNftToToken"
    },
    {
      "code": 6027,
      "name": "TokenAccountDoesntContainNft",
      "msg": "TokenAccountDoesntContainNft"
    },
    {
      "code": 6028,
      "name": "MarketAuthorityIncorrect",
      "msg": "MarketAuthorityIncorrect"
    },
    {
      "code": 6029,
      "name": "CanAddWhitelistOnlyToInitializingMarket",
      "msg": "CanAddWhitelistOnlyToInitializingMarket"
    },
    {
      "code": 6030,
      "name": "CanPutPairsOnlyToAvailableMarkets",
      "msg": "CanPutPairsOnlyToAvailableMarkets"
    },
    {
      "code": 6031,
      "name": "PairAndNftValidationMarketDoesntMatch",
      "msg": "PairAndNftValidationMarketDoesntMatch"
    },
    {
      "code": 6032,
      "name": "OnlyMarketScopeSupported",
      "msg": "OnlyMarketScopeSupported"
    },
    {
      "code": 6033,
      "name": "NotWhitelistedNftForThisMarket",
      "msg": "NotWhitelistedNftForThisMarket"
    },
    {
      "code": 6034,
      "name": "CanDepositOnlyToLiquidityProvision",
      "msg": "CanDepositOnlyToLiquidityProvision"
    },
    {
      "code": 6035,
      "name": "NftBoxDoesntMatchPair",
      "msg": "NftBoxDoesntMatchPair"
    },
    {
      "code": 6036,
      "name": "NftBoxShouldBeActive",
      "msg": "NftBoxShouldBeActive"
    },
    {
      "code": 6037,
      "name": "NftBoxDoesntMatchMint",
      "msg": "NftBoxDoesntMatchMint"
    },
    {
      "code": 6038,
      "name": "CantBuyNftFromTokenForNft",
      "msg": "CantBuyNftFromTokenForNft"
    },
    {
      "code": 6039,
      "name": "OnlyTokenForNftIsEligibleForThisSell",
      "msg": "OnlyTokenForNftIsEligibleForThisSell"
    },
    {
      "code": 6040,
      "name": "NoBuyOrdersOnThisPair",
      "msg": "NoBuyOrdersOnThisPair"
    },
    {
      "code": 6041,
      "name": "OnlyLiquidityProvisionIsEligibleForThisSell",
      "msg": "OnlyLiquidityProvisionIsEligibleForThisSell"
    },
    {
      "code": 6042,
      "name": "OnlyTokenForNftIsEligibleForThisWithdrawal",
      "msg": "OnlyTokenForNftIsEligibleForThisWithdrawal"
    },
    {
      "code": 6043,
      "name": "OnlyNftForTokenIsEligibleForThisWithdrawal",
      "msg": "OnlyNftForTokenIsEligibleForThisWithdrawal"
    },
    {
      "code": 6044,
      "name": "OnlyLiquidityProvisionIsEligibleForThisWithdrawal",
      "msg": "OnlyLiquidityProvisionIsEligibleForThisWithdrawal"
    },
    {
      "code": 6045,
      "name": "InstructionIsNotSupported",
      "msg": "InstructionIsNotSupported"
    },
    {
      "code": 6046,
      "name": "CanTradeOnlyWithPairsOnMarket",
      "msg": "CanTradeOnlyWithPairsOnMarket"
    },
    {
      "code": 6047,
      "name": "NoLiquidityFeesToWithdraw",
      "msg": "NoLiquidityFeesToWithdraw"
    },
    {
      "code": 6048,
      "name": "MaxAmountToPayExceeded",
      "msg": "MaxAmountToPayExceeded"
    },
    {
      "code": 6049,
      "name": "GettingLessThanMinAmountToGet",
      "msg": "GettingLessThanMinAmountToGet"
    },
    {
      "code": 6050,
      "name": "UserDoesntHaveHadomarketAuthority",
      "msg": "UserDoesntHaveHadomarketAuthority"
    },
    {
      "code": 6051,
      "name": "HadomarketAlreadyFinished",
      "msg": "HadomarketAlreadyFinished"
    },
    {
      "code": 6052,
      "name": "CanDepositLiqudityOnlyToVirtualOrInitializingPairs",
      "msg": "CanDepositLiqudityOnlyToVirtualOrInitializingPairs"
    },
    {
      "code": 6053,
      "name": "CanModifyOnlyToVirtualOrInitializingPairs",
      "msg": "CanModifyOnlyToVirtualOrInitializingPairs"
    },
    {
      "code": 6054,
      "name": "LiquidityProvisionOrderPairDoesntMatch",
      "msg": "LiquidityProvisionOrderPairDoesntMatch"
    },
    {
      "code": 6055,
      "name": "OnlyVirtualLpOrdersCanBeWithdrawnByThisFunction",
      "msg": "OnlyVirtualLpOrdersCanBeWithdrawnByThisFunction"
    },
    {
      "code": 6056,
      "name": "OnlyVirtualOrTokenizedLpOrdersCanBeReplacedByThisFunction",
      "msg": "OnlyVirtualOrTokenizedLpOrdersCanBeReplacedByThisFunction"
    },
    {
      "code": 6057,
      "name": "LiquidityProvisionOrderNotEdge",
      "msg": "LiquidityProvisionOrderNotEdge"
    },
    {
      "code": 6058,
      "name": "NftPairBoxNotParsingFromRemaining",
      "msg": "NftPairBoxNotParsingFromRemaining"
    },
    {
      "code": 6059,
      "name": "VaultNftTokenAccountNotParsingFromRemaining",
      "msg": "VaultNftTokenAccountNotParsingFromRemaining"
    },
    {
      "code": 6060,
      "name": "UserTokenAccountNotParsingFromRemaining",
      "msg": "UserTokenAccountNotParsingFromRemaining"
    },
    {
      "code": 6061,
      "name": "WithdrawingOnlyAtLeastOneBuyAndOneSellPairs",
      "msg": "WithdrawingOnlyAtLeastOneBuyAndOneSellPairs"
    },
    {
      "code": 6062,
      "name": "VaultDoesntMatchBox",
      "msg": "VaultDoesntMatchBox"
    },
    {
      "code": 6063,
      "name": "WithdrawingOnlyBuyOrdersPairs",
      "msg": "WithdrawingOnlyBuyOrdersPairs"
    },
    {
      "code": 6064,
      "name": "WithdrawingOnlySellOrdersPairs",
      "msg": "WithdrawingOnlySellOrdersPairs"
    },
    {
      "code": 6065,
      "name": "LiquidityProvisionOrderIsWithdrawn",
      "msg": "LiquidityProvisionOrderIsWithdrawn"
    },
    {
      "code": 6066,
      "name": "LiquidityProvisionOrderIsNotCorrectOrderForPair",
      "msg": "LiquidityProvisionOrderIsNotCorrectOrderForPair"
    },
    {
      "code": 6067,
      "name": "OnlyMarketVirtualPairsCanBeTokenized",
      "msg": "OnlyMarketVirtualPairsCanBeTokenized"
    },
    {
      "code": 6068,
      "name": "OnlyLiquidityProvisionPairsCanBeTokenized",
      "msg": "OnlyLiquidityProvisionPairsCanBeTokenized"
    },
    {
      "code": 6069,
      "name": "OnlyInitializingPairsCanBePutOnMarket",
      "msg": "OnlyInitializingPairsCanBePutOnMarket"
    },
    {
      "code": 6070,
      "name": "CanMakeLpOrderTokenizedOnlyFromTokenizedPair",
      "msg": "CanMakeLpOrderTokenizedOnlyFromTokenizedPair"
    },
    {
      "code": 6071,
      "name": "OnlyVirtualLpOrderCanBeTokenized",
      "msg": "OnlyVirtualLpOrderCanBeTokenized"
    },
    {
      "code": 6072,
      "name": "OnlyTokenizedLpOrdersCanWithdrawFees",
      "msg": "OnlyTokenizedLpOrdersCanWithdrawFees"
    },
    {
      "code": 6073,
      "name": "UserLpTokenAccountDoesntContainNft",
      "msg": "UserLpTokenAccountDoesntContainNft"
    },
    {
      "code": 6074,
      "name": "OnlyTokenizedLpOrdersCanBeWithdrawnByThisFunction",
      "msg": "OnlyTokenizedLpOrdersCanBeWithdrawnByThisFunction"
    },
    {
      "code": 6075,
      "name": "LpTokenMintDoesntMatchOrder",
      "msg": "LpTokenMintDoesntMatchOrder"
    },
    {
      "code": 6076,
      "name": "CanCloseVirtualPoolOnlyIfNoLiquidityLeft",
      "msg": "CanCloseVirtualPoolOnlyIfNoLiquidityLeft"
    },
    {
      "code": 6077,
      "name": "CantSetBidCapSmallerThanMarketMinimum",
      "msg": "CantSetBidCapSmallerThanMarketMinimum"
    },
    {
      "code": 6078,
      "name": "CantDepositNftWithNotMarketDecimals",
      "msg": "CantDepositNftWithNotMarketDecimals"
    },
    {
      "code": 6079,
      "name": "FndAmountCantExceedBidCap",
      "msg": "FndAmountCantExceedBidCap"
    },
    {
      "code": 6080,
      "name": "CantBuyMoreThatRemainingBidSettlement",
      "msg": "CantBuyMoreThatRemainingBidSettlement"
    },
    {
      "code": 6081,
      "name": "CantBuyMoreThanActiveTokensAmount",
      "msg": "CantBuyMoreThanActiveTokensAmount"
    },
    {
      "code": 6082,
      "name": "CantSellMoreThanActiveTokensAmount",
      "msg": "CantSellMoreThanActiveTokensAmount"
    },
    {
      "code": 6083,
      "name": "CantDepositMoreThanBidCap",
      "msg": "CantDepositMoreThanBidCap"
    },
    {
      "code": 6084,
      "name": "CantDepositZero",
      "msg": "CantDepositZero"
    },
    {
      "code": 6085,
      "name": "CantWithdrawMoreThanBidCap",
      "msg": "CantWithdrawMoreThanBidCap"
    },
    {
      "code": 6086,
      "name": "CantWithdrawZero",
      "msg": "CantWithdrawZero"
    },
    {
      "code": 6087,
      "name": "CantWithdrawMoreThanNftBoxActiveTokens",
      "msg": "CantWithdrawMoreThanNftBoxActiveTokens"
    },
    {
      "code": 6088,
      "name": "CantSetReturnAmountLessThanMinimum",
      "msg": "CantSetReturnAmountLessThanMinimum"
    },
    {
      "code": 6089,
      "name": "CantSetBondDuratonLessThanMinimum",
      "msg": "CantSetBondDuratonLessThanMinimum"
    },
    {
      "code": 6090,
      "name": "CanAddCollateralOnlyToInitializedFBond",
      "msg": "CanAddCollateralOnlyToInitializedFBond"
    },
    {
      "code": 6091,
      "name": "OnlyIssuerCanAddCollateralBox",
      "msg": "OnlyIssuerCanAddCollateralBox"
    },
    {
      "code": 6092,
      "name": "FBondTokenMintDoesntMatch",
      "msg": "FBondTokenMintDoesntMatch"
    },
    {
      "code": 6093,
      "name": "CanActivateOnlyInitializedBond",
      "msg": "CanActivateOnlyInitializedBond"
    },
    {
      "code": 6094,
      "name": "BondAuthorityIssuerDoesntMatch",
      "msg": "BondAuthorityIssuerDoesntMatch"
    },
    {
      "code": 6095,
      "name": "CanRepayOnlyActivatedBond",
      "msg": "CanRepayOnlyActivatedBond"
    },
    {
      "code": 6096,
      "name": "CanRedeemOnlyRepaidFBond",
      "msg": "CanRedeemOnlyRepaidFBond"
    },
    {
      "code": 6097,
      "name": "CantSetNotRoundedAmountToReturn",
      "msg": "CantSetNotRoundedAmountToReturn"
    },
    {
      "code": 6098,
      "name": "CanGetOnlyRepaidCollateral",
      "msg": "CanGetOnlyRepaidCollateral"
    },
    {
      "code": 6099,
      "name": "CollateralTokenMintDoesntMatchBox",
      "msg": "CollateralTokenMintDoesntMatchBox"
    },
    {
      "code": 6100,
      "name": "CanLiquidateOnlyActiveFBondWhichEnteredLiquidation",
      "msg": "CanLiquidateOnlyActiveFBondWhichEnteredLiquidation"
    },
    {
      "code": 6101,
      "name": "WrongAdmin",
      "msg": "WrongAdmin"
    },
    {
      "code": 6102,
      "name": "CanBurnEntireSupplyOnlyForActiveBond",
      "msg": "CanBurnEntireSupplyOnlyForActiveBond"
    },
    {
      "code": 6103,
      "name": "UserDoesntOwnAllSupply",
      "msg": "UserDoesntOwnAllSupply"
    },
    {
      "code": 6104,
      "name": "WrongAllSupplyBurner",
      "msg": "WrongAllSupplyBurner"
    },
    {
      "code": 6105,
      "name": "LoanToValueFilterOutOfBound",
      "msg": "LoanToValueFilterOutOfBound"
    },
    {
      "code": 6106,
      "name": "ValidationDoesntMatchPair",
      "msg": "ValidationDoesntMatchPair"
    },
    {
      "code": 6107,
      "name": "CollateralBoxDoesntBelongFbond",
      "msg": "CollateralBoxDoesntBelongFbond"
    },
    {
      "code": 6108,
      "name": "FraktMarketDoesntMatchHadoMarketRegistry",
      "msg": "FraktMarketDoesntMatchHadoMarketRegistry"
    },
    {
      "code": 6109,
      "name": "FraktMarketNotActive",
      "msg": "FraktMarketNotActive"
    },
    {
      "code": 6110,
      "name": "OracleFloorDoesntMatchFraktMarket",
      "msg": "OracleFloorDoesntMatchFraktMarket"
    },
    {
      "code": 6111,
      "name": "FraktMarketDoesntMatchWhitelistEntry",
      "msg": "FraktMarketDoesntMatchWhitelistEntry"
    },
    {
      "code": 6112,
      "name": "ActualLoanToValueExceedsFilter",
      "msg": "ActualLoanToValueExceedsFilter"
    },
    {
      "code": 6113,
      "name": "PairDoesntMatchHadomarket",
      "msg": "PairDoesntMatchHadomarket"
    },
    {
      "code": 6114,
      "name": "ActualLoanDurationExceedsFilter",
      "msg": "ActualLoanDurationExceedsFilter"
    },
    {
      "code": 6115,
      "name": "NftIsNotMasterEdition",
      "msg": "NftIsNotMasterEdition"
    },
    {
      "code": 6116,
      "name": "NftValidationAdapterIsExpired",
      "msg": "NftValidationAdapterIsExpired"
    },
    {
      "code": 6117,
      "name": "CustomValidationAdapterProgramDoesntMatchUser",
      "msg": "CustomValidationAdapterProgramDoesntMatchUser"
    },
    {
      "code": 6118,
      "name": "OnlyAdminCanInitializeFlashLoanPool",
      "msg": "OnlyAdminCanInitializeFlashLoanPool"
    },
    {
      "code": 6119,
      "name": "CantSetLoanFeePointsGreaterThanBasePoints",
      "msg": "CantSetLoanFeePointsGreaterThanBasePoints"
    },
    {
      "code": 6120,
      "name": "OnlyPoolAuthorityCanDepositAndWithdrawLiquidity",
      "msg": "OnlyPoolAuthorityCanDepositAndWithdrawLiquidity"
    },
    {
      "code": 6121,
      "name": "CantWithdrawMoreThanPoolBalance",
      "msg": "CantWithdrawMoreThanPoolBalance"
    },
    {
      "code": 6122,
      "name": "CantBorrowAndRepayByCpi",
      "msg": "CantBorrowAndRepayByCpi"
    },
    {
      "code": 6123,
      "name": "RepayAmountDoesntCorrespondBorrowAmount",
      "msg": "RepayAmountDoesntCorrespondBorrowAmount"
    },
    {
      "code": 6124,
      "name": "TransactionDoesntContainRepayInstruction",
      "msg": "TransactionDoesntContainRepayInstruction"
    },
    {
      "code": 6125,
      "name": "AlreadyBorrowing",
      "msg": "AlreadyBorrowing"
    },
    {
      "code": 6126,
      "name": "WrongHadeswapProgramId",
      "msg": "WrongHadeswapProgramId"
    },
    {
      "code": 6127,
      "name": "AmountToReturnIsHigherThanMax",
      "msg": "AmountToReturnIsHigherThanMax"
    },
    {
      "code": 6128,
      "name": "AutocompoundNotSupportedYet",
      "msg": "AutocompoundNotSupportedYet"
    },
    {
      "code": 6129,
      "name": "AutocompoundDepositIsNotActive",
      "msg": "AutocompoundDepositIsNotActive"
    },
    {
      "code": 6130,
      "name": "AutocompoundDepositDoesntMatchPair",
      "msg": "AutocompoundDepositDoesntMatchPair"
    },
    {
      "code": 6131,
      "name": "OnlyAdminCanRedeemFbondsFromAutocompoundToPair",
      "msg": "OnlyAdminCanRedeemFbondsFromAutocompoundToPair"
    },
    {
      "code": 6132,
      "name": "InvalidAssetReceiverTokenAccount",
      "msg": "InvalidAssetReceiverTokenAccount"
    },
    {
      "code": 6133,
      "name": "AutoreceiveSolToUserFeatureNotEnabled",
      "msg": "AutoreceiveSolToUserFeatureNotEnabled"
    },
    {
      "code": 6134,
      "name": "AutocompoundFeatureNotEnabled",
      "msg": "AutocompoundFeatureNotEnabled"
    },
    {
      "code": 6135,
      "name": "InvalidAssetReceiver",
      "msg": "InvalidAssetReceiver"
    },
    {
      "code": 6136,
      "name": "BondCollateralOrSolReceiverNotUser",
      "msg": "BondCollateralOrSolReceiverNotUser"
    },
    {
      "code": 6137,
      "name": "OnlyBuyPairsAreSupported",
      "msg": "OnlyBuyPairsAreSupported"
    },
    {
      "code": 6138,
      "name": "CanModifyOnlyTokenForNftPairs",
      "msg": "CanModifyOnlyTokenForNftPairs"
    },
    {
      "code": 6139,
      "name": "OraclePriceIsStale",
      "msg": "OraclePriceIsStale"
    },
    {
      "code": 6140,
      "name": "NftLiquidationTimeNotPassed",
      "msg": "NftLiquidationTimeNotPassed"
    },
    {
      "code": 6141,
      "name": "CanDepositReturnedSolOnlyToLiquidatingBond",
      "msg": "CanDepositReturnedSolOnlyToLiquidatingBond"
    },
    {
      "code": 6142,
      "name": "Debugger",
      "msg": "Debugger"
    },
    {
      "code": 6143,
      "name": "NotSupportedSellCase",
      "msg": "NotSupportedSellCase"
    },
    {
      "code": 6144,
      "name": "CollateralTokenMintDoesntMatchAutocompoundDeposit",
      "msg": "CollateralTokenMintDoesntMatchAutocompoundDeposit"
    },
    {
      "code": 6145,
      "name": "NotCorrectAutocompoundType",
      "msg": "NotCorrectAutocompoundType"
    },
    {
      "code": 6146,
      "name": "BadRuleSet",
      "msg": "BadRuleSet"
    },
    {
      "code": 6147,
      "name": "DelegateBuilderFailed",
      "msg": "DelegateBuilderFailed"
    },
    {
      "code": 6148,
      "name": "LockBuilderFailed",
      "msg": "LockBuilderFailed"
    },
    {
      "code": 6149,
      "name": "CanRedeemFromAutocompoundToUserOnlyIfPairClosed",
      "msg": "CanRedeemFromAutocompoundToUserOnlyIfPairClosed"
    },
    {
      "code": 6150,
      "name": "AmountToClaimCantExceedAmountOfBondsInAutocompoundDeposit",
      "msg": "AmountToClaimCantExceedAmountOfBondsInAutocompoundDeposit"
    },
    {
      "code": 6151,
      "name": "CollateralOwnerDoesntMatchCollateralTokenAccount",
      "msg": "CollateralOwnerDoesntMatchCollateralTokenAccount"
    },
    {
      "code": 6152,
      "name": "CanLiquidateOnlyBondsWithBondCollateralOrSolReceiver",
      "msg": "CanLiquidateOnlyBondsWithBondCollateralOrSolReceiver"
    },
    {
      "code": 6153,
      "name": "MerkleTreeIsNotSupported",
      "msg": "MerkleTreeIsNotSupported"
    },
    {
      "code": 6154,
      "name": "UserDoesntHaveEnoughBalance",
      "msg": "UserDoesntHaveEnoughBalance"
    },
    {
      "code": 6155,
      "name": "CantSellToBuggedNegativeInterestPair",
      "msg": "CantSellToBuggedNegativeInterestPair"
    },
    {
      "code": 6156,
      "name": "ThisCollectionIsDisabled",
      "msg": "ThisCollectionIsDisabled"
    },
    {
      "code": 6157,
      "name": "InvalidMutualBondOfferDepositVault",
      "msg": "InvalidMutualBondOfferDepositVault"
    },
    {
      "code": 6158,
      "name": "OnlyBondOfferDepositsAndFullBondAreSupported",
      "msg": "OnlyBondOfferDepositsAndFullBondAreSupported"
    },
    {
      "code": 6159,
      "name": "MerkleTreeWhitelistIsNotSupported",
      "msg": "MerkleTreeWhitelistIsNotSupported"
    },
    {
      "code": 6160,
      "name": "CantSellZero",
      "msg": "CantSellZero"
    },
    {
      "code": 6161,
      "name": "BondOfferHadoMarketDoesntMatch",
      "msg": "BondOfferHadoMarketDoesntMatch"
    },
    {
      "code": 6162,
      "name": "FundsSolVaultPdaIsIncorrect",
      "msg": "FundsSolVaultPdaIsIncorrect"
    },
    {
      "code": 6163,
      "name": "BondTradeTransactionV2PdaIsIncorrect",
      "msg": "BondTradeTransactionV2PdaIsIncorrect"
    },
    {
      "code": 6164,
      "name": "BondBalancesBeforeAndAfterInstructionDontMatch",
      "msg": "BondBalancesBeforeAndAfterInstructionDontMatch"
    },
    {
      "code": 6165,
      "name": "NotAuthorizedToRemoveBondOffer",
      "msg": "NotAuthorizedToRemoveBondOffer"
    },
    {
      "code": 6166,
      "name": "CantUpdateRemovedBondOffer",
      "msg": "CantUpdateRemovedBondOffer"
    },
    {
      "code": 6167,
      "name": "BondTradeTransactionNotActive",
      "msg": "BondTradeTransactionNotActive"
    },
    {
      "code": 6168,
      "name": "BondOfferDoesntMatchTradeTransaction",
      "msg": "BondOfferDoesntMatchTradeTransaction"
    },
    {
      "code": 6169,
      "name": "ReceiveNftIsNotOption",
      "msg": "ReceiveNftIsNotOption"
    },
    {
      "code": 6170,
      "name": "CanLiquidateOnlyActiveBond",
      "msg": "CanLiquidateOnlyActiveBond"
    },
    {
      "code": 6171,
      "name": "CollateralBoxDoesntMatchFbond",
      "msg": "CollateralBoxDoesntMatchFbond"
    },
    {
      "code": 6172,
      "name": "AutocompoundPairShouldBeOnMarketVirtual",
      "msg": "AutocompoundPairShouldBeOnMarketVirtual"
    },
    {
      "code": 6173,
      "name": "UserDoesntOwnHisBondTradeTransaction",
      "msg": "UserDoesntOwnHisBondTradeTransaction"
    },
    {
      "code": 6174,
      "name": "UsersBondTradeTransactionHasIncorrectFbondTokenMint",
      "msg": "UsersBondTradeTransactionHasIncorrectFbondTokenMint"
    },
    {
      "code": 6175,
      "name": "UsersBondTradeTransactionIsInactive",
      "msg": "UsersBondTradeTransactionIsInactive"
    },
    {
      "code": 6176,
      "name": "SumOfBondsInExitingTradeTransactionsDoesntMatchTotalAmountToSell",
      "msg": "SumOfBondsInExitingTradeTransactionsDoesntMatchTotalAmountToSell"
    },
    {
      "code": 6177,
      "name": "CantSellNotFullBondsSupplyOnRefinance",
      "msg": "CantSellNotFullBondsSupplyOnRefinance"
    },
    {
      "code": 6178,
      "name": "OnlyAdminCanMigrate",
      "msg": "OnlyAdminCanMigrate"
    },
    {
      "code": 6179,
      "name": "BondFeaturesNoneAndReceiveNftOnLiquidationAreNotSupported",
      "msg": "BondFeaturesNoneAndReceiveNftOnLiquidationAreNotSupported"
    },
    {
      "code": 6180,
      "name": "SomethingWrongWithMigrationBondOfferIsMissing",
      "msg": "SomethingWrongWithMigrationBondOfferIsMissing"
    },
    {
      "code": 6181,
      "name": "SecondAddressIsNotUserOrBondOffer",
      "msg": "SecondAddressIsNotUserOrBondOffer"
    },
    {
      "code": 6182,
      "name": "SumOfBondsInRepayDoesntMatchBondsSupply",
      "msg": "SumOfBondsInRepayDoesntMatchBondsSupply"
    },
    {
      "code": 6183,
      "name": "CantBuyoutForLowerThanMinimumPrice",
      "msg": "CantBuyoutForLowerThanMinimumPrice"
    },
    {
      "code": 6184,
      "name": "CantBuyoutNftOnDutchAuctionWhenThereAreOnlyOneLender",
      "msg": "CantBuyoutNftOnDutchAuctionWhenThereAreOnlyOneLender"
    },
    {
      "code": 6185,
      "name": "ThereAreMoreThanOneLenderOfThisBond",
      "msg": "ThereAreMoreThanOneLenderOfThisBond"
    },
    {
      "code": 6186,
      "name": "TradeTransactionDoesntMatchBond",
      "msg": "TradeTransactionDoesntMatchBond"
    },
    {
      "code": 6187,
      "name": "CantLiquidatePerpetualBonds",
      "msg": "CantLiquidatePerpetualBonds"
    },
    {
      "code": 6188,
      "name": "CantRepayExpiredReceivingCollateralLoan",
      "msg": "CantRepayExpiredReceivingCollateralLoan"
    },
    {
      "code": 6189,
      "name": "DisabledPairsWithMoreThanOneOrder",
      "msg": "DisabledPairsWithMoreThanOneOrder"
    }
  ]
};

export const IDL: Bonds = {
  "version": "0.1.0",
  "name": "bonds",
  "instructions": [
    {
      "name": "boundHadoMarketToFraktMarket",
      "accounts": [
        {
          "name": "hadoMarket",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fraktMarket",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "hadoRegistry",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "createBondOfferV2",
      "accounts": [
        {
          "name": "bondOfferV2",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "hadoMarket",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bondOfferRandomSeed",
          "type": "u64"
        },
        {
          "name": "params",
          "type": {
            "defined": "PairParams"
          }
        },
        {
          "name": "bondingCurveType",
          "type": {
            "defined": "BondOfferBondingCurveType"
          }
        },
        {
          "name": "amountOfTokensToBuy",
          "type": "u64"
        },
        {
          "name": "loanToValueFilter",
          "type": "u64"
        },
        {
          "name": "durationFilter",
          "type": "u64"
        },
        {
          "name": "maxReturnAmountFilter",
          "type": "u64"
        },
        {
          "name": "bondFeatures",
          "type": {
            "defined": "BondFeatures"
          }
        }
      ]
    },
    {
      "name": "updateBondOfferV2",
      "accounts": [
        {
          "name": "bondOfferV2",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "PairParams"
          }
        },
        {
          "name": "loanToValueFilter",
          "type": "u64"
        },
        {
          "name": "durationFilter",
          "type": "u64"
        },
        {
          "name": "maxReturnAmountFilter",
          "type": "u64"
        }
      ]
    },
    {
      "name": "depositToBondOfferV2",
      "accounts": [
        {
          "name": "bondOfferV2",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amountOfTokensToBuy",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdrawFromBondOfferV2",
      "accounts": [
        {
          "name": "bondOfferV2",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amountOfTokensToWithdraw",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initializeHadoMarket",
      "accounts": [
        {
          "name": "hadoMarket",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "validationAdapterProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK Custom validation adapter"
          ]
        },
        {
          "name": "pairTokenMint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK Custom token mint"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "marketParams",
          "type": {
            "defined": "InitializeHadoMarketParams"
          }
        }
      ]
    },
    {
      "name": "finishHadoMarket",
      "accounts": [
        {
          "name": "hadoMarket",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "removeBondOfferV2",
      "accounts": [
        {
          "name": "bondOfferV2",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "repayFbondToTradeTransactions",
      "accounts": [
        {
          "name": "collateralBox",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fbond",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bondProgramAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fbondTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authRules",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "editionInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ownerTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "instructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authorizationRulesProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK : admin address"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userFbondTokenAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "authorizationData",
          "type": {
            "option": {
              "defined": "AuthorizationDataLocal"
            }
          }
        }
      ]
    },
    {
      "name": "exitValidateAndSellToBondOffersV2",
      "accounts": [
        {
          "name": "collateralBox",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fbond",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fbondTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "hadoRegistry",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fraktMarket",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleFloor",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "whitelistEntry",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "protocolFeeReceiver",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "editionInfo",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "sellBondParams",
          "type": {
            "vec": {
              "defined": "SellBondParams"
            }
          }
        }
      ]
    },
    {
      "name": "refinanceToBondOffersV2",
      "accounts": [
        {
          "name": "collateralBox",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fbond",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bondProgramAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fbondTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "newFbondTokenMint",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "hadoRegistry",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fraktMarket",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleFloor",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "whitelistEntry",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK : admin address"
          ]
        },
        {
          "name": "assetReceiverOrAutocompoundDepositTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userFbondTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "newFbond",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "newBondProgramAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userNewFbondTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "newCollateralTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "newCollateralBox",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mutualBondTradeTxnVault",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK vault for sol"
          ]
        },
        {
          "name": "protocolFeeReceiver",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "editionInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ownerTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "instructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authorizationRulesProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "newFbondBumps",
          "type": {
            "defined": "FBondBumps"
          }
        },
        {
          "name": "newFbondParams",
          "type": {
            "defined": "FBondParams"
          }
        },
        {
          "name": "authorizationData",
          "type": {
            "option": {
              "defined": "AuthorizationDataLocal"
            }
          }
        },
        {
          "name": "sellBondParams",
          "type": {
            "vec": {
              "defined": "SellBondParams"
            }
          }
        }
      ]
    },
    {
      "name": "createBondAndSellToOffers",
      "accounts": [
        {
          "name": "fbond",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "bondProgramAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fbondTokenMint",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "collateralBox",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "hadoRegistry",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fraktMarket",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleFloor",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "whitelistEntry",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "assetReceiverOrAutocompoundDepositTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mutualBondTradeTxnVault",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK vault for sol"
          ]
        },
        {
          "name": "protocolFeeReceiver",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "editionInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ownerTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "instructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authorizationRulesProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bumps",
          "type": {
            "defined": "FBondBumps"
          }
        },
        {
          "name": "amountToDeposit",
          "type": "u64"
        },
        {
          "name": "params",
          "type": {
            "defined": "FBondParams"
          }
        },
        {
          "name": "authorizationData",
          "type": {
            "option": {
              "defined": "AuthorizationDataLocal"
            }
          }
        },
        {
          "name": "sellBondParams",
          "type": {
            "vec": {
              "defined": "SellBondParams"
            }
          }
        }
      ]
    },
    {
      "name": "liquidateBondOnAuction",
      "accounts": [
        {
          "name": "collateralBox",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fbond",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bondProgramAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralOwner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "fraktMarket",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleFloor",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "whitelistEntry",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "returnFundsOwner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "editionInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ownerTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "instructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authorizationRulesProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK : admin address"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "authorizationData",
          "type": {
            "option": {
              "defined": "AuthorizationDataLocal"
            }
          }
        }
      ]
    },
    {
      "name": "liquidateBondOnAuctionPnft",
      "accounts": [
        {
          "name": "collateralBox",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fbond",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bondProgramAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "middleTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bondProgramAuthorityTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralOwner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "fraktMarket",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleFloor",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "whitelistEntry",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "returnFundsOwner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "editionInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ownerTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "instructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authorizationRulesProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK : admin address"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "authorizationData",
          "type": {
            "option": {
              "defined": "AuthorizationDataLocal"
            }
          }
        }
      ]
    },
    {
      "name": "claimNftByLender",
      "accounts": [
        {
          "name": "collateralBox",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fbond",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fbondTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bondTradeTxnTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mutualBondTradeTxnVault",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK vault for sol"
          ]
        },
        {
          "name": "bondTradeTransactionV2",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bondProgramAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralOwner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "editionInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ownerTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "instructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authorizationRulesProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "authorizationData",
          "type": {
            "option": {
              "defined": "AuthorizationDataLocal"
            }
          }
        }
      ]
    },
    {
      "name": "claimNftByLenderPnft",
      "accounts": [
        {
          "name": "collateralBox",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fbond",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fbondTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bondTradeTxnTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "middleTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bondProgramAuthorityTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mutualBondTradeTxnVault",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK vault for sol"
          ]
        },
        {
          "name": "bondTradeTransactionV2",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bondProgramAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralOwner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "editionInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ownerTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "instructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authorizationRulesProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "authorizationData",
          "type": {
            "option": {
              "defined": "AuthorizationDataLocal"
            }
          }
        }
      ]
    },
    {
      "name": "createBondAndSellToOffersForTest",
      "accounts": [
        {
          "name": "fbond",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "bondProgramAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fbondTokenMint",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "collateralBox",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "hadoRegistry",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fraktMarket",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleFloor",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "whitelistEntry",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "assetReceiverOrAutocompoundDepositTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mutualBondTradeTxnVault",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK vault for sol"
          ]
        },
        {
          "name": "protocolFeeReceiver",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "editionInfo",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ownerTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destTokenRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "instructions",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authorizationRulesProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bumps",
          "type": {
            "defined": "FBondBumps"
          }
        },
        {
          "name": "amountToDeposit",
          "type": "u64"
        },
        {
          "name": "params",
          "type": {
            "defined": "FBondParams"
          }
        },
        {
          "name": "authorizationData",
          "type": {
            "option": {
              "defined": "AuthorizationDataLocal"
            }
          }
        },
        {
          "name": "sellBondParams",
          "type": {
            "vec": {
              "defined": "SellBondParams"
            }
          }
        }
      ]
    },
    {
      "name": "patchBondOffer",
      "accounts": [
        {
          "name": "bondOfferV2",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "collateralBox",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "fbond",
            "type": "publicKey"
          },
          {
            "name": "collateralBoxType",
            "type": {
              "defined": "CollateralBoxType"
            }
          },
          {
            "name": "collateralTokenMint",
            "type": "publicKey"
          },
          {
            "name": "collateralTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "collateralAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "fraktBond",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "fraktBondState",
            "type": {
              "defined": "FraktBondState"
            }
          },
          {
            "name": "bondTradeTransactionsCounter",
            "type": "u8"
          },
          {
            "name": "collateralBoxesQuantity",
            "type": "u64"
          },
          {
            "name": "returnTokenMint",
            "type": "publicKey"
          },
          {
            "name": "fraktMarket",
            "type": "publicKey"
          },
          {
            "name": "amountToReturn",
            "type": "u64"
          },
          {
            "name": "actualReturnedAmount",
            "type": "u64"
          },
          {
            "name": "terminatedCounter",
            "type": "u8"
          },
          {
            "name": "fbondTokenMint",
            "type": "publicKey"
          },
          {
            "name": "fbondTokenSupply",
            "type": "u64"
          },
          {
            "name": "activatedAt",
            "type": "u64"
          },
          {
            "name": "liquidatingAt",
            "type": "u64"
          },
          {
            "name": "fbondIssuer",
            "type": "publicKey"
          },
          {
            "name": "bondCollateralOrSolReceiver",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "hadoMarketRegistry",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "hadoMarket",
            "type": "publicKey"
          },
          {
            "name": "fraktMarket",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "hadoMarket",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "marketAuthority",
            "type": "publicKey"
          },
          {
            "name": "marketState",
            "type": {
              "defined": "MarketState"
            }
          },
          {
            "name": "marketTrustType",
            "type": {
              "defined": "MarketTrustType"
            }
          },
          {
            "name": "pairValidationType",
            "type": {
              "defined": "PairValidationType"
            }
          },
          {
            "name": "validationAdapterProgram",
            "type": "publicKey"
          },
          {
            "name": "minBidCap",
            "type": "u64"
          },
          {
            "name": "minMarketFee",
            "type": "u64"
          },
          {
            "name": "pairTokenType",
            "type": {
              "defined": "PairTokenType"
            }
          },
          {
            "name": "pairTokenMint",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "bondOfferV2",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "hadoMarket",
            "type": "publicKey"
          },
          {
            "name": "pairState",
            "type": {
              "defined": "PairState"
            }
          },
          {
            "name": "bondingCurve",
            "type": {
              "defined": "BondOfferBondingCurve"
            }
          },
          {
            "name": "baseSpotPrice",
            "type": "u64"
          },
          {
            "name": "mathCounter",
            "type": "i64"
          },
          {
            "name": "currentSpotPrice",
            "type": "u64"
          },
          {
            "name": "concentrationIndex",
            "type": "u64"
          },
          {
            "name": "bidCap",
            "type": "u64"
          },
          {
            "name": "bidSettlement",
            "type": "i64"
          },
          {
            "name": "edgeSettlement",
            "type": "u64"
          },
          {
            "name": "fundsSolOrTokenBalance",
            "type": "u64"
          },
          {
            "name": "buyOrdersQuantity",
            "type": "u64"
          },
          {
            "name": "lastTransactedAt",
            "type": "u64"
          },
          {
            "name": "assetReceiver",
            "type": "publicKey"
          },
          {
            "name": "validation",
            "type": {
              "defined": "BondOfferValidation"
            }
          }
        ]
      }
    },
    {
      "name": "bondTradeTransactionV2",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bondTradeTransactionState",
            "type": {
              "defined": "BondTradeTransactionV2State"
            }
          },
          {
            "name": "bondOffer",
            "type": "publicKey"
          },
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "amountOfBonds",
            "type": "u64"
          },
          {
            "name": "solAmount",
            "type": "u64"
          },
          {
            "name": "feeAmount",
            "type": "u64"
          },
          {
            "name": "bondTradeTransactionType",
            "type": {
              "defined": "BondTradeTransactionV2Type"
            }
          },
          {
            "name": "fbondTokenMint",
            "type": "publicKey"
          },
          {
            "name": "soldAt",
            "type": "u64"
          },
          {
            "name": "redeemedAt",
            "type": "u64"
          },
          {
            "name": "redeemResult",
            "type": {
              "defined": "RedeemResult"
            }
          },
          {
            "name": "seller",
            "type": "publicKey"
          },
          {
            "name": "isDirectSell",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "SellBondParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "minAmountToGet",
            "type": "u64"
          },
          {
            "name": "amountToSell",
            "type": "u64"
          },
          {
            "name": "bondTradeTransactionV2Bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "FBondParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amountToReturn",
            "type": "u64"
          },
          {
            "name": "bondDuration",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "FBondBumps",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "PairParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "delta",
            "type": "u64"
          },
          {
            "name": "spotPrice",
            "type": "u64"
          },
          {
            "name": "fee",
            "type": "u64"
          },
          {
            "name": "bidCap",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "PairBumps",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "fundsSolVaultSeed",
            "type": "u8"
          },
          {
            "name": "feeVaultSeed",
            "type": "u8"
          },
          {
            "name": "nftsSeed",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "InitializeHadoMarketParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "minBidCap",
            "type": "u64"
          },
          {
            "name": "minMarketFee",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "BondOfferValidation",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "loanToValueFilter",
            "type": "u64"
          },
          {
            "name": "durationFilter",
            "type": "u64"
          },
          {
            "name": "maxReturnAmountFilter",
            "type": "u64"
          },
          {
            "name": "bondFeatures",
            "type": {
              "defined": "BondFeatures"
            }
          }
        ]
      }
    },
    {
      "name": "BondOfferBondingCurve",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "delta",
            "type": "u64"
          },
          {
            "name": "bondingType",
            "type": {
              "defined": "BondOfferBondingCurveType"
            }
          }
        ]
      }
    },
    {
      "name": "AuthorizationDataLocal",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "payload",
            "type": {
              "vec": {
                "defined": "TaggedPayload"
              }
            }
          }
        ]
      }
    },
    {
      "name": "TaggedPayload",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "payload",
            "type": {
              "defined": "PayloadTypeLocal"
            }
          }
        ]
      }
    },
    {
      "name": "SeedsVecLocal",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "seeds",
            "docs": [
              "The vector of derivation seeds."
            ],
            "type": {
              "vec": "bytes"
            }
          }
        ]
      }
    },
    {
      "name": "ProofInfoLocal",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "proof",
            "docs": [
              "The merkle proof."
            ],
            "type": {
              "vec": {
                "array": [
                  "u8",
                  32
                ]
              }
            }
          }
        ]
      }
    },
    {
      "name": "CollateralBoxType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Escrow"
          },
          {
            "name": "Escrowless"
          }
        ]
      }
    },
    {
      "name": "FraktBondState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Initialized"
          },
          {
            "name": "Active"
          },
          {
            "name": "Repaid"
          },
          {
            "name": "Liquidating"
          },
          {
            "name": "Liquidated"
          }
        ]
      }
    },
    {
      "name": "MarketTrustType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Unverified"
          },
          {
            "name": "Verified"
          }
        ]
      }
    },
    {
      "name": "MarketState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Initializing"
          },
          {
            "name": "Available"
          }
        ]
      }
    },
    {
      "name": "PairValidationType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "ClassicValidation"
          },
          {
            "name": "CustomValidation"
          }
        ]
      }
    },
    {
      "name": "PairTokenType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "NativeSol"
          },
          {
            "name": "Spl"
          }
        ]
      }
    },
    {
      "name": "BondFeatures",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "None"
          },
          {
            "name": "Autocompound"
          },
          {
            "name": "ReceiveNftOnLiquidation"
          },
          {
            "name": "AutoreceiveSol"
          },
          {
            "name": "AutoCompoundAndReceiveNft"
          },
          {
            "name": "AutoReceiveAndReceiveNft"
          }
        ]
      }
    },
    {
      "name": "PairState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Initializing"
          },
          {
            "name": "OnMarketVirtual"
          },
          {
            "name": "OnMarketTokenized"
          },
          {
            "name": "Frozen"
          },
          {
            "name": "Closed"
          }
        ]
      }
    },
    {
      "name": "BondOfferBondingCurveType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Linear"
          },
          {
            "name": "Exponential"
          }
        ]
      }
    },
    {
      "name": "BondTradeTransactionV2State",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "NotActive"
          },
          {
            "name": "Active"
          }
        ]
      }
    },
    {
      "name": "BondTradeTransactionV2Type",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "None"
          },
          {
            "name": "Autocompound"
          },
          {
            "name": "ReceiveNftOnLiquidation"
          },
          {
            "name": "AutoreceiveSol"
          },
          {
            "name": "AutoCompoundAndReceiveNft"
          },
          {
            "name": "AutoReceiveAndReceiveNft"
          }
        ]
      }
    },
    {
      "name": "RedeemResult",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "None"
          },
          {
            "name": "AutoReceiveSol"
          },
          {
            "name": "Autocompound"
          },
          {
            "name": "Nft"
          },
          {
            "name": "ExitSol"
          }
        ]
      }
    },
    {
      "name": "PayloadTypeLocal",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Pubkey",
            "fields": [
              "publicKey"
            ]
          },
          {
            "name": "Seeds",
            "fields": [
              {
                "defined": "SeedsVecLocal"
              }
            ]
          },
          {
            "name": "MerkleProof",
            "fields": [
              {
                "defined": "ProofInfoLocal"
              }
            ]
          },
          {
            "name": "Number",
            "fields": [
              "u64"
            ]
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "MetadataDoesntExist",
      "msg": "MetadataDoesntExist"
    },
    {
      "code": 6001,
      "name": "DerivedKeyInvalid",
      "msg": "DerivedKeyInvalid"
    },
    {
      "code": 6002,
      "name": "InvalidCollectionDetails",
      "msg": "InvalidCollectionDetails"
    },
    {
      "code": 6003,
      "name": "InvalidCollection",
      "msg": "InvalidCollection"
    },
    {
      "code": 6004,
      "name": "InvalidCollectionMint",
      "msg": "InvalidCollectionMint"
    },
    {
      "code": 6005,
      "name": "NftNotVerified",
      "msg": "NftNotVerified"
    },
    {
      "code": 6006,
      "name": "InvalidOwner",
      "msg": "InvalidOwner"
    },
    {
      "code": 6007,
      "name": "InvalidDelta",
      "msg": "InvalidDelta"
    },
    {
      "code": 6008,
      "name": "InvalidFee",
      "msg": "InvalidFee"
    },
    {
      "code": 6009,
      "name": "InvalidPairType",
      "msg": "InvalidPairType"
    },
    {
      "code": 6010,
      "name": "NotEnoughInTokenAccount",
      "msg": "NotEnoughInTokenAccount"
    },
    {
      "code": 6011,
      "name": "InvalidMint",
      "msg": "InvalidMint"
    },
    {
      "code": 6012,
      "name": "InvalidSolVault",
      "msg": "InvalidSolVault"
    },
    {
      "code": 6013,
      "name": "InvalidFundingAmount",
      "msg": "InvalidFundingAmount"
    },
    {
      "code": 6014,
      "name": "NotEnoughLamports",
      "msg": "NotEnoughLamports"
    },
    {
      "code": 6015,
      "name": "InvalidJpegOwner",
      "msg": "InvalidJpegOwner"
    },
    {
      "code": 6016,
      "name": "InvalidTokenAccount",
      "msg": "InvalidTokenAccount"
    },
    {
      "code": 6017,
      "name": "InvalidPayer",
      "msg": "InvalidPayer"
    },
    {
      "code": 6018,
      "name": "ShouldBeActive",
      "msg": "ShouldBeActive"
    },
    {
      "code": 6019,
      "name": "CantMakeZeroOrders",
      "msg": "Can't make 0 orders"
    },
    {
      "code": 6020,
      "name": "OnlyClassicAuthority",
      "msg": "OnlyClassicAuthority"
    },
    {
      "code": 6021,
      "name": "NotValidAuthorityAdapter",
      "msg": "NotValidAuthorityAdapter"
    },
    {
      "code": 6022,
      "name": "UserDoesntHaveAuthority",
      "msg": "UserDoesntHaveAuthority"
    },
    {
      "code": 6023,
      "name": "WrongSeed",
      "msg": "WrongSeed"
    },
    {
      "code": 6024,
      "name": "CanDepositSolOnlyToTokenToNft",
      "msg": "CanDepositSolOnlyToTokenToNft"
    },
    {
      "code": 6025,
      "name": "MaxAmountOfOrdersSucceeded",
      "msg": "MaxAmountOfOrdersSucceeded"
    },
    {
      "code": 6026,
      "name": "CanDepositNftOnlyToNftToToken",
      "msg": "CanDepositNftOnlyToNftToToken"
    },
    {
      "code": 6027,
      "name": "TokenAccountDoesntContainNft",
      "msg": "TokenAccountDoesntContainNft"
    },
    {
      "code": 6028,
      "name": "MarketAuthorityIncorrect",
      "msg": "MarketAuthorityIncorrect"
    },
    {
      "code": 6029,
      "name": "CanAddWhitelistOnlyToInitializingMarket",
      "msg": "CanAddWhitelistOnlyToInitializingMarket"
    },
    {
      "code": 6030,
      "name": "CanPutPairsOnlyToAvailableMarkets",
      "msg": "CanPutPairsOnlyToAvailableMarkets"
    },
    {
      "code": 6031,
      "name": "PairAndNftValidationMarketDoesntMatch",
      "msg": "PairAndNftValidationMarketDoesntMatch"
    },
    {
      "code": 6032,
      "name": "OnlyMarketScopeSupported",
      "msg": "OnlyMarketScopeSupported"
    },
    {
      "code": 6033,
      "name": "NotWhitelistedNftForThisMarket",
      "msg": "NotWhitelistedNftForThisMarket"
    },
    {
      "code": 6034,
      "name": "CanDepositOnlyToLiquidityProvision",
      "msg": "CanDepositOnlyToLiquidityProvision"
    },
    {
      "code": 6035,
      "name": "NftBoxDoesntMatchPair",
      "msg": "NftBoxDoesntMatchPair"
    },
    {
      "code": 6036,
      "name": "NftBoxShouldBeActive",
      "msg": "NftBoxShouldBeActive"
    },
    {
      "code": 6037,
      "name": "NftBoxDoesntMatchMint",
      "msg": "NftBoxDoesntMatchMint"
    },
    {
      "code": 6038,
      "name": "CantBuyNftFromTokenForNft",
      "msg": "CantBuyNftFromTokenForNft"
    },
    {
      "code": 6039,
      "name": "OnlyTokenForNftIsEligibleForThisSell",
      "msg": "OnlyTokenForNftIsEligibleForThisSell"
    },
    {
      "code": 6040,
      "name": "NoBuyOrdersOnThisPair",
      "msg": "NoBuyOrdersOnThisPair"
    },
    {
      "code": 6041,
      "name": "OnlyLiquidityProvisionIsEligibleForThisSell",
      "msg": "OnlyLiquidityProvisionIsEligibleForThisSell"
    },
    {
      "code": 6042,
      "name": "OnlyTokenForNftIsEligibleForThisWithdrawal",
      "msg": "OnlyTokenForNftIsEligibleForThisWithdrawal"
    },
    {
      "code": 6043,
      "name": "OnlyNftForTokenIsEligibleForThisWithdrawal",
      "msg": "OnlyNftForTokenIsEligibleForThisWithdrawal"
    },
    {
      "code": 6044,
      "name": "OnlyLiquidityProvisionIsEligibleForThisWithdrawal",
      "msg": "OnlyLiquidityProvisionIsEligibleForThisWithdrawal"
    },
    {
      "code": 6045,
      "name": "InstructionIsNotSupported",
      "msg": "InstructionIsNotSupported"
    },
    {
      "code": 6046,
      "name": "CanTradeOnlyWithPairsOnMarket",
      "msg": "CanTradeOnlyWithPairsOnMarket"
    },
    {
      "code": 6047,
      "name": "NoLiquidityFeesToWithdraw",
      "msg": "NoLiquidityFeesToWithdraw"
    },
    {
      "code": 6048,
      "name": "MaxAmountToPayExceeded",
      "msg": "MaxAmountToPayExceeded"
    },
    {
      "code": 6049,
      "name": "GettingLessThanMinAmountToGet",
      "msg": "GettingLessThanMinAmountToGet"
    },
    {
      "code": 6050,
      "name": "UserDoesntHaveHadomarketAuthority",
      "msg": "UserDoesntHaveHadomarketAuthority"
    },
    {
      "code": 6051,
      "name": "HadomarketAlreadyFinished",
      "msg": "HadomarketAlreadyFinished"
    },
    {
      "code": 6052,
      "name": "CanDepositLiqudityOnlyToVirtualOrInitializingPairs",
      "msg": "CanDepositLiqudityOnlyToVirtualOrInitializingPairs"
    },
    {
      "code": 6053,
      "name": "CanModifyOnlyToVirtualOrInitializingPairs",
      "msg": "CanModifyOnlyToVirtualOrInitializingPairs"
    },
    {
      "code": 6054,
      "name": "LiquidityProvisionOrderPairDoesntMatch",
      "msg": "LiquidityProvisionOrderPairDoesntMatch"
    },
    {
      "code": 6055,
      "name": "OnlyVirtualLpOrdersCanBeWithdrawnByThisFunction",
      "msg": "OnlyVirtualLpOrdersCanBeWithdrawnByThisFunction"
    },
    {
      "code": 6056,
      "name": "OnlyVirtualOrTokenizedLpOrdersCanBeReplacedByThisFunction",
      "msg": "OnlyVirtualOrTokenizedLpOrdersCanBeReplacedByThisFunction"
    },
    {
      "code": 6057,
      "name": "LiquidityProvisionOrderNotEdge",
      "msg": "LiquidityProvisionOrderNotEdge"
    },
    {
      "code": 6058,
      "name": "NftPairBoxNotParsingFromRemaining",
      "msg": "NftPairBoxNotParsingFromRemaining"
    },
    {
      "code": 6059,
      "name": "VaultNftTokenAccountNotParsingFromRemaining",
      "msg": "VaultNftTokenAccountNotParsingFromRemaining"
    },
    {
      "code": 6060,
      "name": "UserTokenAccountNotParsingFromRemaining",
      "msg": "UserTokenAccountNotParsingFromRemaining"
    },
    {
      "code": 6061,
      "name": "WithdrawingOnlyAtLeastOneBuyAndOneSellPairs",
      "msg": "WithdrawingOnlyAtLeastOneBuyAndOneSellPairs"
    },
    {
      "code": 6062,
      "name": "VaultDoesntMatchBox",
      "msg": "VaultDoesntMatchBox"
    },
    {
      "code": 6063,
      "name": "WithdrawingOnlyBuyOrdersPairs",
      "msg": "WithdrawingOnlyBuyOrdersPairs"
    },
    {
      "code": 6064,
      "name": "WithdrawingOnlySellOrdersPairs",
      "msg": "WithdrawingOnlySellOrdersPairs"
    },
    {
      "code": 6065,
      "name": "LiquidityProvisionOrderIsWithdrawn",
      "msg": "LiquidityProvisionOrderIsWithdrawn"
    },
    {
      "code": 6066,
      "name": "LiquidityProvisionOrderIsNotCorrectOrderForPair",
      "msg": "LiquidityProvisionOrderIsNotCorrectOrderForPair"
    },
    {
      "code": 6067,
      "name": "OnlyMarketVirtualPairsCanBeTokenized",
      "msg": "OnlyMarketVirtualPairsCanBeTokenized"
    },
    {
      "code": 6068,
      "name": "OnlyLiquidityProvisionPairsCanBeTokenized",
      "msg": "OnlyLiquidityProvisionPairsCanBeTokenized"
    },
    {
      "code": 6069,
      "name": "OnlyInitializingPairsCanBePutOnMarket",
      "msg": "OnlyInitializingPairsCanBePutOnMarket"
    },
    {
      "code": 6070,
      "name": "CanMakeLpOrderTokenizedOnlyFromTokenizedPair",
      "msg": "CanMakeLpOrderTokenizedOnlyFromTokenizedPair"
    },
    {
      "code": 6071,
      "name": "OnlyVirtualLpOrderCanBeTokenized",
      "msg": "OnlyVirtualLpOrderCanBeTokenized"
    },
    {
      "code": 6072,
      "name": "OnlyTokenizedLpOrdersCanWithdrawFees",
      "msg": "OnlyTokenizedLpOrdersCanWithdrawFees"
    },
    {
      "code": 6073,
      "name": "UserLpTokenAccountDoesntContainNft",
      "msg": "UserLpTokenAccountDoesntContainNft"
    },
    {
      "code": 6074,
      "name": "OnlyTokenizedLpOrdersCanBeWithdrawnByThisFunction",
      "msg": "OnlyTokenizedLpOrdersCanBeWithdrawnByThisFunction"
    },
    {
      "code": 6075,
      "name": "LpTokenMintDoesntMatchOrder",
      "msg": "LpTokenMintDoesntMatchOrder"
    },
    {
      "code": 6076,
      "name": "CanCloseVirtualPoolOnlyIfNoLiquidityLeft",
      "msg": "CanCloseVirtualPoolOnlyIfNoLiquidityLeft"
    },
    {
      "code": 6077,
      "name": "CantSetBidCapSmallerThanMarketMinimum",
      "msg": "CantSetBidCapSmallerThanMarketMinimum"
    },
    {
      "code": 6078,
      "name": "CantDepositNftWithNotMarketDecimals",
      "msg": "CantDepositNftWithNotMarketDecimals"
    },
    {
      "code": 6079,
      "name": "FndAmountCantExceedBidCap",
      "msg": "FndAmountCantExceedBidCap"
    },
    {
      "code": 6080,
      "name": "CantBuyMoreThatRemainingBidSettlement",
      "msg": "CantBuyMoreThatRemainingBidSettlement"
    },
    {
      "code": 6081,
      "name": "CantBuyMoreThanActiveTokensAmount",
      "msg": "CantBuyMoreThanActiveTokensAmount"
    },
    {
      "code": 6082,
      "name": "CantSellMoreThanActiveTokensAmount",
      "msg": "CantSellMoreThanActiveTokensAmount"
    },
    {
      "code": 6083,
      "name": "CantDepositMoreThanBidCap",
      "msg": "CantDepositMoreThanBidCap"
    },
    {
      "code": 6084,
      "name": "CantDepositZero",
      "msg": "CantDepositZero"
    },
    {
      "code": 6085,
      "name": "CantWithdrawMoreThanBidCap",
      "msg": "CantWithdrawMoreThanBidCap"
    },
    {
      "code": 6086,
      "name": "CantWithdrawZero",
      "msg": "CantWithdrawZero"
    },
    {
      "code": 6087,
      "name": "CantWithdrawMoreThanNftBoxActiveTokens",
      "msg": "CantWithdrawMoreThanNftBoxActiveTokens"
    },
    {
      "code": 6088,
      "name": "CantSetReturnAmountLessThanMinimum",
      "msg": "CantSetReturnAmountLessThanMinimum"
    },
    {
      "code": 6089,
      "name": "CantSetBondDuratonLessThanMinimum",
      "msg": "CantSetBondDuratonLessThanMinimum"
    },
    {
      "code": 6090,
      "name": "CanAddCollateralOnlyToInitializedFBond",
      "msg": "CanAddCollateralOnlyToInitializedFBond"
    },
    {
      "code": 6091,
      "name": "OnlyIssuerCanAddCollateralBox",
      "msg": "OnlyIssuerCanAddCollateralBox"
    },
    {
      "code": 6092,
      "name": "FBondTokenMintDoesntMatch",
      "msg": "FBondTokenMintDoesntMatch"
    },
    {
      "code": 6093,
      "name": "CanActivateOnlyInitializedBond",
      "msg": "CanActivateOnlyInitializedBond"
    },
    {
      "code": 6094,
      "name": "BondAuthorityIssuerDoesntMatch",
      "msg": "BondAuthorityIssuerDoesntMatch"
    },
    {
      "code": 6095,
      "name": "CanRepayOnlyActivatedBond",
      "msg": "CanRepayOnlyActivatedBond"
    },
    {
      "code": 6096,
      "name": "CanRedeemOnlyRepaidFBond",
      "msg": "CanRedeemOnlyRepaidFBond"
    },
    {
      "code": 6097,
      "name": "CantSetNotRoundedAmountToReturn",
      "msg": "CantSetNotRoundedAmountToReturn"
    },
    {
      "code": 6098,
      "name": "CanGetOnlyRepaidCollateral",
      "msg": "CanGetOnlyRepaidCollateral"
    },
    {
      "code": 6099,
      "name": "CollateralTokenMintDoesntMatchBox",
      "msg": "CollateralTokenMintDoesntMatchBox"
    },
    {
      "code": 6100,
      "name": "CanLiquidateOnlyActiveFBondWhichEnteredLiquidation",
      "msg": "CanLiquidateOnlyActiveFBondWhichEnteredLiquidation"
    },
    {
      "code": 6101,
      "name": "WrongAdmin",
      "msg": "WrongAdmin"
    },
    {
      "code": 6102,
      "name": "CanBurnEntireSupplyOnlyForActiveBond",
      "msg": "CanBurnEntireSupplyOnlyForActiveBond"
    },
    {
      "code": 6103,
      "name": "UserDoesntOwnAllSupply",
      "msg": "UserDoesntOwnAllSupply"
    },
    {
      "code": 6104,
      "name": "WrongAllSupplyBurner",
      "msg": "WrongAllSupplyBurner"
    },
    {
      "code": 6105,
      "name": "LoanToValueFilterOutOfBound",
      "msg": "LoanToValueFilterOutOfBound"
    },
    {
      "code": 6106,
      "name": "ValidationDoesntMatchPair",
      "msg": "ValidationDoesntMatchPair"
    },
    {
      "code": 6107,
      "name": "CollateralBoxDoesntBelongFbond",
      "msg": "CollateralBoxDoesntBelongFbond"
    },
    {
      "code": 6108,
      "name": "FraktMarketDoesntMatchHadoMarketRegistry",
      "msg": "FraktMarketDoesntMatchHadoMarketRegistry"
    },
    {
      "code": 6109,
      "name": "FraktMarketNotActive",
      "msg": "FraktMarketNotActive"
    },
    {
      "code": 6110,
      "name": "OracleFloorDoesntMatchFraktMarket",
      "msg": "OracleFloorDoesntMatchFraktMarket"
    },
    {
      "code": 6111,
      "name": "FraktMarketDoesntMatchWhitelistEntry",
      "msg": "FraktMarketDoesntMatchWhitelistEntry"
    },
    {
      "code": 6112,
      "name": "ActualLoanToValueExceedsFilter",
      "msg": "ActualLoanToValueExceedsFilter"
    },
    {
      "code": 6113,
      "name": "PairDoesntMatchHadomarket",
      "msg": "PairDoesntMatchHadomarket"
    },
    {
      "code": 6114,
      "name": "ActualLoanDurationExceedsFilter",
      "msg": "ActualLoanDurationExceedsFilter"
    },
    {
      "code": 6115,
      "name": "NftIsNotMasterEdition",
      "msg": "NftIsNotMasterEdition"
    },
    {
      "code": 6116,
      "name": "NftValidationAdapterIsExpired",
      "msg": "NftValidationAdapterIsExpired"
    },
    {
      "code": 6117,
      "name": "CustomValidationAdapterProgramDoesntMatchUser",
      "msg": "CustomValidationAdapterProgramDoesntMatchUser"
    },
    {
      "code": 6118,
      "name": "OnlyAdminCanInitializeFlashLoanPool",
      "msg": "OnlyAdminCanInitializeFlashLoanPool"
    },
    {
      "code": 6119,
      "name": "CantSetLoanFeePointsGreaterThanBasePoints",
      "msg": "CantSetLoanFeePointsGreaterThanBasePoints"
    },
    {
      "code": 6120,
      "name": "OnlyPoolAuthorityCanDepositAndWithdrawLiquidity",
      "msg": "OnlyPoolAuthorityCanDepositAndWithdrawLiquidity"
    },
    {
      "code": 6121,
      "name": "CantWithdrawMoreThanPoolBalance",
      "msg": "CantWithdrawMoreThanPoolBalance"
    },
    {
      "code": 6122,
      "name": "CantBorrowAndRepayByCpi",
      "msg": "CantBorrowAndRepayByCpi"
    },
    {
      "code": 6123,
      "name": "RepayAmountDoesntCorrespondBorrowAmount",
      "msg": "RepayAmountDoesntCorrespondBorrowAmount"
    },
    {
      "code": 6124,
      "name": "TransactionDoesntContainRepayInstruction",
      "msg": "TransactionDoesntContainRepayInstruction"
    },
    {
      "code": 6125,
      "name": "AlreadyBorrowing",
      "msg": "AlreadyBorrowing"
    },
    {
      "code": 6126,
      "name": "WrongHadeswapProgramId",
      "msg": "WrongHadeswapProgramId"
    },
    {
      "code": 6127,
      "name": "AmountToReturnIsHigherThanMax",
      "msg": "AmountToReturnIsHigherThanMax"
    },
    {
      "code": 6128,
      "name": "AutocompoundNotSupportedYet",
      "msg": "AutocompoundNotSupportedYet"
    },
    {
      "code": 6129,
      "name": "AutocompoundDepositIsNotActive",
      "msg": "AutocompoundDepositIsNotActive"
    },
    {
      "code": 6130,
      "name": "AutocompoundDepositDoesntMatchPair",
      "msg": "AutocompoundDepositDoesntMatchPair"
    },
    {
      "code": 6131,
      "name": "OnlyAdminCanRedeemFbondsFromAutocompoundToPair",
      "msg": "OnlyAdminCanRedeemFbondsFromAutocompoundToPair"
    },
    {
      "code": 6132,
      "name": "InvalidAssetReceiverTokenAccount",
      "msg": "InvalidAssetReceiverTokenAccount"
    },
    {
      "code": 6133,
      "name": "AutoreceiveSolToUserFeatureNotEnabled",
      "msg": "AutoreceiveSolToUserFeatureNotEnabled"
    },
    {
      "code": 6134,
      "name": "AutocompoundFeatureNotEnabled",
      "msg": "AutocompoundFeatureNotEnabled"
    },
    {
      "code": 6135,
      "name": "InvalidAssetReceiver",
      "msg": "InvalidAssetReceiver"
    },
    {
      "code": 6136,
      "name": "BondCollateralOrSolReceiverNotUser",
      "msg": "BondCollateralOrSolReceiverNotUser"
    },
    {
      "code": 6137,
      "name": "OnlyBuyPairsAreSupported",
      "msg": "OnlyBuyPairsAreSupported"
    },
    {
      "code": 6138,
      "name": "CanModifyOnlyTokenForNftPairs",
      "msg": "CanModifyOnlyTokenForNftPairs"
    },
    {
      "code": 6139,
      "name": "OraclePriceIsStale",
      "msg": "OraclePriceIsStale"
    },
    {
      "code": 6140,
      "name": "NftLiquidationTimeNotPassed",
      "msg": "NftLiquidationTimeNotPassed"
    },
    {
      "code": 6141,
      "name": "CanDepositReturnedSolOnlyToLiquidatingBond",
      "msg": "CanDepositReturnedSolOnlyToLiquidatingBond"
    },
    {
      "code": 6142,
      "name": "Debugger",
      "msg": "Debugger"
    },
    {
      "code": 6143,
      "name": "NotSupportedSellCase",
      "msg": "NotSupportedSellCase"
    },
    {
      "code": 6144,
      "name": "CollateralTokenMintDoesntMatchAutocompoundDeposit",
      "msg": "CollateralTokenMintDoesntMatchAutocompoundDeposit"
    },
    {
      "code": 6145,
      "name": "NotCorrectAutocompoundType",
      "msg": "NotCorrectAutocompoundType"
    },
    {
      "code": 6146,
      "name": "BadRuleSet",
      "msg": "BadRuleSet"
    },
    {
      "code": 6147,
      "name": "DelegateBuilderFailed",
      "msg": "DelegateBuilderFailed"
    },
    {
      "code": 6148,
      "name": "LockBuilderFailed",
      "msg": "LockBuilderFailed"
    },
    {
      "code": 6149,
      "name": "CanRedeemFromAutocompoundToUserOnlyIfPairClosed",
      "msg": "CanRedeemFromAutocompoundToUserOnlyIfPairClosed"
    },
    {
      "code": 6150,
      "name": "AmountToClaimCantExceedAmountOfBondsInAutocompoundDeposit",
      "msg": "AmountToClaimCantExceedAmountOfBondsInAutocompoundDeposit"
    },
    {
      "code": 6151,
      "name": "CollateralOwnerDoesntMatchCollateralTokenAccount",
      "msg": "CollateralOwnerDoesntMatchCollateralTokenAccount"
    },
    {
      "code": 6152,
      "name": "CanLiquidateOnlyBondsWithBondCollateralOrSolReceiver",
      "msg": "CanLiquidateOnlyBondsWithBondCollateralOrSolReceiver"
    },
    {
      "code": 6153,
      "name": "MerkleTreeIsNotSupported",
      "msg": "MerkleTreeIsNotSupported"
    },
    {
      "code": 6154,
      "name": "UserDoesntHaveEnoughBalance",
      "msg": "UserDoesntHaveEnoughBalance"
    },
    {
      "code": 6155,
      "name": "CantSellToBuggedNegativeInterestPair",
      "msg": "CantSellToBuggedNegativeInterestPair"
    },
    {
      "code": 6156,
      "name": "ThisCollectionIsDisabled",
      "msg": "ThisCollectionIsDisabled"
    },
    {
      "code": 6157,
      "name": "InvalidMutualBondOfferDepositVault",
      "msg": "InvalidMutualBondOfferDepositVault"
    },
    {
      "code": 6158,
      "name": "OnlyBondOfferDepositsAndFullBondAreSupported",
      "msg": "OnlyBondOfferDepositsAndFullBondAreSupported"
    },
    {
      "code": 6159,
      "name": "MerkleTreeWhitelistIsNotSupported",
      "msg": "MerkleTreeWhitelistIsNotSupported"
    },
    {
      "code": 6160,
      "name": "CantSellZero",
      "msg": "CantSellZero"
    },
    {
      "code": 6161,
      "name": "BondOfferHadoMarketDoesntMatch",
      "msg": "BondOfferHadoMarketDoesntMatch"
    },
    {
      "code": 6162,
      "name": "FundsSolVaultPdaIsIncorrect",
      "msg": "FundsSolVaultPdaIsIncorrect"
    },
    {
      "code": 6163,
      "name": "BondTradeTransactionV2PdaIsIncorrect",
      "msg": "BondTradeTransactionV2PdaIsIncorrect"
    },
    {
      "code": 6164,
      "name": "BondBalancesBeforeAndAfterInstructionDontMatch",
      "msg": "BondBalancesBeforeAndAfterInstructionDontMatch"
    },
    {
      "code": 6165,
      "name": "NotAuthorizedToRemoveBondOffer",
      "msg": "NotAuthorizedToRemoveBondOffer"
    },
    {
      "code": 6166,
      "name": "CantUpdateRemovedBondOffer",
      "msg": "CantUpdateRemovedBondOffer"
    },
    {
      "code": 6167,
      "name": "BondTradeTransactionNotActive",
      "msg": "BondTradeTransactionNotActive"
    },
    {
      "code": 6168,
      "name": "BondOfferDoesntMatchTradeTransaction",
      "msg": "BondOfferDoesntMatchTradeTransaction"
    },
    {
      "code": 6169,
      "name": "ReceiveNftIsNotOption",
      "msg": "ReceiveNftIsNotOption"
    },
    {
      "code": 6170,
      "name": "CanLiquidateOnlyActiveBond",
      "msg": "CanLiquidateOnlyActiveBond"
    },
    {
      "code": 6171,
      "name": "CollateralBoxDoesntMatchFbond",
      "msg": "CollateralBoxDoesntMatchFbond"
    },
    {
      "code": 6172,
      "name": "AutocompoundPairShouldBeOnMarketVirtual",
      "msg": "AutocompoundPairShouldBeOnMarketVirtual"
    },
    {
      "code": 6173,
      "name": "UserDoesntOwnHisBondTradeTransaction",
      "msg": "UserDoesntOwnHisBondTradeTransaction"
    },
    {
      "code": 6174,
      "name": "UsersBondTradeTransactionHasIncorrectFbondTokenMint",
      "msg": "UsersBondTradeTransactionHasIncorrectFbondTokenMint"
    },
    {
      "code": 6175,
      "name": "UsersBondTradeTransactionIsInactive",
      "msg": "UsersBondTradeTransactionIsInactive"
    },
    {
      "code": 6176,
      "name": "SumOfBondsInExitingTradeTransactionsDoesntMatchTotalAmountToSell",
      "msg": "SumOfBondsInExitingTradeTransactionsDoesntMatchTotalAmountToSell"
    },
    {
      "code": 6177,
      "name": "CantSellNotFullBondsSupplyOnRefinance",
      "msg": "CantSellNotFullBondsSupplyOnRefinance"
    },
    {
      "code": 6178,
      "name": "OnlyAdminCanMigrate",
      "msg": "OnlyAdminCanMigrate"
    },
    {
      "code": 6179,
      "name": "BondFeaturesNoneAndReceiveNftOnLiquidationAreNotSupported",
      "msg": "BondFeaturesNoneAndReceiveNftOnLiquidationAreNotSupported"
    },
    {
      "code": 6180,
      "name": "SomethingWrongWithMigrationBondOfferIsMissing",
      "msg": "SomethingWrongWithMigrationBondOfferIsMissing"
    },
    {
      "code": 6181,
      "name": "SecondAddressIsNotUserOrBondOffer",
      "msg": "SecondAddressIsNotUserOrBondOffer"
    },
    {
      "code": 6182,
      "name": "SumOfBondsInRepayDoesntMatchBondsSupply",
      "msg": "SumOfBondsInRepayDoesntMatchBondsSupply"
    },
    {
      "code": 6183,
      "name": "CantBuyoutForLowerThanMinimumPrice",
      "msg": "CantBuyoutForLowerThanMinimumPrice"
    },
    {
      "code": 6184,
      "name": "CantBuyoutNftOnDutchAuctionWhenThereAreOnlyOneLender",
      "msg": "CantBuyoutNftOnDutchAuctionWhenThereAreOnlyOneLender"
    },
    {
      "code": 6185,
      "name": "ThereAreMoreThanOneLenderOfThisBond",
      "msg": "ThereAreMoreThanOneLenderOfThisBond"
    },
    {
      "code": 6186,
      "name": "TradeTransactionDoesntMatchBond",
      "msg": "TradeTransactionDoesntMatchBond"
    },
    {
      "code": 6187,
      "name": "CantLiquidatePerpetualBonds",
      "msg": "CantLiquidatePerpetualBonds"
    },
    {
      "code": 6188,
      "name": "CantRepayExpiredReceivingCollateralLoan",
      "msg": "CantRepayExpiredReceivingCollateralLoan"
    },
    {
      "code": 6189,
      "name": "DisabledPairsWithMoreThanOneOrder",
      "msg": "DisabledPairsWithMoreThanOneOrder"
    }
  ]
};
