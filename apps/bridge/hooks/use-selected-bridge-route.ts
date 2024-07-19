import { useConfigState } from "@/state/config";

import { useBridgeRoutes } from "./use-bridge-routes";

export const useSelectedBridgeRoute = () => {
  const routes = useBridgeRoutes();
  const routeIndex = useConfigState.useRouteIndex();

  return routes?.[routeIndex];
};
