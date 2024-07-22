import { isRouteQuote, isRouteWaitStep } from "@/utils/guards";

import { Period, getPeriod } from "./use-finalization-period";
import { useSelectedBridgeRoute } from "./use-selected-bridge-route";
import { useTransformPeriodText } from "./use-transform-period-text";

export const useApproxTotalBridgeTime = () => {
  const route = useSelectedBridgeRoute();

  let data: null | Period = null;

  if (route.data?.result && isRouteQuote(route.data.result)) {
    const ms = route.data?.result.steps.reduce(
      (accum, x) => (isRouteWaitStep(x) ? x.duration + accum : accum),
      0
    );
    data = getPeriod(ms / 1000);
  }

  return {
    isLoading: route.isLoading,
    data,
  };
};

export const useApproxTotalBridgeTimeText = () => {
  const time = useApproxTotalBridgeTime();

  const transformPeriod = useTransformPeriodText();

  if (time.isLoading) {
    return {
      data: null,
      isLoading: time.isLoading,
    };
  }

  if (!time.data) {
    return {
      isLoading: false,
      data: null,
    };
  }

  return {
    data: transformPeriod("transferTime", {}, time.data),
    isLoading: false,
  };
};
