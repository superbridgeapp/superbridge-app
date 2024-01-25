export const InterchainGasPaymasterAbi = [
  {
    inputs: [
      { internalType: "address", name: "_beneficiary", type: "address" },
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
        name: "beneficiary",
        type: "address",
      },
    ],
    name: "BeneficiarySet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint32",
        name: "remoteDomain",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "gasOracle",
        type: "address",
      },
    ],
    name: "GasOracleSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "messageId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "gasAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "payment",
        type: "uint256",
      },
    ],
    name: "GasPayment",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint8", name: "version", type: "uint8" },
    ],
    name: "Initialized",
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
    inputs: [],
    name: "beneficiary",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "claim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint32", name: "", type: "uint32" }],
    name: "gasOracles",
    outputs: [
      { internalType: "contract IGasOracle", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint32", name: "_destinationDomain", type: "uint32" },
    ],
    name: "getExchangeRateAndGasPrice",
    outputs: [
      { internalType: "uint128", name: "tokenExchangeRate", type: "uint128" },
      { internalType: "uint128", name: "gasPrice", type: "uint128" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_beneficiary", type: "address" },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "_messageId", type: "bytes32" },
      { internalType: "uint32", name: "_destinationDomain", type: "uint32" },
      { internalType: "uint256", name: "_gasAmount", type: "uint256" },
      { internalType: "address", name: "_refundAddress", type: "address" },
    ],
    name: "payForGas",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint32", name: "_destinationDomain", type: "uint32" },
      { internalType: "uint256", name: "_gasAmount", type: "uint256" },
    ],
    name: "quoteGasPayment",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
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
      { internalType: "address", name: "_beneficiary", type: "address" },
    ],
    name: "setBeneficiary",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint32", name: "remoteDomain", type: "uint32" },
          { internalType: "address", name: "gasOracle", type: "address" },
        ],
        internalType: "struct InterchainGasPaymaster.GasOracleConfig[]",
        name: "_configs",
        type: "tuple[]",
      },
    ],
    name: "setGasOracles",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
