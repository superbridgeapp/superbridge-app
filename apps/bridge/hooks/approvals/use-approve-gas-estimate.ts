import { useRouteGasEstimate } from "../bridge/use-route-gas-estimate";
import { useSelectedBridgeRoute } from "../routes/use-selected-bridge-route";
import { useGasTokenApproveAddressForRoute } from "./use-approval-address-gas-token";

export function useApproveGasEstimate() {
  const route = useSelectedBridgeRoute();
  const gasTokenApproveAddress = useGasTokenApproveAddressForRoute(route.data);

  const routeGasEstimate = useRouteGasEstimate(route.data);

  if (!routeGasEstimate.data) {
    return null;
  }

  // eth bridge, no approval needed
  if (routeGasEstimate.data.estimates.length === 1) {
    return null;
  }

  // token bridge
  if (routeGasEstimate.data.estimates.length === 2) {
    // custom gas token, no approval needed
    if (gasTokenApproveAddress) {
      return null;
    } else {
      return routeGasEstimate.data.estimates[0].limit;
    }
  }

  if (routeGasEstimate.data.estimates.length === 3) {
    return routeGasEstimate.data.estimates[1].limit;
  }

  return null;
}
