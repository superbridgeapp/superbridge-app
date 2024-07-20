import { RouteProvider } from "@/codegen/model";

import { useSelectedBridgeRoute } from "../use-selected-bridge-route";

export const useIsCctpRoute = () => {
  const route = useSelectedBridgeRoute();
  return route?.id === RouteProvider.Cctp;
};
