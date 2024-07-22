import { useMemo } from "react";

import { ChainDto } from "@/codegen/model";
import { Token } from "@/types/token";
import {
  isArbitrumToken,
  isCctpToken,
  isHyperlaneToken,
  isOptimismToken,
} from "@/utils/guards";

import { useFromChain } from "../use-chain";
import { useChains } from "../use-chains";
import { useAllTokens } from "../use-tokens";

function isBridgeable(a: Token, b: Token) {
  if (isCctpToken(a) && isCctpToken(b)) {
    return true;
  }

  if (isOptimismToken(a) && isOptimismToken(b)) {
    return (
      a.standardBridgeAddresses[b.chainId] &&
      b.standardBridgeAddresses[a.chainId]
    );
  }

  if (isArbitrumToken(a) && isArbitrumToken(b)) {
    return a.arbitrumBridgeInfo[b.chainId] && b.arbitrumBridgeInfo[a.chainId];
  }

  if (isHyperlaneToken(a) && isHyperlaneToken(b)) {
    return true;
  }
}

export const usePossibleToChains = () => {
  const from = useFromChain();
  const chains = useChains();

  const allTokens = useAllTokens();

  const possible: { [chainId: string]: ChainDto } = {};

  return useMemo(() => {
    if (!from) {
      return [];
    }

    for (const multiChainToken of allTokens) {
      const a = multiChainToken[from.id];
      if (!a) {
        continue;
      }

      for (const chain of chains) {
        if (possible[chain.id]) {
          continue;
        }

        const b = multiChainToken[chain.id];
        if (!b) {
          continue;
        }

        if (isBridgeable(a, b)) {
          possible[chain.id] = chain;
        }
      }
    }

    return Object.values(possible);
  }, [from, chains, allTokens]);
};
