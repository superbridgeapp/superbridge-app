export const rollux = [
  {
    chainId: 57,
    address: "0x0000000000000000000000000000000000000000",
    name: "Syscoin",
    symbol: "SYS",
    decimals: 18,
    logoURI: "https://bridge.rollux.com/syscoin-logo.svg",
    standardBridgeAddresses: {
      [570]: "0x9cc66f9B7b07F72a487FF751a7cBE281976fce7C",
    },
    opTokenId: "ETH", // this should strictly be SYS but it creates duplicates in our token list
    coinGeckoId: "syscoin",
  },
  {
    chainId: 570,
    address: "0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000",
    name: "Syscoin",
    symbol: "SYS",
    decimals: 18,
    logoURI: "https://bridge.rollux.com/syscoin-logo.svg",
    standardBridgeAddresses: {
      [57]: "0x4200000000000000000000000000000000000010",
    },
    opTokenId: "ETH", // this should strictly be SYS but it creates duplicates in our token list
    coinGeckoId: "syscoin",
  },

  {
    chainId: 57,
    address: "0xe18c200a70908c89ffa18c628fe1b83ac0065ea4",
    name: "Pegasys",
    symbol: "PSYS",
    decimals: 18,
    logoURI:
      "https://assets.coingecko.com/coins/images/31130/standard/pegasys.png",
    standardBridgeAddresses: {
      [570]: "0x9cc66f9b7b07f72a487ff751a7cbe281976fce7c",
    },
    opTokenId: "pegasys",
    coinGeckoId: "pegasys-rollux",
  },
  {
    chainId: 570,
    address: "0x48023b16c3e81AA7F6eFFbdEB35Bb83f4f31a8fd",
    name: "Pegasys",
    symbol: "PSYS",
    decimals: 18,
    logoURI:
      "https://assets.coingecko.com/coins/images/31130/standard/pegasys.png",
    standardBridgeAddresses: {
      [57]: "0x4200000000000000000000000000000000000010",
    },
    opTokenId: "pegasys",
    coinGeckoId: "pegasys-rollux",
  },

  {
    chainId: 57,
    address: "0x58950d6897bb85b42fe619cb59f25566070a409a",
    name: "LUXY",
    symbol: "LUXY",
    decimals: 18,
    logoURI:
      "https://assets.coingecko.com/coins/images/21153/standard/QmbYvptvVWHjAHR3tm2UpsXABcp4sQGzhCKMmc5pgn411R.png",
    standardBridgeAddresses: {
      [570]: "0x9cc66f9b7b07f72a487ff751a7cbe281976fce7c",
    },
    opTokenId: "luxy",
    coinGeckoId: "luxy",
  },
  {
    chainId: 570,
    address: "0x6AaEE51366F8435e1Ad527F5Ecdc276bF1dc0b86",
    name: "LUXY",
    symbol: "LUXY",
    decimals: 18,
    logoURI:
      "https://assets.coingecko.com/coins/images/21153/standard/QmbYvptvVWHjAHR3tm2UpsXABcp4sQGzhCKMmc5pgn411R.png",
    standardBridgeAddresses: {
      [57]: "0x4200000000000000000000000000000000000010",
    },
    opTokenId: "luxy",
    coinGeckoId: "luxy",
  },
] as const;
