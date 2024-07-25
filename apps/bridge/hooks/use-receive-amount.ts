import { useConfigState } from "@/state/config";
import { isRouteQuote } from "@/utils/guards";

import { useToChain } from "./use-chain";
import { useGetFormattedAmount } from "./use-get-formatted-amount";
import { useSelectedBridgeRoute } from "./use-selected-bridge-route";
import { useSelectedToken } from "./use-selected-token";

export const useReceiveAmount = () => {
  const route = useSelectedBridgeRoute();
  const token = useSelectedToken();
  const stateToken = useConfigState.useToken();
  const to = useToChain();
  const getFormattedAmount = useGetFormattedAmount(stateToken, to?.id);

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
