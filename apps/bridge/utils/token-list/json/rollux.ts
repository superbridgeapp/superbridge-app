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
] as const;
