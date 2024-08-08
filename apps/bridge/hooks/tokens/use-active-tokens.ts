import { useMemo } from "react";
import { Address, isAddressEqual } from "viem";

import { useInjectedStore } from "@/state/injected";
import { isBridgedUsdc } from "@/utils/tokens/is-bridged-usdc";

import { useAllTokens } from "./use-all-tokens";

export function useActiveTokens() {
  const tokens = useAllTokens();
  const fromChainId = useInjectedStore((s) => s.fromChainId);
  const toChainId = useInjectedStore((s) => s.toChainId);

  const hasNativeUsdc = useMemo(
    () =>
      !!tokens.data?.find(
        (token) =>
          token[1]?.address &&
          token[10]?.address &&
          isAddressEqual(
            token[1]!.address as Address,
            token[10]!.address as Address
          )
      ),
    [tokens]
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
         * Manually disable depositing weETH until nobridge PR is merged
         * https://github.com/ethereum-optimism/ethereum-optimism.github.io/pull/892
         */
        if (
          fromChainId === 1 &&
          isAddressEqual(
            from.address as Address,
            "0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee"
          )
        ) {
          return false;
        }

        /**
         * We want to disable selection of the bridged-USDC token
         * when depositing if there exists a native USDC option
         */
        if (fromChainId === 1 && hasNativeUsdc && isBridgedUsdc(t)) {
          return false;
        }

        return true;
      }),
    };
  }, [tokens.data, tokens.isFetching, fromChainId, toChainId, hasNativeUsdc]);
}
