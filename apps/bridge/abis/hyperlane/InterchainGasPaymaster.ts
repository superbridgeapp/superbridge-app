export const InterchainGasPaymasterAbi = [
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
] as const;
