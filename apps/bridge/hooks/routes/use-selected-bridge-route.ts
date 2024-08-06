import { useConfigState } from "@/state/config";
import { isRouteQuoteError } from "@/utils/guards";

import { useBridgeRoutes } from "./use-bridge-routes";

export const useSelectedBridgeRoute = () => {
  const routes = useBridgeRoutes();
  const routeId = useConfigState.useRouteId();

  if (routes.isLoading) {
    return { isLoading: true, data: null };
  }

  // take first successful otherwise take first
  if (!routeId) {
    const successful = routes.data?.results.find(
      (x) => !isRouteQuoteError(x.result)
    );
    return {
      isLoading: false,
      data: successful ?? routes.data?.results[0] ?? null,
    };
  }

  // if we've explicitly chosen a route, keep taking that
  return {
    isLoading: false,
    data: routes.data?.results.find((x) => x.id === routeId) ?? null,
  };
};
