import { isAmountTooLargeRouteError } from "@/utils/guards";

import { useSelectedBridgeRoute } from "../use-selected-bridge-route";

export const useBridgeMax = () => {
  const route = useSelectedBridgeRoute();

  if (!!route?.result && isAmountTooLargeRouteError(route.result)) {
    return BigInt(route.result.maximum);
  }

  return null;
};
