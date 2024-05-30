import { useTranslation } from "react-i18next";

import { useDeployment } from "./use-deployment";
import { useTotalBridgeTime } from "./use-finalization-period";

export const useTransferTime = () => {
  const deployment = useDeployment();
  const { t } = useTranslation();
  const time = useTotalBridgeTime(deployment);

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
