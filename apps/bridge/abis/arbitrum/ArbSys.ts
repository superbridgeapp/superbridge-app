export const ArbSysAbi = [
  {
    inputs: [{ internalType: "address", name: "destination", type: "address" }],
    name: "withdrawEth",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
] as const;
