import { mainnet } from "viem/chains";

export const chainId = 8866;
export const l1StandardBridgeAddress =
  "0xdB5C6b73CB1c5875995a42D64C250BF8BC69a8bc";

export const FULLY_QUALIFIED_TOKENS = [
  // PORK
  {
    chainId: mainnet.id,
    address: "0xb9f599ce614feb2e1bbe58f180f370d05b39344e",
    name: "PepeFork",
    symbol: "PORK",
    decimals: 18,
    logoURI:
      "https://assets.coingecko.com/coins/images/34913/standard/pork.png",
    opTokenId: "PORK",
    coinGeckoId: "pepefork",
    standardBridgeAddresses: {
      [chainId]: l1StandardBridgeAddress,
    },
  },
  {
    chainId,
    address: "0x7c6b91D9Be155A6Db01f749217d76fF02A7227F2",
    name: "PepeFork",
    symbol: "PORK",
    decimals: 18,
    logoURI:
      "https://assets.coingecko.com/coins/images/34913/standard/pork.png",
    opTokenId: "PORK",
    coinGeckoId: "pepefork",
    standardBridgeAddresses: {
      [mainnet.id]: "0x4200000000000000000000000000000000000010",
    },
  },
] as const;

export const tokens = [
  {
    chainId,
    address: "0xd08a2917653d4e460893203471f0000826fb4034",
    name: "Pepe",
    symbol: "PEPE",
    decimals: 18,
    logoURI: "https://ethereum-optimism.github.io/data/PEPE/logo.svg",
    standardBridgeAddresses: {
      [1]: "0x4200000000000000000000000000000000000010",
    },
    opTokenId: "PEPE",
  },
] as const;
