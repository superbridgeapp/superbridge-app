import { useMemo } from "react";
import { Address, isAddressEqual } from "viem";

import { DeploymentFamily } from "@/codegen/model";
import { useInjectedStore } from "@/state/injected";
import { MultiChainToken } from "@/types/token";
import { getNativeTokenForDeployment } from "@/utils/get-native-token";
import { isBridgeable } from "@/utils/is-bridgeable";
import { isBridgedUsdc, isCctp } from "@/utils/is-cctp";
import { isNativeToken } from "@/utils/is-eth";

import { useDeployments } from "../use-deployments";
import { useAllTokens } from "./use-all-tokens";

function useDeploymentTokens(): MultiChainToken[] {
  const deployments = useDeployments();

  return useMemo(
    () =>
      deployments
        .map((d) =>
          d.tokens.map((t) => {
            const opTokenId = `custom-${t.l1.symbol}`;

            if (d.family === DeploymentFamily.optimism) {
              const tok: MultiChainToken = {
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
            } else {
              const tok: MultiChainToken = {
                [t.l1.chainId]: {
                  chainId: t.l1.chainId,
                  address: t.l1.address as Address,
                  decimals: t.l1.decimals,
                  name: t.l1.name,
                  symbol: t.l1.symbol,
                  logoURI: t.l1.logoURI,
                  arbitrumBridgeInfo: {
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
                  arbitrumBridgeInfo: {
                    [t.l1.chainId]: t.l2.bridge as Address,
                  },
                },
              };

              return tok;
            }
          })
        )
        .flat(),
    [deployments]
  );
}

function useNativeTokens(): (MultiChainToken | null)[] {
  const deployments = useDeployments();

  return useMemo(
    () => deployments.map((d) => getNativeTokenForDeployment(d)),
    [deployments]
  );
}

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
          from.address,
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
