import { useCallback } from "react";

import { ChainDto } from "@/codegen/model";
import { isBridgeable } from "@/utils/is-bridgeable";

import { useAllTokens } from "../tokens/use-all-tokens";
import { useChains } from "../use-chains";

export const useGetPossibleToChains = () => {
  const chains = useChains();
  const allTokens = useAllTokens();

  return useCallback(
    (from: ChainDto | undefined | null) => {
      if (!from) {
        return [];
      }

      const possible: { [chainId: string]: ChainDto } = {
        [from.id]: from,
      };

      for (const multiChainToken of allTokens.data) {
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
    },
    [chains, allTokens]
  );
};
