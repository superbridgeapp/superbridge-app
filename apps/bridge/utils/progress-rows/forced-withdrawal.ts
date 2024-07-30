import { DeploymentDto } from "@/codegen/model";
import { Transaction } from "@/types/transaction";

import { isOptimismForcedWithdrawal } from "../guards";
import { ActivityStep, ProgressRowStatus } from "./common";
import { useOptimismDepositProgressRows } from "./deposit";
import { useOptimismWithdrawalProgressRows } from "./withdrawal";

export const useOptimismForcedWithdrawalProgressRows = (
  fw: Transaction | null,
  deployment: DeploymentDto | null
): ActivityStep[] | null => {
  let depositRows =
    useOptimismDepositProgressRows(
      fw && isOptimismForcedWithdrawal(fw) ? fw.deposit : null,
      deployment
    ) || [];
  let withdrawalRows =
    useOptimismWithdrawalProgressRows(
      fw && isOptimismForcedWithdrawal(fw) ? fw.withdrawal ?? null : null,
      deployment
    ) || [];

  if (!fw || !deployment || !isOptimismForcedWithdrawal(fw)) {
    return null;
  }

  if (depositRows[0].status === ProgressRowStatus.InProgress) {
    depositRows[0].label = "Withdrawing on L1";
  } else {
    depositRows[0].label = "Withdrawn on L1";
  }

  // duplicated "Waiting for L2" and "Withdrawn" items here
  // need to figure out which to remove
  if (depositRows[1].status === ProgressRowStatus.Done) {
    depositRows = depositRows.slice(0, 1);
    withdrawalRows[0].label = "Withdrawn on L2";
  } else {
    withdrawalRows = withdrawalRows.slice(1);
  }

  return [...depositRows, ...withdrawalRows];
};
