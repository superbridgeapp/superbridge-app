import { RouteProvider } from "@/codegen/model";

import { useSelectedBridgeRoute } from "../use-selected-bridge-route";

export const useIsAcrossRoute = () => {
  const route = useSelectedBridgeRoute();
  return route.data?.id === RouteProvider.Across;
};
