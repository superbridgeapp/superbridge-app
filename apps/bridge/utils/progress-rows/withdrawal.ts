import { useTranslation } from "react-i18next";

import { DeploymentDto } from "@/codegen/model";
import { usePeriodText } from "@/hooks/use-period-text";
import { usePendingTransactions } from "@/state/pending-txs";
import { Transaction } from "@/types/transaction";

import { isOptimismWithdrawal } from "../guards";
import {
  ActivityStep,
  ButtonComponent,
  TransactionStep,
  isButtonEnabled,
} from "./common";

export const useOptimismWithdrawalProgressRows = (
  w: Transaction | null,
  deployment: DeploymentDto | null
): ActivityStep[] | null => {
  const pendingFinalises = usePendingTransactions.usePendingFinalises();
  const pendingProves = usePendingTransactions.usePendingProves();
  const transformPeriodText = usePeriodText();
  const { t } = useTranslation();

  if (!w || !isOptimismWithdrawal(w) || !deployment) {
    return null;
  }

  const pendingProve = pendingProves[w?.id ?? ""];
  const pendingFinalise = pendingFinalises[w?.id ?? ""];

  const withdraw: TransactionStep = {
    label: t("buttons.bridge"),
    hash: w.withdrawal.timestamp ? w.withdrawal.transactionHash : undefined,
    pendingHash: w.withdrawal.timestamp
      ? undefined
      : w.withdrawal.transactionHash,
    chain: deployment.l2,
    button: undefined,
    fee: undefined,
  };

  const prove: TransactionStep = {
    label: t("buttons.prove"),
    pendingHash: pendingProve,
    hash: w.prove?.transactionHash,
    chain: deployment.l1,
    button: {
      type: ButtonComponent.Prove,
      enabled: isButtonEnabled(w.withdrawal.timestamp, w.proveDuration),
    },
    fee: undefined,
  };

  console.log(prove, w.withdrawal.timestamp, w.proveDuration);

  const finalise: TransactionStep = {
    label: t("buttons.finalize"),
    pendingHash: pendingFinalise,
    hash: w.finalise?.transactionHash,
    chain: deployment.l1,
    button: {
      type: ButtonComponent.Finalise,
      enabled: isButtonEnabled(w.prove?.timestamp, w.finalizeDuration),
    },
    fee: undefined,
  };

  return [
    withdraw,
    w.withdrawal.timestamp
      ? {
          startedAt: w.withdrawal.timestamp,
          duration: w.proveDuration,
        }
      : {
          duration: w.proveDuration,
        },
    prove,
    w.prove?.timestamp
      ? {
          startedAt: w.prove.timestamp,
          duration: w.finalizeDuration,
        }
      : {
          duration: w.finalizeDuration,
        },
    finalise,
  ];
};
