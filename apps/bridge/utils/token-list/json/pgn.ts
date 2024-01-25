import { pgn } from "viem/chains";

import { OptimismToken } from "@/types/token";

export const l1StandardBridgeAddress =
  "0xD0204B9527C1bA7bD765Fa5CCD9355d38338272b";

export const tokens: OptimismToken[] = [
  {
    chainId: pgn.id,
    address: "0x6535b3db9B908a2bbA29F83c168a0e661C3fAbf7",
    name: "Tether USD",
    symbol: "USDT",
    decimals: 6,
    logoURI: "https://ethereum-optimism.github.io/data/USDT/logo.png",
    standardBridgeAddresses: {
      [1]: "0x4200000000000000000000000000000000000010",
    },
    opTokenId: "USDT",
  },
  {
    chainId: pgn.id,
    address: "0x6C121674ba6736644A7e73A8741407fE8a5eE5BA",
    name: "Dai Stablecoin",
    symbol: "DAI",
    decimals: 18,
    logoURI: "https://ethereum-optimism.github.io/data/DAI/logo.svg",
    standardBridgeAddresses: {
      [1]: "0x4200000000000000000000000000000000000010",
    },
    opTokenId: "DAI",
  },
  {
    chainId: pgn.id,
    address: "0x7c6b91D9Be155A6Db01f749217d76fF02A7227F2",
    name: "Gitcoin",
    symbol: "GTC",
    decimals: 18,
    logoURI: "https://ethereum-optimism.github.io/data/GTC/logo.svg",
    standardBridgeAddresses: {
      [1]: "0x4200000000000000000000000000000000000010",
    },
    opTokenId: "GTC",
  },
];
