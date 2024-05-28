export const ArbRetryableTxAbi = [
  {
    inputs: [{ internalType: "bytes32", name: "ticketId", type: "bytes32" }],
    name: "redeem",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
