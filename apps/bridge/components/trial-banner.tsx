import { differenceInDays } from "date-fns";

import {
  ActiveDeploymentStatus,
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
  const trialEndsTime = useTrialEndsTime();

  if (!trialEndsTime) {
    return null;
  }

  const days = Math.max(differenceInDays(Date.now(), trialEndsTime), 0);
  return (
    <div>
      <div>
        This is a free trial bridge made with{" "}
        <a href="https://superbridge.app/rollies">SUPERBRIDGE ROLLIES</a>
      </div>
      <div>{days} DAYS LEFT</div>
    </div>
  );
};
