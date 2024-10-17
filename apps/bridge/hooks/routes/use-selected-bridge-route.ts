import { RouteProvider } from "@/codegen/model";
import { useConfigState } from "@/state/config";
import { isRouteQuoteError } from "@/utils/guards";

import { useBridgeRoutes } from "./use-bridge-routes";

const useValidRouteIds = (
  selectedRouteId: RouteProvider | null
): (RouteProvider | null)[] => {
  if (
    selectedRouteId === RouteProvider.ArbitrumDeposit ||
    selectedRouteId === RouteProvider.ArbitrumWithdrawal
  ) {
    return [RouteProvider.ArbitrumDeposit, RouteProvider.ArbitrumWithdrawal];
  }

  if (
    selectedRouteId === RouteProvider.OptimismDeposit ||
    selectedRouteId === RouteProvider.OptimismWithdrawal ||
    selectedRouteId === RouteProvider.OptimismForcedWithdrawal
  ) {
    return [
      RouteProvider.OptimismDeposit,
      RouteProvider.OptimismWithdrawal,
      RouteProvider.OptimismForcedWithdrawal,
    ];
  }

  return [selectedRouteId];
};

export const useSelectedBridgeRoute = () => {
  const routes = useBridgeRoutes();
  const routeId = useConfigState.useRouteId();
  const validRouteIds = useValidRouteIds(routeId);

  if (routes.isLoading) {
    return { isLoading: true, data: null };
  }

  // take first successful otherwise take first
  if (!routeId) {
    const successful = routes.data?.results.find(
      (x) => !isRouteQuoteError(x.result)
    );
    return {
      isLoading: false,
      data: successful ?? routes.data?.results[0] ?? null,
    };
  }

  // if we've explicitly chosen a route, keep taking that
  // if we explicitly choose a native deposit, it will mean when
  // we switch direction the withdrawal won't render. So ensure
  // we take the opposite
  return {
    isLoading: false,
    data:
      routes.data?.results.find((x) => validRouteIds.includes(x.id)) ?? null,
  };
};
