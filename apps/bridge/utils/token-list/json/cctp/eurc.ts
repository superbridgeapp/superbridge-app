import { baseSepolia, mainnet, sepolia } from "viem/chains";

import { OptimismToken } from "@/types/token";

const NATIVE_EURC = "native-eurc";

export const eurc: OptimismToken[] = [
  // testnet
  {
    chainId: sepolia.id,
    address: "0x08210F9170F89Ab7658F0B5E3fF39b0E03C594D4",
    name: "EURC",
    symbol: "EURC",
    decimals: 6,
    logoURI:
      "https://assets.coingecko.com/coins/images/26045/standard/euro.png?1696525125",
    standardBridgeAddresses: {
      [baseSepolia.id]: "0x",
    },
    opTokenId: NATIVE_EURC,
  },
  {
    chainId: baseSepolia.id,
    address: "0x808456652fdb597867f38412077A9182bf77359F",
    name: "EURC",
    symbol: "EURC",
    decimals: 6,
    logoURI:
      "https://assets.coingecko.com/coins/images/26045/standard/euro.png?1696525125",
    standardBridgeAddresses: {
      [sepolia.id]: "0x",
    },
    opTokenId: NATIVE_EURC,
  },
];
