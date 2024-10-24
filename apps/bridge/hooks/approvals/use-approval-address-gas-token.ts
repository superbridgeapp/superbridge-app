import { Address } from "viem";

import { RouteResultDto } from "@/codegen/model";
import { isRouteQuote } from "@/utils/guards";

import { useSelectedBridgeRoute } from "../routes/use-selected-bridge-route";

export function useApprovalAddressGasToken(): Address | undefined {
  const route = useSelectedBridgeRoute();
  return useGasTokenApproveAddressForRoute(route.data);
}

export function useGasTokenApproveAddressForRoute(
  route: RouteResultDto | null
): Address | undefined {
  if (!route || !isRouteQuote(route.result)) {
    return;
  }

  return route.result.gasTokenApprovalAddress as Address | undefined;
}
