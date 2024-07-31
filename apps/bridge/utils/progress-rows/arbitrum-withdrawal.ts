import { useTranslation } from "react-i18next";

import { DeploymentDto } from "@/codegen/model";
import { FINALIZE_GAS } from "@/constants/gas-limits";
import { usePendingTransactions } from "@/state/pending-txs";
import { Transaction } from "@/types/transaction";

import { isArbitrumWithdrawal } from "../guards";
import {
  ActivityStep,
  ButtonComponent,
  TransactionStep,
  buildWaitStep,
  isButtonEnabled,
} from "./common";

export const useArbitrumWithdrawalProgressRows = (
  w: Transaction | null,
  deployment: DeploymentDto | null
): ActivityStep[] | null => {
  const { t } = useTranslation();
  const pendingFinalises = usePendingTransactions.usePendingFinalises();

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
  };

  const finalise: TransactionStep = {
    label: t("buttons.finalize"),
    pendingHash: pendingFinalise,
    hash: w.finalise?.transactionHash,
    chain: deployment.l1,
    button: {
      type: ButtonComponent.Finalise,
      enabled: isButtonEnabled(
        w.withdrawal.timestamp,
        deployment.finalizeDuration
      ),
    },
    gasLimit: w.finalise ? undefined : FINALIZE_GAS,
  };

  return [
    withdraw,
    buildWaitStep(
      w.withdrawal.timestamp,
      w.finalise?.timestamp,
      deployment.finalizeDuration
    ),
    finalise,
  ];
};
