export const CctpBridgeAbi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "uint32",
        name: "_destinationCircleDomain",
        type: "uint32",
      },
      {
        internalType: "bytes32",
        name: "_mintRecipient",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        internalType: "address",
        name: "_remoteRouter",
        type: "address",
      },
      {
        internalType: "uint32",
        name: "_destinationHyperlaneDomain",
        type: "uint32",
      },
      {
        internalType: "uint256",
        name: "_gasAmount",
        type: "uint256",
      },
    ],
    name: "initiateTokenTransfer",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
] as const;
