module.exports = [
  {
    inputs: [
      {
        internalType: "address",
        name: "beneficiary_",
        type: "address",
      },
      {
        internalType: "address",
        name: "wethAddress_",
        type: "address",
      },
      {
        internalType: "address",
        name: "erc20TokenAddress_",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "landPriceInERC20Tokens",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "landCategory",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "int256",
        name: "landParcelLong",
        type: "int256",
      },
      {
        indexed: false,
        internalType: "int256",
        name: "landParcelLat",
        type: "int256",
      },
    ],
    name: "EventBuyLandInERC20",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "landPriceInUsdCent",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "landCategory",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "int256",
        name: "landParcelLong",
        type: "int256",
      },
      {
        indexed: false,
        internalType: "int256",
        name: "landParcelLat",
        type: "int256",
      },
    ],
    name: "EventBuyLandInFiat",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "landPriceInWETH",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "landCategory",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "int256",
        name: "landParcelLong",
        type: "int256",
      },
      {
        indexed: false,
        internalType: "int256",
        name: "landParcelLat",
        type: "int256",
      },
    ],
    name: "EventBuyLandInWETH",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "auth_",
        type: "address",
      },
    ],
    name: "EventGrantAuthorized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "auth_",
        type: "address",
      },
    ],
    name: "EventRevokeAuthorized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "userAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address payable",
        name: "relayerAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "functionSignature",
        type: "bytes",
      },
    ],
    name: "MetaTransactionExecuted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    inputs: [],
    name: "_beneficiary",
    outputs: [
      {
        internalType: "address payable",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "_erc20Token",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "_erc20TokenPriceInUsdCent",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "_landRegistry",
    outputs: [
      {
        internalType: "contract ILandRegistry",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "_landSaleCategoryNums",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "_landSaleInfoCurrent",
    outputs: [
      {
        internalType: "uint256",
        name: "maxForSale",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "landSoldCount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "_landSaleInfoHistory",
    outputs: [
      {
        internalType: "uint256",
        name: "maxForSale",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "landSoldCount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "_landSaleInfoHistoryCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "_weth",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "userAddress",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "functionSignature",
        type: "bytes",
      },
      {
        internalType: "bytes32",
        name: "sigR",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "sigS",
        type: "bytes32",
      },
      {
        internalType: "uint8",
        name: "sigV",
        type: "uint8",
      },
    ],
    name: "executeMetaTransaction",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "getDomainSeparator",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getNonce",
    outputs: [
      {
        internalType: "uint256",
        name: "nonce",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getThePriceEthUsd",
    outputs: [
      {
        internalType: "int256",
        name: "",
        type: "int256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "auth_",
        type: "address",
      },
    ],
    name: "grantAuthorized",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "auth_",
        type: "address",
      },
    ],
    name: "revokeAuthorized",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "landRegistryAddress_",
        type: "address",
      },
    ],
    name: "setLandRegistryContractAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "landCategory_",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "landPriceUsdCent_",
        type: "uint256[]",
      },
      {
        internalType: "uint256",
        name: "maxForSale_",
        type: "uint256",
      },
    ],
    name: "setLandSaleInfo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "landCategory_",
        type: "uint256",
      },
    ],
    name: "getLandCategoryPriceUsdCent",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "erc20TokenPriceInUsdCent_",
        type: "uint256",
      },
    ],
    name: "setErc20TokenPriceInUsdCent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "beneficiary_",
        type: "address",
      },
    ],
    name: "setBeneficiary",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getEthPriceInUsdCent",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "landCategory_",
        type: "uint256",
      },
    ],
    name: "getLandPriceInErc20Tokens",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "landCategory_",
        type: "uint256",
      },
    ],
    name: "getLandPriceInWETH",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "int256",
        name: "landParcelLat_",
        type: "int256",
      },
      {
        internalType: "int256",
        name: "landParcelLong_",
        type: "int256",
      },
    ],
    name: "getLandCategory",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "int256",
        name: "landParcelLong_",
        type: "int256",
      },
      {
        internalType: "int256",
        name: "landParcelLat_",
        type: "int256",
      },
      {
        internalType: "address",
        name: "buyer_",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "landPriceUsdCent_",
        type: "uint256",
      },
    ],
    name: "buyLandInFiat",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "int256",
        name: "landParcelLong_",
        type: "int256",
      },
      {
        internalType: "int256",
        name: "landParcelLat_",
        type: "int256",
      },
    ],
    name: "buyLandInERC20",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "int256",
        name: "landParcelLong_",
        type: "int256",
      },
      {
        internalType: "int256",
        name: "landParcelLat_",
        type: "int256",
      },
    ],
    name: "buyLandInWETH",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getCurrentPriceOfETHtoUSD",
    outputs: [
      {
        internalType: "int256",
        name: "",
        type: "int256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
