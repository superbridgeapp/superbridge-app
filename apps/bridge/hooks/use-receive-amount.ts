import { isRouteQuote } from "@/utils/guards";

import { useGetFormattedAmount } from "./use-get-formatted-amount";
import { useSelectedBridgeRoute } from "./use-selected-bridge-route";
import { useDestinationToken } from "./use-selected-token";

export const useReceiveAmount = () => {
  const route = useSelectedBridgeRoute();
  const token = useDestinationToken();
  const getFormattedAmount = useGetFormattedAmount(token);

  if (route.isLoading) {
    return {
      data: null,
      isFetching: true,
    };
  }

  const data =
    !!route.data && isRouteQuote(route.data.result) && !!token
      ? getFormattedAmount(route.data.result.receive)
      : null;

  return {
    data,
    isFetching: false,
  };
};
