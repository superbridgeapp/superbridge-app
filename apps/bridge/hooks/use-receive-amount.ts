import { isRouteQuote } from "@/utils/guards";

import { useSelectedBridgeRoute } from "./routes/use-selected-bridge-route";
import { useDestinationToken } from "./tokens/use-token";
import { useGetFormattedAmount } from "./use-get-formatted-amount";

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
