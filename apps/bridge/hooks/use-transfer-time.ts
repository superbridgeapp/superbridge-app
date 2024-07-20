import { isRouteQuote, isRouteWaitStep } from "@/utils/guards";

import { useAcrossLimits } from "./across/use-across-limits";
import { Period, getPeriod } from "./use-finalization-period";
import { useSelectedBridgeRoute } from "./use-selected-bridge-route";
import { useTransformPeriodText } from "./use-transform-period-text";
import { useWeiAmount } from "./use-wei-amount";

export const useFastTransferPeriod = (): Period => {
  const weiAmount = useWeiAmount();
  const limits = useAcrossLimits();

  if (!limits.data) {
    return { period: "mins", value: 1.5 };
  }

  if (weiAmount < BigInt(limits.data.maxDepositInstant)) {
    return { period: "mins", value: 1.5 };
  }

  if (weiAmount < BigInt(limits.data.maxDepositShortDelay)) {
    return { period: "mins", value: 15 };
  }

  return { period: "mins", value: 90 };
};

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
