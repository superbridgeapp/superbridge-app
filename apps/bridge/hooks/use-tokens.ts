import { useMemo } from "react";
import { isPresent } from "ts-is-present";
import { Address } from "viem";

import { useConfigState } from "@/state/config";
import { useSettingsState } from "@/state/settings";
import { MultiChainOptimismToken, MultiChainToken } from "@/types/token";
import { isArbitrumToken, isOptimismToken } from "@/utils/guards";
import { isNativeToken } from "@/utils/is-eth";
import { isBridgedUsdc, isNativeUsdc } from "@/utils/is-usdc";
import { getArbitrumNativeTokenForDeployment } from "@/utils/get-arbitrum-native-token";

import { useDeployments } from "./use-deployments";
import { useDeployment } from "./use-deployment";

function useDeploymentTokens(): MultiChainOptimismToken[] {
  const { deployments } = useDeployments();

  return useMemo(
    () =>
      deployments
        .map((d) =>
          d.tokens.map((t) => {
            const opTokenId = `custom-${t.l1.symbol}`;
            const tok: MultiChainOptimismToken = {
              [t.l1.chainId]: {
                chainId: t.l1.chainId,
                address: t.l1.address as Address,
                decimals: t.l1.decimals,
                name: t.l1.name,
                symbol: t.l1.symbol,
                opTokenId,
                logoURI: t.l1.logoURI,
                standardBridgeAddresses: {
                  [t.l2.chainId]: t.l1.bridge as Address,
                },
              },
              [t.l2.chainId]: {
                chainId: t.l2.chainId,
                address: t.l2.address as Address,
                decimals: t.l2.decimals,
                name: t.l2.name,
                symbol: t.l2.symbol,
                logoURI: t.l2.logoURI,
                opTokenId,
                standardBridgeAddresses: {
                  [t.l1.chainId]: t.l2.bridge as Address,
                },
              },
            };
            return tok;
          })
        )
        .flat(),
    [deployments]
  );
}

function useArbitrumNativeTokens(): MultiChainToken[] {
  const { deployments } = useDeployments();

  return useMemo(
    () =>
      deployments
        .map((d) => getArbitrumNativeTokenForDeployment(d))
        .filter(isPresent),
    [deployments]
  );
}

export function useAllTokens() {
  const deployment = useDeployment();
  const tokens = useConfigState.useTokens();
  const customTokens = useSettingsState.useCustomTokens();
  const deploymentTokens = useDeploymentTokens();
  const arbitrumNativeTokens = useArbitrumNativeTokens();

  const { deployments } = useDeployments();

  return useMemo(
    () => [
      ...tokens
        .map((t) => {
          if (isNativeToken(t)) {
            const copy = { ...t };
            deployments.forEach((d, deploymentIndex) => {
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

              const arbitrumNativeToken = arbitrumNativeTokens[deploymentIndex];
              if (arbitrumNativeToken) {
                return copy;
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
        })
        .filter(isPresent),
      ...customTokens,
      ...arbitrumNativeTokens.filter(isPresent),
      ...deploymentTokens,
    ],
    [deployment, tokens, customTokens, arbitrumNativeTokens, deploymentTokens]
  );
}

export function useActiveTokens() {
  const deployment = useDeployment();
  const withdrawing = useConfigState.useWithdrawing();
  const tokens = useAllTokens();

  const hasNativeUsdc = useMemo(
    () =>
      !!tokens.find(
        (token) =>
          isNativeUsdc(token) &&
          !!token[deployment?.l1.id ?? 0] &&
          !!token[deployment?.l2.id ?? 0]
      ),
    [tokens, deployment]
  );

  const active = useMemo(() => {
    if (!deployment) {
      return [];
    }
    return tokens.filter((t) => {
      const l1 = t[deployment.l1.id];
      const l2 = t[deployment.l2.id];

      if (!l1 || !l2) return false;

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
