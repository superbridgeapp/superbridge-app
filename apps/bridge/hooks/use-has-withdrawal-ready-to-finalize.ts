import { useDeployments } from "./deployments/use-deployments";
import { useFaultProofUpgradeTime } from "./use-fault-proof-upgrade-time";
import { useStatusCheck } from "./use-status-check";
import { useTransactions } from "./use-transactions";

export const useHasWithdrawalReadyToFinalize = () => {
  const { hasWithdrawalReadyToFinalize } = useTransactions();
  const statusCheck = useStatusCheck();
  const faultProofUpgradeTime = useFaultProofUpgradeTime(
    useDeployments().find((x) => x.name === "base")
  );

  if (statusCheck || !faultProofUpgradeTime) {
    return false;
  }

  return !!hasWithdrawalReadyToFinalize;
};
