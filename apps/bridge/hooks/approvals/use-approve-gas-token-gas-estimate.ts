import { useRouteGasEstimate } from "../bridge/use-route-gas-estimate";
import { useSelectedBridgeRoute } from "../routes/use-selected-bridge-route";
import { useGasTokenApproveAddressForRoute } from "./use-approval-address-gas-token";

export function useApproveGasTokenGasEstimate() {
  const route = useSelectedBridgeRoute();
  const gasTokenApproveAddress = useGasTokenApproveAddressForRoute(route.data);

  const routeGasEstimate = useRouteGasEstimate(route.data);

  if (!routeGasEstimate.data) {
    return null;
  }

  // eth bridge, no approval needed
  if (routeGasEstimate.data.length === 1) {
    return null;
  }

  // token bridge
  if (routeGasEstimate.data.length === 2) {
    // custom gas token
    if (gasTokenApproveAddress) {
      return routeGasEstimate.data[0];
    } else {
      return null;
    }
  }

  if (routeGasEstimate.data.length === 3) {
    return routeGasEstimate.data[1];
  }

  return null;
}
