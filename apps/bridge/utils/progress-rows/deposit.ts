import { useTranslation } from "react-i18next";

import { DeploymentDto } from "@/codegen/model";
import { usePeriodText } from "@/hooks/use-period-text";
import { Transaction } from "@/types/transaction";

import { isOptimismDeposit } from "../guards";
import { ActivityStep } from "./common";

export const useOptimismDepositProgressRows = (
  tx: Transaction | null,
  deployment: DeploymentDto | null
): ActivityStep[] | null => {
  const { t } = useTranslation();
  const transformPeriodText = usePeriodText();

  if (!tx || !isOptimismDeposit(tx) || !deployment) {
    return null;
  }

  return [
    {
      label: "Bridge",
      chain: deployment.l1,
      fee: undefined,
      hash: tx.deposit.timestamp ? tx.deposit.transactionHash : undefined,
      pendingHash: tx.deposit.timestamp
        ? undefined
        : tx.deposit.transactionHash,
      button: undefined,
    },
    {
      startedAt: tx.deposit.timestamp,
      duration: tx.duration,
    },
    {
      label: t("activity.received"),
      hash: tx.relay?.transactionHash,
      chain: deployment.l2,
      button: undefined,
      fee: undefined,
      pendingHash: undefined,
    },
  ];
};
