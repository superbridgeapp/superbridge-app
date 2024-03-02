import { DeploymentDto } from "@/codegen/model";
import { isArbitrum, isMainnet, isOptimism } from "@/utils/is-mainnet";

const ONE_MINUTE = 60;
const ONE_HOUR = 60 * 60;
const ONE_DAY = 60 * 60 * 24;

export const useFinalizationPeriod = (
  deployment: DeploymentDto | null
):
  | { period: "days"; value: number }
  | { period: "hours"; value: number }
  | { period: "mins"; value: number }
  | null => {
  if (!deployment) {
    return null;
  }

  if (isOptimism(deployment)) {
    if (deployment.config.finalizationPeriodSeconds > ONE_DAY) {
      return {
        period: "days",
        value: deployment.config.finalizationPeriodSeconds / ONE_DAY,
      };
    }
    if (deployment.config.finalizationPeriodSeconds > ONE_HOUR) {
      return {
        period: "hours",
        value: deployment.config.finalizationPeriodSeconds / ONE_HOUR,
      };
    }
    return {
      period: "mins",
      value: Math.max(
        deployment.config.finalizationPeriodSeconds / ONE_MINUTE,
        1
      ),
    };
  }

  if (isArbitrum(deployment)) {
    if (isMainnet(deployment)) {
      return { period: "days", value: 7 };
    }
    return { period: "hours", value: 2 };
  }

  return null;
};
