import { useMemo } from "react";
import { getAddress, isAddressEqual } from "viem";

import { useInjectedStore } from "@/state/injected";
import { isBridgeable } from "@/utils/is-bridgeable";
import { isBridgedUsdc, isCctp } from "@/utils/is-cctp";
import { isNativeToken } from "@/utils/is-eth";

import { useAllTokens } from "./use-all-tokens";

export function useActiveTokens() {
  const tokens = useAllTokens();
  const fromChainId = useInjectedStore((s) => s.fromChainId);
  const toChainId = useInjectedStore((s) => s.toChainId);

  const hasNativeUsdc = useMemo(
    () =>
      !!tokens.find(
        (token) => isCctp(token) && !!token[fromChainId] && !!token[toChainId]
      ),
    [tokens]
  );

  const a = useMemo(() => {
    return tokens.filter((t) => {
      const from = t[fromChainId];
      const to = t[toChainId];

      if (!from || !to) return false;

      if (isNativeToken(t)) {
        return true;
      }

      /**
       * Manually disable depositing weETH until nobridge PR is merged
       * https://github.com/ethereum-optimism/ethereum-optimism.github.io/pull/892
       */
      if (
        fromChainId === 1 &&
        isAddressEqual(
          getAddress(from.address),
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

      return isBridgeable(from, to);
    });
  }, [tokens, hasNativeUsdc]);
  return a;
}
