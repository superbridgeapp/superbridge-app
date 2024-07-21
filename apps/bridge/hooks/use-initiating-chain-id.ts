import { isRouteQuote, isRouteTransactionStep } from "@/utils/guards";

import { useSelectedBridgeRoute } from "./use-selected-bridge-route";

export const useInitiatingChainId = () => {
  const route = useSelectedBridgeRoute();

  return route.data?.result &&
    isRouteQuote(route.data.result) &&
    route.data.result.steps[0] &&
    isRouteTransactionStep(route.data.result.steps[0])
    ? parseInt(route.data.result.steps[0].chainId)
    : null;
};
