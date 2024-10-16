import { useMemo } from "react";
import { Address, isAddressEqual } from "viem";

import { useInjectedStore } from "@/state/injected";
import { isBridgeable } from "@/utils/is-bridgeable";
import { isBridgedUsdc, nativeUSDC } from "@/utils/tokens/usdc";

import { useAllTokens } from "./use-all-tokens";

export function useActiveTokens() {
  const tokens = useAllTokens();
  const fromChainId = useInjectedStore((s) => s.fromChainId);
  const toChainId = useInjectedStore((s) => s.toChainId);

  const hasNativeUsdc = useMemo(
    () => !!nativeUSDC[fromChainId] && !!nativeUSDC[toChainId],

    [tokens, fromChainId, toChainId]
  );

  return useMemo(() => {
    if (tokens.isFetching) {
      return {
        isFetching: true,
        data: null,
      };
    }

    return {
      isFetching: false,
      data: tokens.data.filter((t) => {
        const from = t[fromChainId];
        const to = t[toChainId];

        if (!from || !to) return false;

        /**
         * We want to disable selection of the bridged-USDC token
         * when depositing if there exists a native USDC option
         */
        if (
          fromChainId === 1 &&
          hasNativeUsdc &&
          (isBridgedUsdc(from) || isBridgedUsdc(to))
        ) {
          return false;
        }

        return isBridgeable(from, to);
      }),
    };
  }, [tokens.data, tokens.isFetching, fromChainId, toChainId, hasNativeUsdc]);
}
