export const TokenMinterAbi = [
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "burnLimitsPerMessage",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;
