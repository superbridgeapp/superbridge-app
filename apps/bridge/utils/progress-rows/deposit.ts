import { useTranslation } from "react-i18next";

import { DeploymentDto } from "@/codegen/model";
import { useTxMultichainToken } from "@/hooks/activity/use-tx-token";
import { useChain } from "@/hooks/use-chain";
import { Transaction } from "@/types/transaction";

import { isOptimismDeposit } from "../guards";
import { ActivityStep, buildWaitStep } from "./common";

export const useOptimismDepositProgressRows = (
  tx: Transaction | null,
  deployment: DeploymentDto | null
): ActivityStep[] | null => {
  const { t } = useTranslation();
  const l1 = useChain(deployment?.l1ChainId);
  const l2 = useChain(deployment?.l2ChainId);
  const token = useTxMultichainToken(tx);

  if (!tx || !isOptimismDeposit(tx) || !deployment || !l1 || !l2) {
    return null;
  }

  return [
    {
      label: t("confirmationModal.startBridgeOn", {
        from: l1.name,
      }),
      chain: l1,
      hash: tx.deposit.timestamp ? tx.deposit.transactionHash : undefined,
      pendingHash: tx.deposit.timestamp
        ? undefined
        : tx.deposit.transactionHash,
      button: undefined,
      token,
    },
    buildWaitStep(
      tx.deposit.timestamp,
      tx.relay?.timestamp,
      deployment.depositDuration
    ),
    {
      label: t("confirmationModal.getOn", {
        to: l2.name,
      }),
      hash: tx.relay?.transactionHash,
      chain: l2,
      button: undefined,
      pendingHash: undefined,
      token,
    },
  ];
};
