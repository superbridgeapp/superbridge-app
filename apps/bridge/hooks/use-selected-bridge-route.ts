import { useConfigState } from "@/state/config";
import { isRouteQuoteError } from "@/utils/guards";

import { useBridgeRoutes } from "./use-bridge-routes";

export const useSelectedBridgeRoute = () => {
  const routes = useBridgeRoutes();
  const routeId = useConfigState.useRouteId();

  if (!routeId) {
    return routes?.find((x) => !isRouteQuoteError(x.result)) ?? null;
  }
  return routes?.find((x) => x.id === routeId) ?? null;
};
