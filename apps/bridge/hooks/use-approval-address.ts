import { Address } from "viem";

import { isRouteQuote } from "@/utils/guards";

import { useSelectedBridgeRoute } from "./use-selected-bridge-route";

export function useApprovalAddress(): Address | undefined {
  const route = useSelectedBridgeRoute();

  if (!route.data || !isRouteQuote(route.data.result)) {
    return;
  }

  return route.data.result.tokenApprovalAddress as Address | undefined;
}
