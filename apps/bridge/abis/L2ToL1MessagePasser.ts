export const L2ToL1MessagePasserAbi = [
  {
    inputs: [
      { internalType: "address", name: "_target", type: "address" },
      { internalType: "uint256", name: "_gasLimit", type: "uint256" },
      { internalType: "bytes", name: "_data", type: "bytes" },
    ],
    name: "initiateWithdrawal",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
] as const;
