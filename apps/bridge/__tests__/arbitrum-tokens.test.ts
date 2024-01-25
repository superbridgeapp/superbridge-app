import { describe, expect, test } from "vitest";

import { transformArbitrumTokenList } from "@/utils/token-list/transform-arbitrum-token-list";

describe("transform into optimism token", () => {
  test("l1 mainnet", () => {
    expect(
      transformArbitrumTokenList([
        {
          chainId: 42161,
          address: "0xAC9Ac2C17cdFED4AbC80A53c5553388575714d03",
          name: "Automata",
          symbol: "ATA",
          decimals: 18,
          logoURI:
            "https://assets.coingecko.com/coins/images/15985/thumb/ATA.jpg?1622535745",
          extensions: {
            bridgeInfo: {
              "1": {
                tokenAddress: "0xa2120b9e674d3fc3875f415a7df52e382f141225",
                originBridgeAddress:
                  "0x09e9222E96E7B4AE2a407B98d48e330053351EEe",
                destBridgeAddress: "0xa3a7b6f88361f48403514059f1f16c8e78d60eec",
              },
            },
          },
        },
        {
          chainId: 1,
          name: "Automata",
          address: "0xA2120b9e674d3fC3875f415A7DF52e382F141225",
          symbol: "ATA",
          decimals: 18,
          logoURI:
            "https://assets.coingecko.com/coins/images/15985/thumb/ATA.jpg?1622535745",
        },
      ])
    ).toStrictEqual({
      "0xAC9Ac2C17cdFED4AbC80A53c5553388575714d03": {
        1: {
          chainId: 1,
          name: "Automata",
          address: "0xA2120b9e674d3fC3875f415A7DF52e382F141225",
          symbol: "ATA",
          decimals: 18,
          logoURI:
            "https://assets.coingecko.com/coins/images/15985/thumb/ATA.jpg?1622535745",
          arbitrumBridgeInfo: {
            42161: "0xa3a7b6f88361f48403514059f1f16c8e78d60eec",
          },
        },
        42161: {
          chainId: 42161,
          address: "0xAC9Ac2C17cdFED4AbC80A53c5553388575714d03",
          name: "Automata",
          symbol: "ATA",
          decimals: 18,
          logoURI:
            "https://assets.coingecko.com/coins/images/15985/thumb/ATA.jpg?1622535745",
          arbitrumBridgeInfo: {
            1: "0x09e9222E96E7B4AE2a407B98d48e330053351EEe",
          },
        },
      },
    });
  });
});
