import { base, mainnet } from "viem/chains";

export const baseTokens = [
  {
    chainId: mainnet.id,
    address: "0x02e7F808990638E9e67E1f00313037EDe2362361",
    name: "KiboShib",
    symbol: "KIBSHI",
    decimals: 18,
    logoURI: "https://ethereum-optimism.github.io/data/KIBSHI/logo.svg",
    opTokenId: "KIBSHI",
    standardBridgeAddresses: {
      [base.id]: "0x3154Cf16ccdb4C6d922629664174b904d80F2C35",
    },
  },
  {
    chainId: base.id,
    address: "0xC7DcCA0a3e69bD762C8DB257f868f76Be36c8514",
    name: "KiboShib",
    symbol: "KIBSHI",
    decimals: 18,
    logoURI: "https://ethereum-optimism.github.io/data/KIBSHI/logo.svg",
    opTokenId: "KIBSHI",
    standardBridgeAddresses: {
      [mainnet.id]: "0x4200000000000000000000000000000000000010",
    },
  },
] as const;
