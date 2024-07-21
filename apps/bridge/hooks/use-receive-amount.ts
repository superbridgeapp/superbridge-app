import { formatUnits } from "viem";

import { isRouteQuote } from "@/utils/guards";

import { useSelectedBridgeRoute } from "./use-selected-bridge-route";
import { useSelectedToken } from "./use-selected-token";

export const useReceiveAmount = () => {
  const route = useSelectedBridgeRoute();
  const token = useSelectedToken();

  if (route.isLoading) {
    return {
      data: null,
      isFetching: true,
    };
  }

  const data =
    !!route.data && isRouteQuote(route.data.result) && !!token
      ? parseFloat(
          formatUnits(BigInt(route.data.result.receive), token.decimals)
        )
      : null;

  return {
    data,
    isFetching: false,
  };
};
