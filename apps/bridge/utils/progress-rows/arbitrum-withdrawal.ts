import { useTranslation } from "react-i18next";

import { DeploymentDto } from "@/codegen/model";
import { usePeriodText } from "@/hooks/use-period-text";
import { usePendingTransactions } from "@/state/pending-txs";
import { Transaction } from "@/types/transaction";

import { isArbitrumWithdrawal } from "../guards";
import {
  ActivityStep,
  ButtonComponent,
  TransactionStep,
  isButtonEnabled,
} from "./common";

export const useArbitrumWithdrawalProgressRows = (
  w: Transaction | null,
  deployment: DeploymentDto | null
): ActivityStep[] | null => {
  const { t } = useTranslation();
  const pendingFinalises = usePendingTransactions.usePendingFinalises();
  const transformPeriodText = usePeriodText();

  if (!w || !isArbitrumWithdrawal(w) || !deployment) {
    return null;
  }

  const pendingFinalise = pendingFinalises[w?.id ?? ""];

  const withdraw: TransactionStep = {
    label: t("buttons.bridge"),
    hash: w.withdrawal.timestamp ? w.withdrawal.transactionHash : undefined,
    pendingHash: w.withdrawal.timestamp
      ? undefined
      : w.withdrawal.transactionHash,
    chain: deployment.l1,
    button: undefined,
    fee: undefined,
  };

  const finalise: TransactionStep = {
    label: t("buttons.finalize"),
    pendingHash: pendingFinalise,
    hash: w.finalise?.transactionHash,
    chain: deployment.l1,
    button: {
      type: ButtonComponent.Finalise,
      enabled: isButtonEnabled(w.withdrawal.timestamp, w.duration),
    },
    fee: undefined,
  };

  return [
    withdraw,
    w.withdrawal.timestamp
      ? {
          duration: w.duration,
          startedAt: w.withdrawal.timestamp,
        }
      : {
          duration: w.duration,
        },
    finalise,
  ];
};
