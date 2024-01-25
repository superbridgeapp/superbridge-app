import { base, mainnet, optimism } from "viem/chains";

import { OptimismToken } from "@/types/token";

export const dog: OptimismToken[] = [
  {
    chainId: mainnet.id,
    address: "0xbaac2b4491727d78d2b78815144570b9f2fe8899",
    name: "The Doge NFT",
    symbol: "DOG",
    decimals: 18,
    logoURI: "https://ethereum-optimism.github.io/data/DOG/logo.svg",
    opTokenId: "DOG",
    standardBridgeAddresses: {
      [optimism.id]: "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1",
      [base.id]: "0x3154Cf16ccdb4C6d922629664174b904d80F2C35",
    },
  },
  {
    chainId: optimism.id,
    address: "0x8F69Ee043d52161Fd29137AeDf63f5e70cd504D5",
    name: "The Doge NFT",
    symbol: "DOG",
    decimals: 18,
    logoURI: "https://ethereum-optimism.github.io/data/DOG/logo.svg",
    opTokenId: "DOG",
    standardBridgeAddresses: {
      [mainnet.id]: "0x4200000000000000000000000000000000000010",
    },
  },
  {
    chainId: base.id,
    address: "0xafb89a09d82fbde58f18ac6437b3fc81724e4df6",
    name: "The Doge NFT",
    symbol: "DOG",
    decimals: 18,
    logoURI: "https://ethereum-optimism.github.io/data/DOG/logo.svg",
    opTokenId: "DOG",
    standardBridgeAddresses: {
      [mainnet.id]: "0x4200000000000000000000000000000000000010",
    },
  },
] as const;
