import { useTranslation } from "react-i18next";

import { DeploymentDto } from "@/codegen/model";
import { useTxToken } from "@/hooks/activity/use-tx-token";
import { useChain } from "@/hooks/use-chain";
import { Transaction } from "@/types/transaction";

import { isOptimismDeposit } from "../guards";
import { ActivityStep, buildWaitStep } from "./common";

export const useOptimismDepositProgressRows = (
  tx: Transaction | null,
  deployment: DeploymentDto | null
): ActivityStep[] | null => {
  const { t } = useTranslation();
  const token = useTxToken(tx);
  const l1 = useChain(deployment?.l1ChainId);
  const l2 = useChain(deployment?.l2ChainId);

  if (!tx || !isOptimismDeposit(tx) || !deployment || !l1 || !l2) {
    return null;
  }

  return [
    {
      label: "Initiate bridge",
      chain: l1,
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
      chain: l2,
      button: undefined,
      pendingHash: undefined,
    },
  ];
};
