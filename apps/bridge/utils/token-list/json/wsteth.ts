import { base, mainnet, optimism } from "viem/chains";

import { OptimismToken } from "@/types/token";

export const wsteth: OptimismToken[] = [
  {
    chainId: mainnet.id,
    address: "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0",
    name: "Wrapped liquid staked Ether 2.0",
    symbol: "wstETH",
    decimals: 18,
    logoURI: "https://ethereum-optimism.github.io/data/wstETH/logo.svg",
    opTokenId: "wstETH",
    standardBridgeAddresses: {
      [optimism.id]: "0x76943C0D61395d8F2edF9060e1533529cAe05dE6",
      [base.id]: "0x9de443AdC5A411E83F1878Ef24C3F52C61571e72",
    },
  },
  {
    chainId: optimism.id,
    address: "0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb",
    name: "Wrapped liquid staked Ether 2.0",
    symbol: "wstETH",
    decimals: 18,
    logoURI: "https://ethereum-optimism.github.io/data/wstETH/logo.svg",
    opTokenId: "wstETH",
    standardBridgeAddresses: {
      [mainnet.id]: "0x8E01013243a96601a86eb3153F0d9Fa4fbFb6957",
    },
  },
  {
    chainId: base.id,
    address: "0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452",
    name: "Wrapped liquid staked Ether 2.0",
    symbol: "wstETH",
    decimals: 18,
    logoURI: "https://ethereum-optimism.github.io/data/wstETH/logo.svg",
    opTokenId: "wstETH",
    standardBridgeAddresses: {
      [mainnet.id]: "0xac9D11cD4D7eF6e54F14643a393F68Ca014287AB",
    },
  },
];
