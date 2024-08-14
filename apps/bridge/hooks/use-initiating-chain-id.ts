import { isRouteQuote, isRouteTransactionStep } from "@/utils/guards";

import { useSelectedBridgeRoute } from "./routes/use-selected-bridge-route";
import { useChain } from "./use-chain";

export const useInitiatingChainId = () => {
  const route = useSelectedBridgeRoute();

  return route.data?.result &&
    isRouteQuote(route.data.result) &&
    route.data.result.steps[0] &&
    isRouteTransactionStep(route.data.result.steps[0])
    ? parseInt(route.data.result.steps[0].chainId)
    : null;
};

export const useInitiatingChain = () => {
  const chainId = useInitiatingChainId();
  return useChain(chainId);
};
