import { isRouteQuoteError } from "@/utils/guards";

import { useSelectedBridgeRoute } from "../use-selected-bridge-route";

export const useBridgePaused = () => {
  const route = useSelectedBridgeRoute().data;

  return (
    !!route?.result &&
    isRouteQuoteError(route.result) &&
    route.result.type === "Paused"
  );
};
