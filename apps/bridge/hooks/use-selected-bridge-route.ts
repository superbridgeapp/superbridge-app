import { useConfigState } from "@/state/config";
import { isRouteQuoteError } from "@/utils/guards";

import { useBridgeRoutes } from "./use-bridge-routes";

export const useSelectedBridgeRoute = () => {
  const routes = useBridgeRoutes();
  const routeId = useConfigState.useRouteId();

  if (!routeId) {
    const successful = routes?.find((x) => !isRouteQuoteError(x.result));
    if (successful) {
      return successful;
    }
    return routes?.[0] ?? null;
  }
  return routes?.find((x) => x.id === routeId) ?? null;
};
