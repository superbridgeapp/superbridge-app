import { useBridgeRoutes } from "./use-bridge-routes";

export const useRouteRequest = () => {
  const response = useBridgeRoutes();

  return response.data?.request ?? null;
};
