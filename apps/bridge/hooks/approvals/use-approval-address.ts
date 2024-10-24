import { Address } from "viem";

import { RouteResultDto } from "@/codegen/model";
import { isRouteQuote } from "@/utils/guards";

import { useSelectedBridgeRoute } from "../routes/use-selected-bridge-route";

export function useApprovalAddress(): Address | undefined {
  const route = useSelectedBridgeRoute();
  return useApprovalAddressForRoute(route.data);
}

export function useApprovalAddressForRoute(
  route: RouteResultDto | undefined | null
): Address | undefined {
  if (!route || !isRouteQuote(route.result)) {
    return;
  }

  return route.result.tokenApprovalAddress as Address | undefined;
}
