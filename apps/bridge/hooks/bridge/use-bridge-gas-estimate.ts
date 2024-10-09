import { RouteResultDto } from "@/codegen/model";

import { useSelectedBridgeRoute } from "../routes/use-selected-bridge-route";
import { useRouteGasEstimate } from "./use-route-gas-estimate";

export const useBridgeGasEstimate = () => {
  const route = useSelectedBridgeRoute();
  return useBridgeGasEstimateForRoute(route.data);
};

export const useBridgeGasEstimateForRoute = (route: RouteResultDto | null) => {
  const estimate = useRouteGasEstimate(route);
  if (!estimate.data) {
    return null;
  }

  return estimate.data[estimate.data.length - 1];

  // const estimate = useEstimateGas({
  //   data: initiatingTransaction?.data as Address,
  //   to: initiatingTransaction?.to as Address,
  //   chainId: parseInt(initiatingTransaction?.chainId ?? "0"),
  //   value: BigInt(initiatingTransaction?.value ?? "0"),
  //   query: {
  //     enabled: !!initiatingTransaction && !initiatingTransaction.gas,
  //   },
  // });

  // console.log(">>>", initiatingTransaction?.gas, estimate.data);

  // if (initiatingTransaction?.gas) {
  //   return BigInt(initiatingTransaction.gas);
  // }

  // return estimate.data
  //   ? estimate.data + estimate.data / BigInt("50")
  //   : undefined;
};
