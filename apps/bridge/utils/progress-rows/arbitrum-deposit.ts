import { useTranslation } from "react-i18next";

import { DeploymentDto } from "@/codegen/model";
import { useTxAmount } from "@/hooks/activity/use-tx-amount";
import { useTxMultichainToken } from "@/hooks/activity/use-tx-token";
import { useChain } from "@/hooks/use-chain";
import { usePendingTransactions } from "@/state/pending-txs";
import { Transaction } from "@/types/transaction";

import { isArbitrumDeposit } from "../guards";
import { ActivityStep, ButtonComponent, buildWaitStep } from "./common";

export const useArbitrumDepositProgressRows = (
  tx: Transaction | null,
  deployment: DeploymentDto | null
): ActivityStep[] | null => {
  const { t } = useTranslation();
  const l1 = useChain(deployment?.l1ChainId);
  const l2 = useChain(deployment?.l2ChainId);
  const pendingFinalises = usePendingTransactions.usePendingFinalises();
  const token = useTxMultichainToken(tx);
  const inputAmount = useTxAmount(tx, token?.[l1?.id ?? 0]);
  const outputAmount = useTxAmount(tx, token?.[l2?.id ?? 0]);

  if (!tx || !isArbitrumDeposit(tx) || !deployment || !l1 || !l2) {
    return null;
  }

  const receiveLabel = t("confirmationModal.getAmountOn", {
    to: l2.name,
    formatted: outputAmount?.text,
  });

  const receive = tx.relay
    ? {
        label: receiveLabel,
        button: undefined,
        chain: l2,
        hash: tx.relay.transactionHash,
        pendingHash: undefined,
        token,
        amount: outputAmount,
      }
    : tx.deposit.timestamp && tx.deposit.timestamp < Date.now() - 1000 * 60 * 60
      ? {
          label: receiveLabel,
          button: {
            type: ButtonComponent.Redeem,
            enabled: true,
          },
          chain: l2,
          hash: undefined,
          pendingHash: pendingFinalises[tx.id],
          token,
          amount: outputAmount,
        }
      : {
          label: receiveLabel,
          button: undefined,
          chain: l2,
          hash: undefined,
          pendingHash: undefined,
          token,
          amount: outputAmount,
        };

  return [
    {
      label: t("confirmationModal.startBridgeOn", {
        from: l1.name,
      }),
      hash: tx.deposit.timestamp ? tx.deposit.transactionHash : undefined,
      pendingHash: tx.deposit.timestamp
        ? undefined
        : tx.deposit.transactionHash,
      button: undefined,
      chain: l1,
      token,
      amount: inputAmount,
    },
    buildWaitStep(
      tx.deposit.timestamp,
      tx.relay?.timestamp,
      deployment.depositDuration
    ),
    receive,
  ];
};
