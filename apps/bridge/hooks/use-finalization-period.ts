import { DeploymentDto } from "@/codegen/model";
import { useConfigState } from "@/state/config";
import { isArbitrum, isMainnet, isOptimism } from "@/utils/is-mainnet";
import { isNativeUsdc } from "@/utils/is-usdc";

const ONE_MINUTE = 60;
const ONE_HOUR = 60 * 60;
const ONE_DAY = 60 * 60 * 24;

export type Period =
  | { period: "days"; value: number }
  | { period: "hours"; value: number }
  | { period: "mins"; value: number }
  | null;

export const useFinalizationPeriod = (
  deployment: DeploymentDto | null
): Period => {
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

export const useProvePeriod = (deployment: DeploymentDto | null): Period => {
  if (!deployment || !isOptimism(deployment)) {
    return null;
  }

  if (isMainnet(deployment)) {
    return {
      period: "hours",
      value: 2,
    };
  }

  return {
    period: "mins",
    value: 5,
  };
};

/**
 *
 * @param deployment
 * @returns
 */
export const useTotalBridgeTime = (
  deployment: DeploymentDto | null
): Period => {
  const withdrawing = useConfigState.useWithdrawing();
  const stateToken = useConfigState.useToken();
  const prove = useProvePeriod(deployment);
  const finalize = useFinalizationPeriod(deployment);

  if (!withdrawing) {
    if (isNativeUsdc(stateToken)) {
      return { period: "mins", value: isMainnet(deployment) ? 15 : 3 };
    }
    if (deployment && isOptimism(deployment)) {
      return { period: "mins", value: 3 };
    }
    if (deployment && isArbitrum(deployment)) {
      return { period: "mins", value: 10 };
    }
  }

  if (!prove) {
    return finalize;
  }

  if (!finalize) {
    return null;
  }

  if (prove.period === finalize.period) {
    return {
      period: prove.period,
      value: prove.value + finalize.value,
    };
  }

  // take the biggest of the two
  if (prove.period === "days") return prove;
  if (finalize.period === "days") return finalize;
  if (prove.period === "hours") return prove;
  if (finalize.period === "hours") return prove;
  return prove;
};
