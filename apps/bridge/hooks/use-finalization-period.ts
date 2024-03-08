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

const cctpPeriod = (deployment: DeploymentDto | null): Period => {
  if (!deployment) return null;
  return { period: "mins", value: isMainnet(deployment) ? 15 : 3 };
};

export const useFinalizationPeriod = (
  deployment: DeploymentDto | null
): Period => {
  const stateToken = useConfigState.useToken();

  if (!deployment) {
    return null;
  }

  if (isNativeUsdc(stateToken)) {
    return cctpPeriod(deployment);
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

export const useDepositTime = (deployment: DeploymentDto | null): Period => {
  if (deployment && isOptimism(deployment)) {
    return { period: "mins", value: 3 };
  }

  if (deployment && isArbitrum(deployment)) {
    return { period: "mins", value: 10 };
  }

  return null;
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
  const finalize = useFinalizationPeriod(deployment);
  const deposit = useDepositTime(deployment);

  if (!withdrawing) {
    return deposit;
  }

  if (isNativeUsdc(stateToken)) {
    if (escapeHatch) {
      return addPeriods(deposit, cctpPeriod(deployment));
    }
    return cctpPeriod(deployment);
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
