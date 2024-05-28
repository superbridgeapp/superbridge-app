export const L1BridgeArbitrum = [
  {
    inputs: [],
    name: "FEE",
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
        internalType: "address payable",
        name: "_router",
        type: "address",
      },
      {
        internalType: "address",
        name: "_gateway",
        type: "address",
      },
      {
        internalType: "address",
        name: "_l1Token",
        type: "address",
      },
      {
        internalType: "address",
        name: "_l2Token",
        type: "address",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_maxSubmissionCost",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_maxGas",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_gasPriceBid",
        type: "uint256",
      },
    ],
    name: "initiateERC20Deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "_inbox",
        type: "address",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "maxSubmissionCost",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "gasLimit",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxFeePerGas",
        type: "uint256",
      },
    ],
    name: "initiateEtherDeposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
] as const;
