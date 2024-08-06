import { Address } from "viem";

import { isRouteQuote } from "@/utils/guards";

import { useSelectedBridgeRoute } from "./routes/use-selected-bridge-route";

export function useApprovalAddressGasToken(): Address | undefined {
  const route = useSelectedBridgeRoute();

  if (!route.data || !isRouteQuote(route.data.result)) {
    return;
  }

  return route.data.result.gasTokenApprovalAddress as Address | undefined;
}
