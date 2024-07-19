import { formatUnits } from "viem";

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

  return {
    data: formatUnits(BigInt(route.receive), token.decimals),
    isFetching: false,
  };
};
