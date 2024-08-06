import { isAmountTooLargeRouteError } from "@/utils/guards";

import { useSelectedBridgeRoute } from "../routes/use-selected-bridge-route";

export const useBridgeMax = () => {
  const route = useSelectedBridgeRoute();

  if (!!route.data?.result && isAmountTooLargeRouteError(route.data.result)) {
    return BigInt(route.data.result.maximum);
  }

  return null;
};
