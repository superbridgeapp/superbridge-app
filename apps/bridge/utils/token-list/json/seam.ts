import { baseSepolia, sepolia } from "viem/chains";

import { OptimismToken } from "@/types/token";

export const seam: OptimismToken[] = [
  {
    chainId: sepolia.id,
    address: "0xF01901ad15fcd248a7175E03c0ecCC0fD1D943Eb",
    name: "Seamless",
    symbol: "SEAM",
    decimals: 18,
    logoURI: "https://ethereum-optimism.github.io/data/SEAM/logo.svg",
    opTokenId: "SEAM",
    standardBridgeAddresses: {
      [baseSepolia.id]: "0xfd0Bf71F60660E2f608ed56e1659C450eB113120",
    },
  },
  {
    chainId: baseSepolia.id,
    address: "0x178898686F23a50CCAC17962df41395484804a6B",
    name: "Seamless",
    symbol: "SEAM",
    decimals: 18,
    logoURI: "https://ethereum-optimism.github.io/data/SEAM/logo.svg",
    opTokenId: "SEAM",
    standardBridgeAddresses: {
      [sepolia.id]: "0x4200000000000000000000000000000000000010",
    },
  },
] as const;
