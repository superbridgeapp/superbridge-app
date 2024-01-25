import { OptimismToken } from "@/types/token";

export const l1StandardBridgeAddress =
  "0x827962404D7104202C5aaa6b929115C8211d9596";

export const l1Tokens: OptimismToken[] = [
  {
    chainId: 1,
    address: "0xb8c77482e45f1f44de1745f52c74426c631bdd52",
    name: "BNB",
    symbol: "BNB",
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/smartchain/assets/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c/logo.png",
    standardBridgeAddresses: {
      [255]: "0x827962404D7104202C5aaa6b929115C8211d9596",
    },
    opTokenId: "BNB",
  },
  {
    chainId: 1,
    address: "0x9ad37205d608b8b219e6a2573f922094cec5c200",
    name: "izumi Token",
    symbol: "iZi",
    decimals: 18,
    logoURI:
      "https://assets.coingecko.com/coins/images/21791/thumb/izumi-logo-symbol.png?1696521144",
    standardBridgeAddresses: {
      [255]: "0x827962404D7104202C5aaa6b929115C8211d9596",
    },
    opTokenId: "iZi",
  },
];

export const l2Tokens: OptimismToken[] = [
  {
    chainId: 255,
    address: "0x0Cf7c2A584988871b654Bd79f96899e4cd6C41C0",
    name: "Tether USD",
    symbol: "USDT",
    decimals: 6,
    logoURI: "https://ethereum-optimism.github.io/data/USDT/logo.png",
    standardBridgeAddresses: {
      [1]: "0x4200000000000000000000000000000000000009",
    },
    opTokenId: "USDT",
  },
  {
    chainId: 255,
    address: "0x49A5010110a358d9069282873F3e7eCf6B41DC10",
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
    logoURI: "https://ethereum-optimism.github.io/data/USDC/logo.png",
    standardBridgeAddresses: {
      [1]: "0x4200000000000000000000000000000000000009",
    },
    opTokenId: "USDC",
  },
  {
    chainId: 255,
    address: "0xc32A507d29903eAd6D74A1fC1b8dCB8df37B8D73",
    name: "Dai Stablecoin",
    symbol: "DAI",
    decimals: 18,
    logoURI: "https://ethereum-optimism.github.io/data/DAI/logo.svg",
    standardBridgeAddresses: {
      [1]: "0x4200000000000000000000000000000000000009",
    },
    opTokenId: "DAI",
  },
  {
    chainId: 255,
    address: "0x2104E3BD1cC8551EeC0c7ad10dE13da29136B19C",
    name: "Wrapped BTC",
    symbol: "wBTC",
    decimals: 8,
    logoURI: "https://ethereum-optimism.github.io/data/WBTC/logo.svg",
    standardBridgeAddresses: {
      [1]: "0x4200000000000000000000000000000000000009",
    },
    opTokenId: "WBTC",
  },
  {
    chainId: 255,
    address: "0x980B4E4f44a18F864d617D93A3a3D0127D23B16B",
    name: "Chainlink",
    symbol: "LINK",
    decimals: 18,
    logoURI: "https://ethereum-optimism.github.io/data/LINK/logo.png",
    standardBridgeAddresses: {
      [1]: "0x4200000000000000000000000000000000000009",
    },
    opTokenId: "LINK",
  },
  {
    chainId: 255,
    address: "0x15af8E15eb18C92BE4C8f9126F9d7f65cBE2507A",
    name: "Uniswap",
    symbol: "UNI",
    decimals: 18,
    logoURI: "https://ethereum-optimism.github.io/data/UNI/logo.png",
    standardBridgeAddresses: {
      [1]: "0x4200000000000000000000000000000000000009",
    },
    opTokenId: "UNI",
  },
  {
    chainId: 255,
    address: "0x56D3984e33291910D08F83756EC9B837201A0CD5",
    name: "BNB",
    symbol: "BNB",
    decimals: 18,
    logoURI:
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/smartchain/assets/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c/logo.png",
    standardBridgeAddresses: {
      [1]: "0x4200000000000000000000000000000000000009",
    },
    opTokenId: "BNB",
  },
  {
    chainId: 255,
    address: "0x57B5284BA55A1170b4D3e5C0d4fA22baC893B291",
    name: "izumi Token",
    symbol: "iZi",
    decimals: 18,
    logoURI:
      "https://assets.coingecko.com/coins/images/21791/thumb/izumi-logo-symbol.png?1696521144",
    standardBridgeAddresses: {
      [1]: "0x4200000000000000000000000000000000000009",
    },
    opTokenId: "iZi",
  },
];
