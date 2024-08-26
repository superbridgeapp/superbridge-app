import { RouteProvider } from "@/codegen/model";

import { useSelectedBridgeRoute } from "../routes/use-selected-bridge-route";

export const useIsHyperlaneRoute = () => {
  const route = useSelectedBridgeRoute();
  return route.data?.id === RouteProvider.Hyperlane;
};
