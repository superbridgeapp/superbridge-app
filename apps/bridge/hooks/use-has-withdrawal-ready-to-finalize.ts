import { isOptimism } from "@/utils/deployments/is-mainnet";

import { useDeployment } from "./deployments/use-deployment";
import { useFaultProofUpgradeTime } from "./use-fault-proof-upgrade-time";
import { useStatusCheck } from "./use-status-check";
import { useTransactions } from "./use-transactions";

export const useHasWithdrawalReadyToFinalize = () => {
  const deployment = useDeployment();
  const { hasWithdrawalReadyToFinalize } = useTransactions();
  const statusCheck = useStatusCheck();
  const faultProofUpgradeTime = useFaultProofUpgradeTime(deployment);

  if (
    !deployment ||
    statusCheck ||
    !isOptimism(deployment) ||
    !faultProofUpgradeTime
  ) {
    return false;
  }

  return hasWithdrawalReadyToFinalize === deployment.id;
};
