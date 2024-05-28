export const L2BridgeAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_l2StandardBridge",
        type: "address",
      },
      {
        internalType: "address",
        name: "_localToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "_remoteToken",
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
    ],
    name: "initiateERC20Withdrawal",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_l2StandardBridge",
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
    ],
    name: "initiateEtherWithdrawal",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_l2StandardBridge",
        type: "address",
      },
      {
        internalType: "address",
        name: "_localToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "_remoteToken",
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
    ],
    name: "legacy_initiateERC20Withdrawal",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
] as const;
