import { useMemo } from "react";

import { useConfigState } from "@/state/config";
import { useSettingsState } from "@/state/settings";
import { isArbitrumToken, isOptimismToken } from "@/utils/guards";
import { isNativeToken } from "@/utils/is-eth";
import { isBridgedUsdc, isNativeUsdc } from "@/utils/is-usdc";

import { useDeployments } from "./use-deployments";

export function useAllTokens() {
  const deployment = useConfigState.useDeployment();
  const tokens = useConfigState.useTokens();
  const customTokens = useSettingsState.useCustomTokens();

  const { deployments } = useDeployments();

  return useMemo(
    () => [
      ...tokens.map((t) => {
        if (isNativeToken(t)) {
          const copy = { ...t };
          deployments.forEach((d) => {
            let l1Ether = copy[1]!;
            let l2Ether = copy[10]!;

            // ensure every deployment has a native token registered
            if (!copy[d.l1.id]) {
              copy[d.l1.id] = {
                ...l1Ether,
                name: d.l1.nativeCurrency.name,
                symbol: d.l1.nativeCurrency.symbol,
                chainId: d.l1.id,
              };
            }
            if (!copy[d.l2.id]) {
              copy[d.l2.id] = {
                ...l2Ether,
                name: d.l2.nativeCurrency.name,
                symbol: d.l2.nativeCurrency.symbol,
                chainId: d.l2.id,
              };
            }
          });
          return copy;
        }
        return t;
      }),
      ...customTokens,
    ],
    [deployment, tokens, customTokens]
  );
}

export function useActiveTokens() {
  const deployment = useConfigState.useDeployment();
  const withdrawing = useConfigState.useWithdrawing();
  const tokens = useAllTokens();

  const hasNativeUsdc = useMemo(
    () => !!tokens.find((token) => isNativeUsdc(token)),
    [tokens]
  );

  const active = useMemo(() => {
    if (!deployment) {
      return [];
    }
    return tokens.filter((t) => {
      if (isNativeToken(t)) {
        return true;
      }

      /**
       * We want to disable selection of the bridged-USDC token
       * when depositing if there exists a native USDC option
       */
      if (!withdrawing && hasNativeUsdc && isBridgedUsdc(t)) {
        return false;
      }

      const l1 = t[deployment.l1.id];
      const l2 = t[deployment.l2.id];

      if (!l1 || !l2) return false;

      if (isOptimismToken(l1) && isOptimismToken(l2)) {
        return (
          !!l1.standardBridgeAddresses[l2.chainId] &&
          !!l2.standardBridgeAddresses[l1.chainId]
        );
      }

      if (isArbitrumToken(l1) && isArbitrumToken(l2)) {
        return (
          !!l1.arbitrumBridgeInfo[l2.chainId] &&
          !!l2.arbitrumBridgeInfo[l1.chainId]
        );
      }

      return false;
    });
  }, [deployment, tokens, hasNativeUsdc]);

  return active;
}
