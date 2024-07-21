import { isRouteQuote, isRouteWaitStep } from "@/utils/guards";

import { getPeriod } from "./use-finalization-period";
import { useSelectedBridgeRoute } from "./use-selected-bridge-route";
import { useTransformPeriodText } from "./use-transform-period-text";

export const useApproxTotalBridgeTime = () => {
  const route = useSelectedBridgeRoute();

  if (route?.result && isRouteQuote(route.result)) {
    const ms = route.result.steps.reduce(
      (accum, x) => (isRouteWaitStep(x) ? x.duration + accum : accum),
      0
    );
    return getPeriod(ms / 1000);
  }

  return null;
};

export const useApproxTotalBridgeTimeText = () => {
  const time = useApproxTotalBridgeTime();

  const transformPeriod = useTransformPeriodText();

  return transformPeriod("transferTime", {}, time);
};
