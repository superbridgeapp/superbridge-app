import { useTranslation } from "react-i18next";

import { DeploymentDto } from "@/codegen/model";
import { FINALIZE_GAS, PROVE_GAS } from "@/constants/gas-limits";
import { MessageStatus } from "@/constants/optimism-message-status";
import { useChain } from "@/hooks/use-chain";
import { usePendingTransactions } from "@/state/pending-txs";
import { Transaction } from "@/types/transaction";

import { isOptimismWithdrawal } from "../guards";
import {
  ActivityStep,
  ButtonComponent,
  TransactionStep,
  buildWaitStep,
} from "./common";

export const useOptimismWithdrawalProgressRows = (
  w: Transaction | null,
  deployment: DeploymentDto | null
): ActivityStep[] | null => {
  const pendingFinalises = usePendingTransactions.usePendingFinalises();
  const pendingProves = usePendingTransactions.usePendingProves();
  const { t } = useTranslation();
  const l1 = useChain(deployment?.l1ChainId);
  const l2 = useChain(deployment?.l2ChainId);

  if (!w || !isOptimismWithdrawal(w) || !deployment || !l1 || !l2) {
    return null;
  }

  const pendingProve = pendingProves[w?.id ?? ""];
  const pendingFinalise = pendingFinalises[w?.id ?? ""];

  const withdraw: TransactionStep = {
    label: "Start bridge",
    hash: w.withdrawal.timestamp ? w.withdrawal.transactionHash : undefined,
    pendingHash: w.withdrawal.timestamp
      ? undefined
      : w.withdrawal.transactionHash,
    chain: l2,
    button: undefined,
  };

  const readyToProve = w.status === MessageStatus.READY_TO_PROVE;
  const readyToFinalize = w.status === MessageStatus.READY_FOR_RELAY;

  const prove: TransactionStep = {
    label: t("buttons.prove"),
    pendingHash: pendingProve,
    hash: w.prove?.transactionHash,
    chain: l1,
    button: {
      type: ButtonComponent.Prove,
      enabled: readyToProve,
    },
    gasLimit: w.prove ? undefined : PROVE_GAS,
  };

  const finalise: TransactionStep = {
    label: t("buttons.finalize"),
    pendingHash: pendingFinalise,
    hash: w.finalise?.transactionHash,
    chain: l1,
    button: {
      type: ButtonComponent.Finalise,
      enabled: readyToFinalize,
    },
    gasLimit: w.finalise ? undefined : FINALIZE_GAS,
  };

  return [
    withdraw,
    buildWaitStep(
      w.withdrawal.timestamp,
      w.prove?.timestamp,
      deployment.proveDuration!,
      readyToProve
    ),
    prove,
    buildWaitStep(
      w.prove?.timestamp,
      w.finalise?.timestamp,
      deployment.finalizeDuration,
      readyToFinalize
    ),
    finalise,
  ];
};
