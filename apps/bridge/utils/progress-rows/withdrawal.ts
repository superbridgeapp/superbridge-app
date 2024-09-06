import { useTranslation } from "react-i18next";

import {
  BridgeWithdrawalDto,
  ConfirmationDto,
  DeploymentDto,
} from "@/codegen/model";
import { FINALIZE_GAS, PROVE_GAS } from "@/constants/gas-limits";
import { MessageStatus } from "@/constants/optimism-message-status";
import { useChain } from "@/hooks/use-chain";
import { usePendingTransactions } from "@/state/pending-txs";

import {
  ActivityStep,
  ButtonComponent,
  TransactionStep,
  buildWaitStep,
} from "./common";

export const useOptimismWithdrawalProgressRows = (
  id: string | null,
  status: BridgeWithdrawalDto["status"] | null,
  withdrawal: ConfirmationDto | null,
  prove: ConfirmationDto | null,
  finalise: ConfirmationDto | null,
  deployment: DeploymentDto | null
): ActivityStep[] | null => {
  const pendingFinalises = usePendingTransactions.usePendingFinalises();
  const pendingProves = usePendingTransactions.usePendingProves();
  const { t } = useTranslation();
  const l1 = useChain(deployment?.l1ChainId);
  const l2 = useChain(deployment?.l2ChainId);

  if (!deployment || !l1 || !l2) {
    return null;
  }

  const pendingProve = pendingProves[id ?? ""];
  const pendingFinalise = pendingFinalises[id ?? ""];

  const withdrawStep: TransactionStep = {
    label: "Start bridge",
    hash: withdrawal?.timestamp ? withdrawal?.transactionHash : undefined,
    pendingHash: withdrawal?.timestamp
      ? undefined
      : withdrawal?.transactionHash,
    chain: l2,
    button: undefined,
  };

  const readyToProve = status === MessageStatus.READY_TO_PROVE;
  const readyToFinalize = status === MessageStatus.READY_FOR_RELAY;

  const proveStep: TransactionStep = {
    label: t("buttons.prove"),
    pendingHash: pendingProve,
    hash: prove?.transactionHash,
    chain: l1,
    button: {
      type: ButtonComponent.Prove,
      enabled: readyToProve,
    },
    gasLimit: prove ? undefined : PROVE_GAS,
  };

  const finaliseStep: TransactionStep = {
    label: t("buttons.finalize"),
    pendingHash: pendingFinalise,
    hash: finalise?.transactionHash,
    chain: l1,
    button: {
      type: ButtonComponent.Finalise,
      enabled: readyToFinalize,
    },
    gasLimit: finalise ? undefined : FINALIZE_GAS,
  };

  return [
    withdrawStep,
    buildWaitStep(
      withdrawal?.timestamp,
      prove?.timestamp,
      deployment.proveDuration!,
      readyToProve
    ),
    proveStep,
    buildWaitStep(
      prove?.timestamp,
      finalise?.timestamp,
      deployment.finalizeDuration,
      readyToFinalize
    ),
    finaliseStep,
  ];
};
