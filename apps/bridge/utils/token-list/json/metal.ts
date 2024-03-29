import { mainnet } from "viem/chains";

export const chainId = 1750;
export const l1StandardBridgeAddress =
  "0x6d0f65D59b55B0FEC5d2d15365154DcADC140BF3";

export const FULLY_QUALIFIED_TOKENS = [
  // MTL
  {
    chainId: mainnet.id,
    address: "0xCEB1Ad1420252fc66856EB38497C267cF81F67cC",
    name: "Metal",
    symbol: "MTL",
    decimals: 8,
    logoURI: "https://assets.coingecko.com/coins/images/763/standard/Metal.png",
    opTokenId: "MTL",
    standardBridgeAddresses: {
      [chainId]: l1StandardBridgeAddress,
    },
  },
  {
    chainId,
    address: "0xBCFc435d8F276585f6431Fc1b9EE9A850B5C00A9",
    name: "Metal",
    symbol: "MTL",
    decimals: 18,
    logoURI: "https://assets.coingecko.com/coins/images/763/standard/Metal.png",
    opTokenId: "MTL",
    standardBridgeAddresses: {
      [mainnet.id]: "0x4200000000000000000000000000000000000010",
    },
  },
] as const;
