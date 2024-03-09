import { useTranslation } from "react-i18next";

import { useConfigState } from "@/state/config";

import { useTotalBridgeTime } from "./use-finalization-period";

export const useTransferTime = () => {
  const deployment = useConfigState.useDeployment();
  const { t } = useTranslation();
  const time = useTotalBridgeTime(deployment);

  if (time?.period === "mins") {
    return t("transferTimeMinutes", { count: time.value });
  }

  if (time?.period === "hours") {
    return t("transferTimeHours", { count: time.value });
  }

  return t("transferTimeDays", { count: time?.value });
};
