import { useTranslation } from "react-i18next";

import { DeploymentDto } from "@/codegen/model";
import { useTxAmount } from "@/hooks/activity/use-tx-amount";
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
  const inputAmount = useTxAmount(tx, token?.[l1?.id ?? 0]);
  const outputAmount = useTxAmount(tx, token?.[l2?.id ?? 0]);

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
      amount: inputAmount,
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
      amount: outputAmount,
    },
  ];
};
