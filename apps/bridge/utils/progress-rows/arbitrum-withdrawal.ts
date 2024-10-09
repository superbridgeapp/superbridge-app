import { useTranslation } from "react-i18next";

import { DeploymentDto } from "@/codegen/model";
import { ArbitrumMessageStatus } from "@/constants/arbitrum-message-status";
import { useTxAmount } from "@/hooks/activity/use-tx-amount";
import { useTxMultichainToken } from "@/hooks/activity/use-tx-token";
import { useChain } from "@/hooks/use-chain";
import { usePendingTransactions } from "@/state/pending-txs";
import { Transaction } from "@/types/transaction";

import { isArbitrumWithdrawal } from "../guards";
import {
  ActivityStep,
  ButtonComponent,
  TransactionStep,
  buildWaitStep,
} from "./common";

export const useArbitrumWithdrawalProgressRows = (
  w: Transaction | null,
  deployment: DeploymentDto | null
): ActivityStep[] | null => {
  const { t } = useTranslation();
  const pendingFinalises = usePendingTransactions.usePendingFinalises();
  const l1 = useChain(deployment?.l1ChainId);
  const l2 = useChain(deployment?.l2ChainId);
  const token = useTxMultichainToken(w);
  const inputAmount = useTxAmount(w, token?.[l2?.id ?? 0]);
  const outputAmount = useTxAmount(w, token?.[l1?.id ?? 0]);

  if (!w || !isArbitrumWithdrawal(w) || !deployment || !l1 || !l2) {
    return null;
  }

  const pendingFinalise = pendingFinalises[w?.id ?? ""];

  const withdraw: TransactionStep = {
    label: t("confirmationModal.startBridgeOn", {
      from: l2.name,
    }),
    hash: w.withdrawal.timestamp ? w.withdrawal.transactionHash : undefined,
    pendingHash: w.withdrawal.timestamp
      ? undefined
      : w.withdrawal.transactionHash,
    chain: l2,
    button: undefined,
    token,
    amount: inputAmount,
  };

  const readyToFinalize = w.status === ArbitrumMessageStatus.CONFIRMED;

  const finalise: TransactionStep = {
    label: t("confirmationModal.getAmountOn", {
      to: l1.name,
      formatted: outputAmount?.text,
    }),
    pendingHash: pendingFinalise,
    hash: w.finalise?.transactionHash,
    chain: l1,
    button: {
      type: ButtonComponent.Finalise,
      enabled: readyToFinalize,
    },
    token,
    amount: outputAmount,
  };

  return [
    withdraw,
    buildWaitStep(
      w.withdrawal.timestamp,
      w.finalise?.timestamp,
      deployment.finalizeDuration,
      readyToFinalize
    ),
    finalise,
  ];
};
