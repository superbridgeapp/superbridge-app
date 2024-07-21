import { isAmountTooSmallRouteError } from "@/utils/guards";

import { useSelectedBridgeRoute } from "../use-selected-bridge-route";

export const useBridgeMin = () => {
  const route = useSelectedBridgeRoute();

  if (!!route.data?.result && isAmountTooSmallRouteError(route.data.result)) {
    return BigInt(route.data.result.minimum);
  }

  return null;
};
