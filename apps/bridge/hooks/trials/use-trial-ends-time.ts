import { isTrial } from "@/utils/guards";

import { useDeployment } from "../use-deployment";

export const useTrialEndsTime = () => {
  const deployment = useDeployment();

  if (!deployment || !isTrial(deployment.status)) {
    return null;
  }

  return new Date(deployment.status.endDate).getTime();
};
