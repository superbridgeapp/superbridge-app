import { useTranslation } from "react-i18next";

import { useConfigState } from "@/state/config";
import { isRouteQuote, isRouteWaitStep } from "@/utils/guards";

import { useAcrossLimits } from "./across/use-across-limits";
import { useDeployment } from "./use-deployment";
import {
  Period,
  getPeriod,
  useTotalBridgeTime,
} from "./use-finalization-period";
import { useSelectedBridgeRoute } from "./use-selected-bridge-route";
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

export const useTransferTime = () => {
  const fast = useConfigState.useFast();
  const deployment = useDeployment();
  const { t } = useTranslation();
  const transferPeriod = useTotalBridgeTime(deployment);
  const fastTransferPeriod = useFastTransferPeriod();

  const time = fast ? fastTransferPeriod : transferPeriod;

  if (!time) {
    return "";
  }

  if (time?.period === "mins") {
    return t("transferTimeMinutes", { count: time.value });
  }

  if (time?.period === "hours") {
    return t("transferTimeHours", { count: time.value });
  }

  return t("transferTimeDays", { count: time?.value });
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
