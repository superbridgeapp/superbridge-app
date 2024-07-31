import { useTranslation } from "react-i18next";

import { DeploymentDto } from "@/codegen/model";
import { FINALIZE_GAS, PROVE_GAS } from "@/constants/gas-limits";
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
  const { t } = useTranslation();

  if (!w || !isOptimismWithdrawal(w) || !deployment) {
    return null;
  }

  const pendingProve = pendingProves[w?.id ?? ""];
  const pendingFinalise = pendingFinalises[w?.id ?? ""];

  const withdraw: TransactionStep = {
    label: "Initiate bridge",
    hash: w.withdrawal.timestamp ? w.withdrawal.transactionHash : undefined,
    pendingHash: w.withdrawal.timestamp
      ? undefined
      : w.withdrawal.transactionHash,
    chain: deployment.l2,
    button: undefined,
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
    gasLimit: w.prove ? undefined : PROVE_GAS,
  };

  const finalise: TransactionStep = {
    label: t("buttons.finalize"),
    pendingHash: pendingFinalise,
    hash: w.finalise?.transactionHash,
    chain: deployment.l1,
    button: {
      type: ButtonComponent.Finalise,
      enabled: isButtonEnabled(w.prove?.timestamp, w.finalizeDuration),
    },
    gasLimit: w.finalise ? undefined : FINALIZE_GAS,
  };

  return [
    withdraw,
    w.withdrawal.timestamp
      ? {
          startedAt: w.withdrawal.timestamp,
          duration: deployment.proveDuration!,
        }
      : {
          duration: deployment.proveDuration!,
        },
    prove,
    w.prove?.timestamp
      ? {
          startedAt: w.prove.timestamp,
          duration: deployment.finalizeDuration,
        }
      : {
          duration: deployment.finalizeDuration,
        },
    finalise,
  ];
};
