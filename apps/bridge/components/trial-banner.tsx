import { formatDistance } from "date-fns";

import {
  ActiveDeploymentStatus,
  DeploymentDto,
  DeploymentStatus,
  TrialDeploymentStatus,
} from "@/codegen/model";
import { useDeployment } from "@/hooks/use-deployment";

const isActive = (
  s: TrialDeploymentStatus | ActiveDeploymentStatus
): s is ActiveDeploymentStatus => {
  return s.status === DeploymentStatus.active;
};

const isTrial = (
  s: TrialDeploymentStatus | ActiveDeploymentStatus
): s is TrialDeploymentStatus => {
  return s.status === DeploymentStatus.trial;
};

export const useTrialEndsTime = () => {
  const deployment = useDeployment();

  if (!deployment || !isTrial(deployment.status)) {
    return null;
  }

  return new Date(deployment.status.endDate).getTime();
};

export const TrialBanner = () => {
  const deployment = useDeployment();
  const trialEndsTime = useTrialEndsTime();

  if (!trialEndsTime) {
    return null;
  }

  return (
    <div>Free trial ends in {formatDistance(Date.now(), trialEndsTime)}</div>
  );
};
