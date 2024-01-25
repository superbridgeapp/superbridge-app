import { Address, getAddress } from "viem";

import { ArbitrumToken, MultiChainToken } from "@/types/token";

import ATokenList from "./json/arbitrum-uniswap.json";
import BTokenList from "./json/arbitrum.json";

export const transformArbitrumTokenList = (
  list: ((typeof ATokenList.tokens)[0] | (typeof BTokenList.tokens)[0])[]
) => {
  const multichainArbitrumTokens: {
    [name: string]: MultiChainToken;
  } = {};

  list.forEach((token) => {
    if (!token.extensions?.bridgeInfo) {
      return;
    }

    const t: ArbitrumToken = {
      address: token.address as Address,
      chainId: token.chainId,
      name: token.name,
      symbol: token.symbol,
      decimals: token.decimals,
      logoURI: token.logoURI,
      arbitrumBridgeInfo: {},
    };

    multichainArbitrumTokens[token.address] = {
      [t.chainId]: t,
    };

    Object.entries(token.extensions?.bridgeInfo ?? {}).forEach(
      ([_chainId, config]) => {
        const destinationChainId = parseInt(_chainId);

        t.arbitrumBridgeInfo[destinationChainId] = config.originBridgeAddress;

        multichainArbitrumTokens[token.address]![destinationChainId] = {
          ...t!,
          chainId: destinationChainId,
          address: getAddress(config.tokenAddress),
          arbitrumBridgeInfo: {
            [t.chainId]: config.destBridgeAddress,
          },
        };
      }
    );
  });

  return multichainArbitrumTokens;
};
