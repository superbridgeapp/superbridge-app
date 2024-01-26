import { base, mainnet } from "viem/chains";

export const baseTokens = [
  {
    chainId: mainnet.id,
    address: "0x3f14920c99beb920afa163031c4e47a3e03b3e4a",
    name: "Send Token",
    symbol: "SEND",
    decimals: 0,
    logoURI: "https://basescan.org/token/images/sendittoken2_32.png",
    standardBridgeAddresses: {
      [base.id]: "0x3154Cf16ccdb4C6d922629664174b904d80F2C35",
    },
    opTokenId: "send",
    coinGeckoId: "send-token",
  },
  {
    chainId: base.id,
    address: "0x3f14920c99BEB920Afa163031c4e47a3e03B3e4A",
    name: "Send Token",
    symbol: "SEND",
    decimals: 0,
    logoURI: "https://basescan.org/token/images/sendittoken2_32.png",
    standardBridgeAddresses: {
      [mainnet.id]: "0x4200000000000000000000000000000000000010",
    },
    opTokenId: "send",
    coinGeckoId: "send-token",
  },
] as const;
