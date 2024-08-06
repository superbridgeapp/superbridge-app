import { RouteProvider } from "@/codegen/model";

import { useSelectedBridgeRoute } from "../routes/use-selected-bridge-route";

export const useIsCctpRoute = () => {
  const route = useSelectedBridgeRoute();
  return route.data?.id === RouteProvider.Cctp;
};
