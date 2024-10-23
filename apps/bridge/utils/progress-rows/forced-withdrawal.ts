import { DeploymentDto } from "@/codegen/model";
import { Transaction } from "@/types/transaction";

import { isOptimismForcedWithdrawal } from "../guards";
import { ActivityStep } from "./common";
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
      fw && isOptimismForcedWithdrawal(fw) ? (fw.withdrawal ?? null) : null,
      deployment
    ) || [];

  if (!fw || !deployment || !isOptimismForcedWithdrawal(fw)) {
    return null;
  }

  return [
    depositRows[0],
    depositRows[1],
    {
      ...withdrawalRows[0],
      label: "Withdrawal initated",
      gasLimit: undefined,
    },
    ...withdrawalRows.slice(1),
  ];
};
