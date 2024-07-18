import {
  isOptimismForcedWithdrawal,
  isOptimismWithdrawal,
} from "@/utils/guards";
import { isOptimism } from "@/utils/is-mainnet";
import { useOptimismForcedWithdrawalProgressRows } from "@/utils/progress-rows/forced-withdrawal";
import { useOptimismWithdrawalProgressRows } from "@/utils/progress-rows/withdrawal";

import { useDeployment } from "./use-deployment";
import { useFaultProofUpgradeTime } from "./use-fault-proof-upgrade-time";
import { useStatusCheck } from "./use-status-check";
import { useTransactions } from "./use-transactions";

export const useHasWithdrawalReadyToFinalize = () => {
  const deployment = useDeployment();
  const { transactions } = useTransactions();
  const withdrawalProgressRows = useOptimismWithdrawalProgressRows();
  const forcedWithdrawalProgressRows =
    useOptimismForcedWithdrawalProgressRows();
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

  return !!transactions.find((x) => {
    if (isOptimismWithdrawal(x)) {
      const rows = withdrawalProgressRows(x, deployment);
      return !!rows[rows.length - 1].buttonComponent;
    }
    if (isOptimismForcedWithdrawal(x)) {
      const rows = forcedWithdrawalProgressRows(x, deployment);
      return !!rows.find((x) => x.buttonComponent);
    }
    return false;
  });
};
