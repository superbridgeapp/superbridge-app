import { isRouteQuote, isRouteTransactionStep } from "@/utils/guards";

import { useSelectedBridgeRoute } from "./use-selected-bridge-route";

export const useInitiatingChainId = () => {
  const route = useSelectedBridgeRoute();

  return route?.result &&
    isRouteQuote(route.result) &&
    route.result.steps[0] &&
    isRouteTransactionStep(route.result.steps[0])
    ? parseInt(route.result.steps[0].chainId)
    : null;
};
