import { isTrial } from "@/utils/guards";

import { useDeployment } from "../use-deployment";

export const useTrialExpired = () => {
  const deployment = useDeployment();

  if (!deployment || !isTrial(deployment.status)) {
    return false;
  }

  return true;
  // return new Date(deployment.status.endDate).getTime() < Date.now();
};
