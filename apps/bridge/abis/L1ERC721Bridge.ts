export const L1ERC721BridgeAbi = [
  {
    inputs: [
      { internalType: "address", name: "_localToken", type: "address" },
      { internalType: "address", name: "_remoteToken", type: "address" },
      { internalType: "address", name: "_to", type: "address" },
      { internalType: "uint256", name: "_tokenId", type: "uint256" },
      { internalType: "uint32", name: "_minGasLimit", type: "uint32" },
      { internalType: "bytes", name: "_extraData", type: "bytes" },
    ],
    name: "bridgeERC721To",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
