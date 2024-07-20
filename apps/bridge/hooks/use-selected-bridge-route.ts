import { useConfigState } from "@/state/config";

import { useBridgeRoutes } from "./use-bridge-routes";

export const useSelectedBridgeRoute = () => {
  const routes = useBridgeRoutes();
  const routeId = useConfigState.useRouteId();

  if (!routeId) {
    return routes?.[0] ?? null;
  }
  return routes?.find((x) => x.id === routeId) ?? null;
};
