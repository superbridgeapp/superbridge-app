import { base, optimism } from "viem/chains";

import { MultiChainToken } from "@/types/token";

export const renzo: MultiChainToken[] = [
  {
    [optimism.id]: {
      chainId: optimism.id,
      address: "0x2416092f143378750bb29b79eD961ab195CcEea5",
      name: "Renzo Restaked ETH",
      symbol: "ezETH",
      decimals: 18,
      logoURI: "https://renzo.hyperlane.xyz/logos/ezeth.svg",
      hyperlane: {
        router: "0xEF90AF9FCC831c5E2266285C4A1787201f96736a",
      },
    },
    [base.id]: {
      chainId: base.id,
      address: "0x2416092f143378750bb29b79eD961ab195CcEea5",
      name: "Renzo Restaked ETH",
      symbol: "ezETH",
      decimals: 18,
      logoURI: "https://renzo.hyperlane.xyz/logos/ezeth.svg",
      hyperlane: {
        router: "0x4b36617B3D2cAb714a056090306A88Dd6DD4cCcf",
      },
    },
  },
  {
    [optimism.id]: {
      chainId: optimism.id,
      address: "0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000",
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
      logoURI: "https://ethereum-optimism.github.io/data/ETH/logo.svg",
    },
  },
  {
    [base.id]: {
      chainId: base.id,
      address: "0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000",
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
      logoURI: "https://ethereum-optimism.github.io/data/ETH/logo.svg",
    },
  },
] as const;
