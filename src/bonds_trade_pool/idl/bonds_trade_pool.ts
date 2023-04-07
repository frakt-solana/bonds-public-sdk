export type BondsTradePool = {
  "version": "0.1.0",
  "name": "bonds_trade_pool",
  "instructions": [
    {
      "name": "initializeTradePool",
      "accounts": [
        {
          "name": "tradePool",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tradeAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "fundsSolVault",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "admin",
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
        }
      ],
      "args": [
        {
          "name": "tradePoolParams",
          "type": {
            "defined": "InitializeTradePoolParams"
          }
        }
      ]
    },
    {
      "name": "changeTradeSettings",
      "accounts": [
        {
          "name": "tradePool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tradeSettings",
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
          "name": "strategyNum",
          "type": "u8"
        },
        {
          "name": "tradeParams",
          "type": {
            "defined": "ChangeTradeSettingsParams"
          }
        },
        {
          "name": "bondingType",
          "type": {
            "defined": "BondingType"
          }
        }
      ]
    },
    {
      "name": "createInvestment",
      "accounts": [
        {
          "name": "investment",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tradePool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "fundsSolVault",
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
        }
      ],
      "args": [
        {
          "name": "amountToDeposit",
          "type": "u64"
        }
      ]
    },
    {
      "name": "startTrade",
      "accounts": [
        {
          "name": "tradePool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "trade",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tradeSettings",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolFundsSolVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tradeFundsSolVault",
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
          "name": "pair",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "hadoMarket",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pairAuthorityAdapterProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK to cpi"
          ]
        },
        {
          "name": "partialAdapterProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK to cpi"
          ]
        },
        {
          "name": "partialAssetReceiver",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK to cpi"
          ]
        },
        {
          "name": "feeSolVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "feeTokenAccount",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK to cpi"
          ]
        },
        {
          "name": "pairFundsSolVault",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK to cpi"
          ]
        },
        {
          "name": "fundsTokenAccount",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK to cpi"
          ]
        },
        {
          "name": "assetReceiverTokenAccount",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK to cpi"
          ]
        },
        {
          "name": "nftsOwner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "bondsProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "pairFundsSolVaultSeed",
          "type": "u8"
        },
        {
          "name": "pairFeeVaultSeed",
          "type": "u8"
        },
        {
          "name": "pairNftsSeed",
          "type": "u8"
        }
      ]
    },
    {
      "name": "pairCreateClassicAuthorityAdapter",
      "accounts": [
        {
          "name": "authorityAdapter",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pair",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tradePool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "trade",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tradeSettings",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tradeFundsSolVault",
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
        },
        {
          "name": "bondsProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tradeEpoch",
          "type": "u64"
        }
      ]
    },
    {
      "name": "pairPutPairOnMarket",
      "accounts": [
        {
          "name": "authorityAdapter",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pair",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tradePool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "trade",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tradeSettings",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tradeFundsSolVault",
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
        },
        {
          "name": "bondsProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tradeEpoch",
          "type": "u64"
        }
      ]
    },
    {
      "name": "pairCreateValidationFilter",
      "accounts": [
        {
          "name": "pair",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tradePool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "trade",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tradeSettings",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tradeFundsSolVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authorityAdapter",
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
          "name": "validation",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bondsProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tradeEpoch",
          "type": "u64"
        }
      ]
    },
    {
      "name": "pairDepositSolToPair",
      "accounts": [
        {
          "name": "authorityAdapter",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pair",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tradePool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "trade",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tradeSettings",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tradeFundsSolVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolFundsSolVault",
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
        },
        {
          "name": "pairFundsSolVault",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK to cpi"
          ]
        },
        {
          "name": "bondsProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tradeEpoch",
          "type": "u64"
        },
        {
          "name": "amountOfTokensToBuy",
          "type": "u64"
        }
      ]
    },
    {
      "name": "pairWithdrawSolFromPair",
      "accounts": [
        {
          "name": "authorityAdapter",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pair",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tradePool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "trade",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tradeSettings",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tradeFundsSolVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolFundsSolVault",
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
        },
        {
          "name": "pairFundsSolVault",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK to cpi"
          ]
        },
        {
          "name": "bondsProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tradeEpoch",
          "type": "u64"
        },
        {
          "name": "amountOfTokensToWithdraw",
          "type": "u64"
        }
      ]
    },
    {
      "name": "redeemTradeFbonds",
      "accounts": [
        {
          "name": "tradePool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "trade",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tradeSettings",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tradeFundsSolVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolFundsSolVault",
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
          "name": "returnFundsOwner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fbondTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userFbondTokenAccount",
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
          "name": "bondsProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tradeEpoch",
          "type": "u64"
        }
      ]
    },
    {
      "name": "finishTrade",
      "accounts": [
        {
          "name": "pair",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tradePool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "trade",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tradeSettings",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tradeFundsSolVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolFundsSolVault",
          "isMut": true,
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
          "name": "tradeEpoch",
          "type": "u64"
        }
      ]
    },
    {
      "name": "harvestAll",
      "accounts": [
        {
          "name": "investment",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tradePool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "poolFundsSolVault",
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
        }
      ],
      "args": []
    },
    {
      "name": "unstakeFromPool",
      "accounts": [
        {
          "name": "investment",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tradePool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "poolFundsSolVault",
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
        }
      ],
      "args": [
        {
          "name": "amountToUnstake",
          "type": "u64"
        }
      ]
    },
    {
      "name": "cutStrategiesAmount",
      "accounts": [
        {
          "name": "tradePool",
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
          "name": "newStrategiesAmount",
          "type": "u8"
        }
      ]
    },
    {
      "name": "startTradeAndDepositPair",
      "accounts": [
        {
          "name": "tradePool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "trade",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tradeSettings",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolFundsSolVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tradeFundsSolVault",
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
          "name": "pair",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "hadoMarket",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pairAuthorityAdapterProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK to cpi"
          ]
        },
        {
          "name": "partialAdapterProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK to cpi"
          ]
        },
        {
          "name": "partialAssetReceiver",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK to cpi"
          ]
        },
        {
          "name": "feeSolVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "feeTokenAccount",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK to cpi"
          ]
        },
        {
          "name": "pairFundsSolVault",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK to cpi"
          ]
        },
        {
          "name": "fundsTokenAccount",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK to cpi"
          ]
        },
        {
          "name": "assetReceiverTokenAccount",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK to cpi"
          ]
        },
        {
          "name": "nftsOwner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authorityAdapter",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "validation",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bondsProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "pairFundsSolVaultSeed",
          "type": "u8"
        },
        {
          "name": "pairFeeVaultSeed",
          "type": "u8"
        },
        {
          "name": "pairNftsSeed",
          "type": "u8"
        }
      ]
    },
    {
      "name": "withdrawSolFromPairAndFinishTrade",
      "accounts": [
        {
          "name": "authorityAdapter",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pair",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tradePool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "trade",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tradeSettings",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tradeFundsSolVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolFundsSolVault",
          "isMut": true,
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
          "name": "pairFundsSolVault",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK to cpi"
          ]
        },
        {
          "name": "pairFeeSolVault",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK to cpi"
          ]
        },
        {
          "name": "bondsProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tradeEpoch",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "investment",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "deposit",
            "type": "u64"
          },
          {
            "name": "startMul",
            "type": "u64"
          },
          {
            "name": "authority",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "bondsTradePool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "balance",
            "type": "u64"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "tradeAuthority",
            "type": "publicKey"
          },
          {
            "name": "epoch",
            "type": "u64"
          },
          {
            "name": "reserveFundsRatio",
            "type": "u64"
          },
          {
            "name": "strategiesAmount",
            "type": "u8"
          },
          {
            "name": "nextStrategy",
            "type": "u8"
          },
          {
            "name": "lastTradeStartTime",
            "type": "u64"
          },
          {
            "name": "lastUpdatedAt",
            "type": "u64"
          },
          {
            "name": "currentDistributionEndTime",
            "type": "u64"
          },
          {
            "name": "oldMul",
            "type": "u64"
          },
          {
            "name": "newMul",
            "type": "u64"
          },
          {
            "name": "remainingLamportsToSendToAdmin",
            "type": "u64"
          },
          {
            "name": "isPrivate",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "tradeSettings",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tradePool",
            "type": "publicKey"
          },
          {
            "name": "hadoMarket",
            "type": "publicKey"
          },
          {
            "name": "strategyNum",
            "type": "u8"
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
            "name": "delta",
            "type": "u64"
          },
          {
            "name": "spotPrice",
            "type": "u64"
          },
          {
            "name": "bidCap",
            "type": "u64"
          },
          {
            "name": "bondingType",
            "type": {
              "defined": "BondingType"
            }
          },
          {
            "name": "tradeAmountRatio",
            "type": "u64"
          },
          {
            "name": "maxTradeAmount",
            "type": "u64"
          },
          {
            "name": "minTimeBetweenTrades",
            "type": "u64"
          },
          {
            "name": "tradeDuration",
            "type": "u64"
          },
          {
            "name": "remainingSolRatioToFinishTrade",
            "type": "u64"
          },
          {
            "name": "lastTradeStartTime",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "trade",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tradePool",
            "type": "publicKey"
          },
          {
            "name": "pair",
            "type": "publicKey"
          },
          {
            "name": "pairAuthorityAdapter",
            "type": "publicKey"
          },
          {
            "name": "tradeDeposit",
            "type": "u64"
          },
          {
            "name": "strategyNum",
            "type": "u8"
          },
          {
            "name": "epoch",
            "type": "u64"
          },
          {
            "name": "state",
            "type": {
              "defined": "TradeState"
            }
          },
          {
            "name": "closePairTime",
            "type": "u64"
          },
          {
            "name": "tradeProfit",
            "type": "u64"
          },
          {
            "name": "isProfitPositive",
            "type": "bool"
          },
          {
            "name": "amountOfTokensToBuy",
            "type": "u64"
          },
          {
            "name": "amountDepositedTokensToPair",
            "type": "u64"
          },
          {
            "name": "amountRedeemedFromBonds",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "ChangeTradeSettingsParams",
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
            "name": "delta",
            "type": "u64"
          },
          {
            "name": "spotPrice",
            "type": "u64"
          },
          {
            "name": "bidCap",
            "type": "u64"
          },
          {
            "name": "tradeAmountRatio",
            "type": "u64"
          },
          {
            "name": "maxTradeAmount",
            "type": "u64"
          },
          {
            "name": "minTimeBetweenTrades",
            "type": "u64"
          },
          {
            "name": "tradeDuration",
            "type": "u64"
          },
          {
            "name": "remainingSolRatioToFinishTrade",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "InitializeTradePoolParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "reserveFundsRatio",
            "type": "u64"
          },
          {
            "name": "isPrivate",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "BondingType",
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
      "name": "TradeState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Initialized"
          },
          {
            "name": "PairDeposited"
          },
          {
            "name": "Finished"
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
      "name": "InvalidDelta",
      "msg": "InvalidDelta"
    },
    {
      "code": 6002,
      "name": "InvalidFee",
      "msg": "InvalidFee"
    },
    {
      "code": 6003,
      "name": "UserDoesntHaveAuthority",
      "msg": "UserDoesntHaveAuthority"
    },
    {
      "code": 6004,
      "name": "CanPutPairsOnlyToAvailableMarkets",
      "msg": "CanPutPairsOnlyToAvailableMarkets"
    },
    {
      "code": 6005,
      "name": "WrongCrossMintAmmProgramAddress",
      "msg": "WrongCrossMintAmmProgramAddress"
    },
    {
      "code": 6006,
      "name": "FraktMarketNotActive",
      "msg": "FraktMarketNotActive"
    },
    {
      "code": 6007,
      "name": "LoanToValueFilterOutOfBound",
      "msg": "LoanToValueFilterOutOfBound"
    },
    {
      "code": 6008,
      "name": "WrongTradeAuthoirty",
      "msg": "WrongTradeAuthoirty"
    },
    {
      "code": 6009,
      "name": "InvalidStrategyNumber",
      "msg": "InvalidStrategyNumber"
    },
    {
      "code": 6010,
      "name": "InvalidReserveFundsRatio",
      "msg": "InvalidReserveFundsRatio"
    },
    {
      "code": 6011,
      "name": "CantSetStrategiesAmountMoreThanMaximum",
      "msg": "CantSetStrategiesAmountMoreThanMaximum"
    },
    {
      "code": 6012,
      "name": "InvalidTradeAmountRatio",
      "msg": "InvalidTradeAmountRatio"
    },
    {
      "code": 6013,
      "name": "CantSetTradeDurationMoreThanMaximum",
      "msg": "CantSetTradeDurationMoreThanMaximum"
    },
    {
      "code": 6014,
      "name": "NotEnoughTimePassedSinceLastTrade",
      "msg": "NotEnoughTimePassedSinceLastTrade"
    },
    {
      "code": 6015,
      "name": "TradeAmountLessThanSpotPrice",
      "msg": "TradeAmountLessThanSpotPrice"
    },
    {
      "code": 6016,
      "name": "PairAddressDoesntMatch",
      "msg": "PairAddressDoesntMatch"
    },
    {
      "code": 6017,
      "name": "PairAuthorityAdapterAddressDoesntMatch",
      "msg": "PairAuthorityAdapterAddressDoesntMatch"
    },
    {
      "code": 6018,
      "name": "WrongBondsValidationAdapterProgramAddress",
      "msg": "WrongBondsValidationAdapterProgramAddress"
    },
    {
      "code": 6019,
      "name": "CanWithdrawOnlyIfCloseTimeExceededOrRemainingSolEnoughSmall",
      "msg": "CanWithdrawOnlyIfCloseTimeExceededOrRemainingSolEnoughSmall"
    },
    {
      "code": 6020,
      "name": "NotAllOrdersFulfiled",
      "msg": "NotAllOrdersFulfiled"
    },
    {
      "code": 6021,
      "name": "TradeAlreadyFinished",
      "msg": "TradeAlreadyFinished"
    },
    {
      "code": 6022,
      "name": "CantHarvestNegativeProfit",
      "msg": "CantHarvestNegativeProfit"
    },
    {
      "code": 6023,
      "name": "UnstakeAmountExceedsDeposit",
      "msg": "UnstakeAmountExceedsDeposit"
    },
    {
      "code": 6024,
      "name": "AmountTokensToBuyExceeded",
      "msg": "AmountTokensToBuyExceeded"
    },
    {
      "code": 6025,
      "name": "CantPutUndepositedPairOnMarket",
      "msg": "CantPutUndepositedPairOnMarket"
    },
    {
      "code": 6026,
      "name": "InvalidRemainingSolRatio",
      "msg": "InvalidRemainingSolRatio"
    },
    {
      "code": 6027,
      "name": "CanDepositOnlyToInitializedTrade",
      "msg": "CanDepositOnlyToInitializedTrade"
    },
    {
      "code": 6028,
      "name": "NewStrategiesAmountShouldBeLessThanCurrent",
      "msg": "NewStrategiesAmountShouldBeLessThanCurrent"
    },
    {
      "code": 6029,
      "name": "NotEnoughFundsToStartTrade",
      "msg": "NotEnoughFundsToStartTrade"
    },
    {
      "code": 6030,
      "name": "CantFinishTradesWithUndepositedPairs",
      "msg": "CantFinishTradesWithUndepositedPairs"
    },
    {
      "code": 6031,
      "name": "OnlyAuthorityCanDepositInPrivatePools",
      "msg": "OnlyAuthorityCanDepositInPrivatePools"
    },
    {
      "code": 6032,
      "name": "InvalidAdminAddress",
      "msg": "InvalidAdminAddress"
    },
    {
      "code": 6033,
      "name": "OnlyAdminCanInitializePublicPools",
      "msg": "OnlyAdminCanInitializePublicPools"
    },
    {
      "code": 6034,
      "name": "BidCapOutOfBound",
      "msg": "BidCapOutOfBound"
    }
  ]
};

export const IDL: BondsTradePool = {
  "version": "0.1.0",
  "name": "bonds_trade_pool",
  "instructions": [
    {
      "name": "initializeTradePool",
      "accounts": [
        {
          "name": "tradePool",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tradeAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "fundsSolVault",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "admin",
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
        }
      ],
      "args": [
        {
          "name": "tradePoolParams",
          "type": {
            "defined": "InitializeTradePoolParams"
          }
        }
      ]
    },
    {
      "name": "changeTradeSettings",
      "accounts": [
        {
          "name": "tradePool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tradeSettings",
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
          "name": "strategyNum",
          "type": "u8"
        },
        {
          "name": "tradeParams",
          "type": {
            "defined": "ChangeTradeSettingsParams"
          }
        },
        {
          "name": "bondingType",
          "type": {
            "defined": "BondingType"
          }
        }
      ]
    },
    {
      "name": "createInvestment",
      "accounts": [
        {
          "name": "investment",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tradePool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "fundsSolVault",
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
        }
      ],
      "args": [
        {
          "name": "amountToDeposit",
          "type": "u64"
        }
      ]
    },
    {
      "name": "startTrade",
      "accounts": [
        {
          "name": "tradePool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "trade",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tradeSettings",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolFundsSolVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tradeFundsSolVault",
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
          "name": "pair",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "hadoMarket",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pairAuthorityAdapterProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK to cpi"
          ]
        },
        {
          "name": "partialAdapterProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK to cpi"
          ]
        },
        {
          "name": "partialAssetReceiver",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK to cpi"
          ]
        },
        {
          "name": "feeSolVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "feeTokenAccount",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK to cpi"
          ]
        },
        {
          "name": "pairFundsSolVault",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK to cpi"
          ]
        },
        {
          "name": "fundsTokenAccount",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK to cpi"
          ]
        },
        {
          "name": "assetReceiverTokenAccount",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK to cpi"
          ]
        },
        {
          "name": "nftsOwner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "bondsProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "pairFundsSolVaultSeed",
          "type": "u8"
        },
        {
          "name": "pairFeeVaultSeed",
          "type": "u8"
        },
        {
          "name": "pairNftsSeed",
          "type": "u8"
        }
      ]
    },
    {
      "name": "pairCreateClassicAuthorityAdapter",
      "accounts": [
        {
          "name": "authorityAdapter",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pair",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tradePool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "trade",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tradeSettings",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tradeFundsSolVault",
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
        },
        {
          "name": "bondsProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tradeEpoch",
          "type": "u64"
        }
      ]
    },
    {
      "name": "pairPutPairOnMarket",
      "accounts": [
        {
          "name": "authorityAdapter",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pair",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tradePool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "trade",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tradeSettings",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tradeFundsSolVault",
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
        },
        {
          "name": "bondsProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tradeEpoch",
          "type": "u64"
        }
      ]
    },
    {
      "name": "pairCreateValidationFilter",
      "accounts": [
        {
          "name": "pair",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tradePool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "trade",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tradeSettings",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tradeFundsSolVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authorityAdapter",
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
          "name": "validation",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bondsProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tradeEpoch",
          "type": "u64"
        }
      ]
    },
    {
      "name": "pairDepositSolToPair",
      "accounts": [
        {
          "name": "authorityAdapter",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pair",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tradePool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "trade",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tradeSettings",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tradeFundsSolVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolFundsSolVault",
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
        },
        {
          "name": "pairFundsSolVault",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK to cpi"
          ]
        },
        {
          "name": "bondsProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tradeEpoch",
          "type": "u64"
        },
        {
          "name": "amountOfTokensToBuy",
          "type": "u64"
        }
      ]
    },
    {
      "name": "pairWithdrawSolFromPair",
      "accounts": [
        {
          "name": "authorityAdapter",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pair",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tradePool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "trade",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tradeSettings",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tradeFundsSolVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolFundsSolVault",
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
        },
        {
          "name": "pairFundsSolVault",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK to cpi"
          ]
        },
        {
          "name": "bondsProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tradeEpoch",
          "type": "u64"
        },
        {
          "name": "amountOfTokensToWithdraw",
          "type": "u64"
        }
      ]
    },
    {
      "name": "redeemTradeFbonds",
      "accounts": [
        {
          "name": "tradePool",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "trade",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tradeSettings",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tradeFundsSolVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolFundsSolVault",
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
          "name": "returnFundsOwner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fbondTokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userFbondTokenAccount",
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
          "name": "bondsProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tradeEpoch",
          "type": "u64"
        }
      ]
    },
    {
      "name": "finishTrade",
      "accounts": [
        {
          "name": "pair",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tradePool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "trade",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tradeSettings",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tradeFundsSolVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolFundsSolVault",
          "isMut": true,
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
          "name": "tradeEpoch",
          "type": "u64"
        }
      ]
    },
    {
      "name": "harvestAll",
      "accounts": [
        {
          "name": "investment",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tradePool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "poolFundsSolVault",
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
        }
      ],
      "args": []
    },
    {
      "name": "unstakeFromPool",
      "accounts": [
        {
          "name": "investment",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tradePool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "poolFundsSolVault",
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
        }
      ],
      "args": [
        {
          "name": "amountToUnstake",
          "type": "u64"
        }
      ]
    },
    {
      "name": "cutStrategiesAmount",
      "accounts": [
        {
          "name": "tradePool",
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
          "name": "newStrategiesAmount",
          "type": "u8"
        }
      ]
    },
    {
      "name": "startTradeAndDepositPair",
      "accounts": [
        {
          "name": "tradePool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "trade",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tradeSettings",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolFundsSolVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tradeFundsSolVault",
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
          "name": "pair",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "hadoMarket",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pairAuthorityAdapterProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK to cpi"
          ]
        },
        {
          "name": "partialAdapterProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK to cpi"
          ]
        },
        {
          "name": "partialAssetReceiver",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK to cpi"
          ]
        },
        {
          "name": "feeSolVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "feeTokenAccount",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK to cpi"
          ]
        },
        {
          "name": "pairFundsSolVault",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK to cpi"
          ]
        },
        {
          "name": "fundsTokenAccount",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK to cpi"
          ]
        },
        {
          "name": "assetReceiverTokenAccount",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK to cpi"
          ]
        },
        {
          "name": "nftsOwner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authorityAdapter",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "validation",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bondsProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "pairFundsSolVaultSeed",
          "type": "u8"
        },
        {
          "name": "pairFeeVaultSeed",
          "type": "u8"
        },
        {
          "name": "pairNftsSeed",
          "type": "u8"
        }
      ]
    },
    {
      "name": "withdrawSolFromPairAndFinishTrade",
      "accounts": [
        {
          "name": "authorityAdapter",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pair",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tradePool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "trade",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tradeSettings",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tradeFundsSolVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolFundsSolVault",
          "isMut": true,
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
          "name": "pairFundsSolVault",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK to cpi"
          ]
        },
        {
          "name": "pairFeeSolVault",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK to cpi"
          ]
        },
        {
          "name": "bondsProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tradeEpoch",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "investment",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "deposit",
            "type": "u64"
          },
          {
            "name": "startMul",
            "type": "u64"
          },
          {
            "name": "authority",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "bondsTradePool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "balance",
            "type": "u64"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "tradeAuthority",
            "type": "publicKey"
          },
          {
            "name": "epoch",
            "type": "u64"
          },
          {
            "name": "reserveFundsRatio",
            "type": "u64"
          },
          {
            "name": "strategiesAmount",
            "type": "u8"
          },
          {
            "name": "nextStrategy",
            "type": "u8"
          },
          {
            "name": "lastTradeStartTime",
            "type": "u64"
          },
          {
            "name": "lastUpdatedAt",
            "type": "u64"
          },
          {
            "name": "currentDistributionEndTime",
            "type": "u64"
          },
          {
            "name": "oldMul",
            "type": "u64"
          },
          {
            "name": "newMul",
            "type": "u64"
          },
          {
            "name": "remainingLamportsToSendToAdmin",
            "type": "u64"
          },
          {
            "name": "isPrivate",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "tradeSettings",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tradePool",
            "type": "publicKey"
          },
          {
            "name": "hadoMarket",
            "type": "publicKey"
          },
          {
            "name": "strategyNum",
            "type": "u8"
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
            "name": "delta",
            "type": "u64"
          },
          {
            "name": "spotPrice",
            "type": "u64"
          },
          {
            "name": "bidCap",
            "type": "u64"
          },
          {
            "name": "bondingType",
            "type": {
              "defined": "BondingType"
            }
          },
          {
            "name": "tradeAmountRatio",
            "type": "u64"
          },
          {
            "name": "maxTradeAmount",
            "type": "u64"
          },
          {
            "name": "minTimeBetweenTrades",
            "type": "u64"
          },
          {
            "name": "tradeDuration",
            "type": "u64"
          },
          {
            "name": "remainingSolRatioToFinishTrade",
            "type": "u64"
          },
          {
            "name": "lastTradeStartTime",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "trade",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tradePool",
            "type": "publicKey"
          },
          {
            "name": "pair",
            "type": "publicKey"
          },
          {
            "name": "pairAuthorityAdapter",
            "type": "publicKey"
          },
          {
            "name": "tradeDeposit",
            "type": "u64"
          },
          {
            "name": "strategyNum",
            "type": "u8"
          },
          {
            "name": "epoch",
            "type": "u64"
          },
          {
            "name": "state",
            "type": {
              "defined": "TradeState"
            }
          },
          {
            "name": "closePairTime",
            "type": "u64"
          },
          {
            "name": "tradeProfit",
            "type": "u64"
          },
          {
            "name": "isProfitPositive",
            "type": "bool"
          },
          {
            "name": "amountOfTokensToBuy",
            "type": "u64"
          },
          {
            "name": "amountDepositedTokensToPair",
            "type": "u64"
          },
          {
            "name": "amountRedeemedFromBonds",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "ChangeTradeSettingsParams",
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
            "name": "delta",
            "type": "u64"
          },
          {
            "name": "spotPrice",
            "type": "u64"
          },
          {
            "name": "bidCap",
            "type": "u64"
          },
          {
            "name": "tradeAmountRatio",
            "type": "u64"
          },
          {
            "name": "maxTradeAmount",
            "type": "u64"
          },
          {
            "name": "minTimeBetweenTrades",
            "type": "u64"
          },
          {
            "name": "tradeDuration",
            "type": "u64"
          },
          {
            "name": "remainingSolRatioToFinishTrade",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "InitializeTradePoolParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "reserveFundsRatio",
            "type": "u64"
          },
          {
            "name": "isPrivate",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "BondingType",
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
      "name": "TradeState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Initialized"
          },
          {
            "name": "PairDeposited"
          },
          {
            "name": "Finished"
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
      "name": "InvalidDelta",
      "msg": "InvalidDelta"
    },
    {
      "code": 6002,
      "name": "InvalidFee",
      "msg": "InvalidFee"
    },
    {
      "code": 6003,
      "name": "UserDoesntHaveAuthority",
      "msg": "UserDoesntHaveAuthority"
    },
    {
      "code": 6004,
      "name": "CanPutPairsOnlyToAvailableMarkets",
      "msg": "CanPutPairsOnlyToAvailableMarkets"
    },
    {
      "code": 6005,
      "name": "WrongCrossMintAmmProgramAddress",
      "msg": "WrongCrossMintAmmProgramAddress"
    },
    {
      "code": 6006,
      "name": "FraktMarketNotActive",
      "msg": "FraktMarketNotActive"
    },
    {
      "code": 6007,
      "name": "LoanToValueFilterOutOfBound",
      "msg": "LoanToValueFilterOutOfBound"
    },
    {
      "code": 6008,
      "name": "WrongTradeAuthoirty",
      "msg": "WrongTradeAuthoirty"
    },
    {
      "code": 6009,
      "name": "InvalidStrategyNumber",
      "msg": "InvalidStrategyNumber"
    },
    {
      "code": 6010,
      "name": "InvalidReserveFundsRatio",
      "msg": "InvalidReserveFundsRatio"
    },
    {
      "code": 6011,
      "name": "CantSetStrategiesAmountMoreThanMaximum",
      "msg": "CantSetStrategiesAmountMoreThanMaximum"
    },
    {
      "code": 6012,
      "name": "InvalidTradeAmountRatio",
      "msg": "InvalidTradeAmountRatio"
    },
    {
      "code": 6013,
      "name": "CantSetTradeDurationMoreThanMaximum",
      "msg": "CantSetTradeDurationMoreThanMaximum"
    },
    {
      "code": 6014,
      "name": "NotEnoughTimePassedSinceLastTrade",
      "msg": "NotEnoughTimePassedSinceLastTrade"
    },
    {
      "code": 6015,
      "name": "TradeAmountLessThanSpotPrice",
      "msg": "TradeAmountLessThanSpotPrice"
    },
    {
      "code": 6016,
      "name": "PairAddressDoesntMatch",
      "msg": "PairAddressDoesntMatch"
    },
    {
      "code": 6017,
      "name": "PairAuthorityAdapterAddressDoesntMatch",
      "msg": "PairAuthorityAdapterAddressDoesntMatch"
    },
    {
      "code": 6018,
      "name": "WrongBondsValidationAdapterProgramAddress",
      "msg": "WrongBondsValidationAdapterProgramAddress"
    },
    {
      "code": 6019,
      "name": "CanWithdrawOnlyIfCloseTimeExceededOrRemainingSolEnoughSmall",
      "msg": "CanWithdrawOnlyIfCloseTimeExceededOrRemainingSolEnoughSmall"
    },
    {
      "code": 6020,
      "name": "NotAllOrdersFulfiled",
      "msg": "NotAllOrdersFulfiled"
    },
    {
      "code": 6021,
      "name": "TradeAlreadyFinished",
      "msg": "TradeAlreadyFinished"
    },
    {
      "code": 6022,
      "name": "CantHarvestNegativeProfit",
      "msg": "CantHarvestNegativeProfit"
    },
    {
      "code": 6023,
      "name": "UnstakeAmountExceedsDeposit",
      "msg": "UnstakeAmountExceedsDeposit"
    },
    {
      "code": 6024,
      "name": "AmountTokensToBuyExceeded",
      "msg": "AmountTokensToBuyExceeded"
    },
    {
      "code": 6025,
      "name": "CantPutUndepositedPairOnMarket",
      "msg": "CantPutUndepositedPairOnMarket"
    },
    {
      "code": 6026,
      "name": "InvalidRemainingSolRatio",
      "msg": "InvalidRemainingSolRatio"
    },
    {
      "code": 6027,
      "name": "CanDepositOnlyToInitializedTrade",
      "msg": "CanDepositOnlyToInitializedTrade"
    },
    {
      "code": 6028,
      "name": "NewStrategiesAmountShouldBeLessThanCurrent",
      "msg": "NewStrategiesAmountShouldBeLessThanCurrent"
    },
    {
      "code": 6029,
      "name": "NotEnoughFundsToStartTrade",
      "msg": "NotEnoughFundsToStartTrade"
    },
    {
      "code": 6030,
      "name": "CantFinishTradesWithUndepositedPairs",
      "msg": "CantFinishTradesWithUndepositedPairs"
    },
    {
      "code": 6031,
      "name": "OnlyAuthorityCanDepositInPrivatePools",
      "msg": "OnlyAuthorityCanDepositInPrivatePools"
    },
    {
      "code": 6032,
      "name": "InvalidAdminAddress",
      "msg": "InvalidAdminAddress"
    },
    {
      "code": 6033,
      "name": "OnlyAdminCanInitializePublicPools",
      "msg": "OnlyAdminCanInitializePublicPools"
    },
    {
      "code": 6034,
      "name": "BidCapOutOfBound",
      "msg": "BidCapOutOfBound"
    }
  ]
};
