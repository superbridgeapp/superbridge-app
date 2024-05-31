import { useTranslation } from "react-i18next";

import { useConfigState } from "@/state/config";

import { useAcrossLimits } from "./across/use-across-limits";
import { useDeployment } from "./use-deployment";
import { Period, useTotalBridgeTime } from "./use-finalization-period";
import { useWeiAmount } from "./use-wei-amount";

const useFastTransferPeriod = (): Period => {
  const weiAmount = useWeiAmount();
  const limits = useAcrossLimits();

  console.log(limits.data, limits.error);
  if (!limits.data) {
    return null;
  }
  if (weiAmount < BigInt(limits.data.maxDepositInstant)) {
    return { period: "mins", value: 3 };
  }

  if (weiAmount < BigInt(limits.data.maxDepositShortDelay)) {
    return { period: "mins", value: 10 };
  }

  return { period: "hours", value: 3 };
};

export const useTransferTime = () => {
  const fast = useConfigState.useFast();
  const deployment = useDeployment();
  const { t } = useTranslation();
  const transferPeriod = useTotalBridgeTime(deployment);
  const fastTransferPeriod = useFastTransferPeriod();

  const time = fast ? fastTransferPeriod : transferPeriod;

  if (time?.period === "mins") {
    return t("transferTimeMinutes", { count: time.value });
  }

  if (time?.period === "hours") {
    return t("transferTimeHours", { count: time.value });
  }

  if (!time) {
    return "";
  }

  return t("transferTimeDays", { count: time?.value });
};
