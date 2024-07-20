import { isAmountTooSmallRouteError } from "@/utils/guards";

import { useSelectedBridgeRoute } from "../use-selected-bridge-route";

export const useBridgeMin = () => {
  const route = useSelectedBridgeRoute();

  if (!!route?.result && isAmountTooSmallRouteError(route.result)) {
    return BigInt(route.result.minimum);
  }

  return null;
};
