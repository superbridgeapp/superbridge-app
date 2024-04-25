import { sepolia } from "viem/chains";

import { OptimismToken } from "@/types/token";

export const mint: OptimismToken[] = [
  {
    chainId: sepolia.id,
    address: "0xDdF73887D6E1E15cC826bf55F273DD8F7d7490Cf",
    name: "USDT",
    symbol: "USDT",
    decimals: 6,
    logoURI: "",
    opTokenId: "USDT",
    standardBridgeAddresses: {
      [1687]: "0x57Fc396328b665f0f8bD235F0840fCeD43128c6b",
    },
  },
  {
    chainId: 1687,
    address: "0xffA687db151dA908ad76a9465285578B3aaC1DF9",
    name: "USDT",
    symbol: "USDT",
    decimals: 6,
    logoURI: "",
    opTokenId: "USDT",
    standardBridgeAddresses: {
      [sepolia.id]: "0x4200000000000000000000000000000000000010",
    },
  },
] as const;
