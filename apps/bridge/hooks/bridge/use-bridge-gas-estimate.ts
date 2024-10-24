import { useQuery } from "@tanstack/react-query";

import { RouteResultDto } from "@/codegen/model";

import { useSelectedBridgeRoute } from "../routes/use-selected-bridge-route";
import { useRouteGasEstimate } from "./use-route-gas-estimate";

export const useBridgeGasEstimate = () => {
  const route = useSelectedBridgeRoute();
  return useBridgeGasEstimateForRoute(route.data);
};

export const useBridgeGasEstimateForRoute = (route: RouteResultDto | null) => {
  const estimate = useRouteGasEstimate(route);

  return useQuery({
    queryKey: [
      "bridge gas estimate",
      route?.id,
      ...(estimate?.data?.estimates.map((x) => x.limit) ?? []),
    ],
    queryFn: () => {
      if (!estimate.data) return null;
      return estimate.data.estimates[estimate.data.estimates.length - 1].limit;
    },
  });
};
