import { DeploymentDto } from "@/codegen/model";
import { useConfigState } from "@/state/config";
import { isArbitrum, isMainnet, isOptimism } from "@/utils/is-mainnet";
import { isNativeUsdc } from "@/utils/is-usdc";

import { useDeployment } from "./use-deployment";

const ONE_MINUTE = 60;
const ONE_HOUR = 60 * 60;
const ONE_DAY = 60 * 60 * 24;

export type Period =
  | { period: "days"; value: number }
  | { period: "hours"; value: number }
  | { period: "mins"; value: number }
  | null;

export const cctpPeriod = (deployment: DeploymentDto | null): Period => {
  if (!deployment) return null;
  return { period: "mins", value: isMainnet(deployment) ? 20 : 5 };
};

export const getPeriod = (seconds: number): Period => {
  if (seconds >= ONE_DAY) {
    return {
      period: "days",
      value: seconds / ONE_DAY,
    };
  }
  if (seconds >= ONE_HOUR) {
    return {
      period: "hours",
      value: seconds / ONE_HOUR,
    };
  }
  return {
    period: "mins",
    value: Math.max(seconds / ONE_MINUTE, 1),
  };
};

export const getFinalizationPeriod = (
  deployment: DeploymentDto | null,
  isCctp: boolean
): Period => {
  if (!deployment) {
    return null;
  }

  if (isCctp) {
    return cctpPeriod(deployment);
  }

  if (isOptimism(deployment)) {
    return getPeriod(deployment.config.finalizationPeriodSeconds);
  }

  if (isArbitrum(deployment)) {
    if (isMainnet(deployment)) {
      return { period: "days", value: 7 };
    }
    return { period: "hours", value: 2 };
  }

  return null;
};

export const useFinalizationPeriod = (): Period => {
  const stateToken = useConfigState.useToken();
  const deployment = useDeployment();
  return getFinalizationPeriod(deployment, isNativeUsdc(stateToken));
};

export const getProvePeriod = (deployment: DeploymentDto | null): Period => {
  if (!deployment || !isOptimism(deployment)) {
    return null;
  }

  return getPeriod(
    deployment.config.blockTimeSeconds *
      // todo: this is not SubmissionIntervalSeconds but actually SubmissionIntervalBlocks
      deployment.config.submissionIntervalSeconds
  );
};

export const useProvePeriod = (deployment: DeploymentDto | null): Period => {
  return getProvePeriod(deployment);
};

export const getDepositTime = (deployment: DeploymentDto | null): Period => {
  if (deployment && isOptimism(deployment)) {
    return { period: "mins", value: 3 };
  }

  if (deployment && isArbitrum(deployment)) {
    return { period: "mins", value: 10 };
  }

  return null;
};
export const useDepositTime = (deployment: DeploymentDto | null): Period => {
  return getDepositTime(deployment);
};

export const addPeriods = (a: Period, b: Period) => {
  if (!a && !b) return null;
  if (!a) return b;
  if (!b) return a;

  if (a.period === b.period) {
    return {
      period: a.period,
      value: a.value + b.value,
    };
  }

  // take the biggest of the two
  if (a.period === "days") return a;
  if (b.period === "days") return b;
  if (a.period === "hours") return a;
  if (b.period === "hours") return a;
  return a;
};

export const useTotalBridgeTime = (
  deployment: DeploymentDto | null
): Period => {
  const withdrawing = useConfigState.useWithdrawing();
  const escapeHatch = useConfigState.useForceViaL1();
  const stateToken = useConfigState.useToken();

  const prove = useProvePeriod(deployment);
  const finalize = getFinalizationPeriod(deployment, isNativeUsdc(stateToken));
  const deposit = useDepositTime(deployment);

  if (isNativeUsdc(stateToken)) {
    if (escapeHatch) {
      return addPeriods(deposit, cctpPeriod(deployment));
    }
    return cctpPeriod(deployment);
  }

  if (!withdrawing) {
    return deposit;
  }

  if (!prove) {
    return finalize;
  }

  if (!finalize) {
    return null;
  }

  const total = addPeriods(prove, finalize);
  if (escapeHatch && deposit) {
    return addPeriods(total, deposit);
  }
  return total;
};
