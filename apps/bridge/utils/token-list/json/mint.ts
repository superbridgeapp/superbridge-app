import { sepolia } from "viem/chains";

import { OptimismToken } from "@/types/token";

const chainId = 1687;

export const tokens: OptimismToken[] = [
  {
    chainId: sepolia.id,
    address: "0x5537312e0dbA136D33344b550Bf272CB9f9A41aE",
    name: "USDT",
    symbol: "USDT",
    decimals: 6,
    logoURI: "https://static.optimism.io/data/USDT/logo.png",
    opTokenId: "USDT",
    standardBridgeAddresses: {
      [chainId]: "0x57Fc396328b665f0f8bD235F0840fCeD43128c6b",
    },
  },
  {
    chainId: chainId,
    address: "0xed85184dc4becf731358b2c63de971856623e056",
    name: "USDT",
    symbol: "USDT",
    decimals: 6,
    logoURI: "https://static.optimism.io/data/USDT/logo.png",
    opTokenId: "USDT",
    standardBridgeAddresses: {
      [sepolia.id]: "0x4200000000000000000000000000000000000010",
    },
  },

  {
    chainId: sepolia.id,
    address: "0x92c76FDD5FFD42Df0883BdfcFeBA132206CDB971",
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
    logoURI: "https://ethereum-optimism.github.io/data/BridgedUSDC/logo.png",
    opTokenId: `mint-bridged-USDC`,
    standardBridgeAddresses: {
      [chainId]: "0x57Fc396328b665f0f8bD235F0840fCeD43128c6b",
    },
  },
  {
    chainId: chainId,
    address: "0xbafc2b82e53555ae74e1972f3f25d8a0fc4c3682",
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
    logoURI: "https://ethereum-optimism.github.io/data/BridgedUSDC/logo.png",
    standardBridgeAddresses: {
      [sepolia.id]: "0x4200000000000000000000000000000000000010",
    },
    opTokenId: `mint-bridged-USDC`,
  },
] as const;
