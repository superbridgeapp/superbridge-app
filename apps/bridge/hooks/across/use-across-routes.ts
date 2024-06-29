import { useMemo } from "react";
import { mode } from "viem/chains";

import { useBridgeControllerGetAcrossAvailableRoutes } from "@/codegen/index";
import { AcrossAvailableRouteDto } from "@/codegen/model";
import { useConfigState } from "@/state/config";
import { useInjectedStore } from "@/state/injected";

const getRouteId = (route: AcrossAvailableRouteDto) => {
  if (route.originChainId < route.destinationChainId) {
    return `${route.originChainId}-${route.originToken}-${route.destinationChainId}-${route.destinationToken}`;
  }
  return `${route.destinationChainId}-${route.destinationToken}-${route.originChainId}-${route.originToken}`;
};

export const useAcrossRoutes = () => {
  const fast = useConfigState.useFast();

  const acrossDomains = useInjectedStore((s) => s.acrossDomains);

  const data = useBridgeControllerGetAcrossAvailableRoutes({
    query: {
      enabled: fast,
    },
  }).data?.data;

  return useMemo(() => {
    if (!data) return [];

    const cache: { [id: string]: true | undefined } = {};

    return data.filter((x) => {
      if (
        x.destinationTokenSymbol === "WETH" ||
        x.originTokenSymbol === "WETH"
      ) {
        return false;
      }

      const id = getRouteId(x);
      if (cache[id]) {
        return;
      }
      cache[id] = true;

      const validChain =
        !!acrossDomains.find((d) => d.chain.id === x.originChainId) &&
        !!acrossDomains.find((d) => d.chain.id === x.destinationChainId);

      const validToken = (() => {
        if (
          x.originTokenSymbol === "ETH" &&
          x.destinationTokenSymbol === "ETH"
        ) {
          return true;
        }

        if (
          x.originTokenSymbol === "USDC" &&
          x.destinationTokenSymbol === "USDC"
        ) {
          return true;
        }

        if (
          x.destinationChainId === mode.id &&
          x.destinationTokenSymbol === "USDC.e" &&
          x.originTokenSymbol === "USDC"
        ) {
          return true;
        }

        if (
          x.originChainId === mode.id &&
          x.originTokenSymbol === "USDC.e" &&
          x.destinationTokenSymbol === "USDC"
        ) {
          return true;
        }

        return false;
      })();

      return validChain && validToken;
    });
  }, [data, acrossDomains]);
};
