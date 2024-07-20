import { formatUnits } from "viem";

import { isRouteQuote } from "@/utils/guards";

import { useSelectedBridgeRoute } from "./use-selected-bridge-route";
import { useSelectedToken } from "./use-selected-token";

export const useReceiveAmount = () => {
  const route = useSelectedBridgeRoute();
  const token = useSelectedToken();

  if (!route || !token) {
    return {
      data: null,
      isFetching: true,
    };
  }

  const data =
    !!route && isRouteQuote(route.result)
      ? parseFloat(formatUnits(BigInt(route.result.receive), token.decimals))
      : null;

  return {
    data,
    isFetching: false,
  };
};
