// import { isSuperbridge } from "@/config/superbridge";
// import { isTrial } from "@/utils/guards";

// import { useDeployment } from "../use-deployment";

export const useTrialExpired = () => {
  return false;
  // const deployment = useDeployment();

  // if (isSuperbridge || !deployment || !isTrial(deployment.status)) {
  //   return false;
  // }

  // return new Date(deployment.status.endDate).getTime() < Date.now();
};
