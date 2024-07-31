import { useTranslation } from "react-i18next";

import { DeploymentDto } from "@/codegen/model";
import { useTxToken } from "@/hooks/activity/use-tx-token";
import { Transaction } from "@/types/transaction";

import { isOptimismDeposit } from "../guards";
import { ActivityStep, buildWaitStep } from "./common";

export const useOptimismDepositProgressRows = (
  tx: Transaction | null,
  deployment: DeploymentDto | null
): ActivityStep[] | null => {
  const { t } = useTranslation();
  const token = useTxToken(tx);

  if (!tx || !isOptimismDeposit(tx) || !deployment) {
    return null;
  }

  return [
    {
      label: "Initiate bridge",
      chain: deployment.l1,
      fee: undefined,
      hash: tx.deposit.timestamp ? tx.deposit.transactionHash : undefined,
      pendingHash: tx.deposit.timestamp
        ? undefined
        : tx.deposit.transactionHash,
      button: undefined,
    },
    buildWaitStep(
      tx.deposit.timestamp,
      tx.relay?.timestamp,
      deployment.depositDuration
    ),
    {
      label: `Receive ${token?.symbol}`,
      hash: tx.relay?.transactionHash,
      chain: deployment.l2,
      button: undefined,
      fee: undefined,
      pendingHash: undefined,
    },
  ];
};
