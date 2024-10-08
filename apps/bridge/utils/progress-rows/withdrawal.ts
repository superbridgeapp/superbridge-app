import { useTranslation } from "react-i18next";

import { BridgeWithdrawalDto, DeploymentDto } from "@/codegen/model";
import { FINALIZE_GAS, PROVE_GAS } from "@/constants/gas-limits";
import { MessageStatus } from "@/constants/optimism-message-status";
import { useTxAmount } from "@/hooks/activity/use-tx-amount";
import { useTxMultichainToken } from "@/hooks/activity/use-tx-token";
import { useChain } from "@/hooks/use-chain";
import { usePendingTransactions } from "@/state/pending-txs";

import {
  ActivityStep,
  ButtonComponent,
  TransactionStep,
  buildWaitStep,
} from "./common";

export const useOptimismWithdrawalProgressRows = (
  withdrawal: BridgeWithdrawalDto | null,
  deployment: DeploymentDto | null
): ActivityStep[] | null => {
  const pendingFinalises = usePendingTransactions.usePendingFinalises();
  const pendingProves = usePendingTransactions.usePendingProves();
  const { t } = useTranslation();
  const l1 = useChain(deployment?.l1ChainId);
  const l2 = useChain(deployment?.l2ChainId);
  const token = useTxMultichainToken(withdrawal);
  const inputAmount = useTxAmount(withdrawal, token?.[l2?.id ?? 0]);
  const outputAmount = useTxAmount(withdrawal, token?.[l1?.id ?? 0]);

  if (!deployment || !l1 || !l2) {
    return null;
  }

  const pendingProve = pendingProves[withdrawal?.id ?? ""];
  const pendingFinalise = pendingFinalises[withdrawal?.id ?? ""];

  const withdrawStep: TransactionStep = {
    label: t("confirmationModal.startBridgeOn", {
      from: l2.name,
    }),
    hash: withdrawal?.withdrawal.timestamp
      ? withdrawal?.withdrawal.transactionHash
      : undefined,
    pendingHash: withdrawal?.withdrawal.timestamp
      ? undefined
      : withdrawal?.withdrawal.transactionHash,
    chain: l2,
    button: undefined,
    token,
    amount: inputAmount,
  };

  const readyToProve = withdrawal?.status === MessageStatus.READY_TO_PROVE;
  const readyToFinalize = withdrawal?.status === MessageStatus.READY_FOR_RELAY;

  const proveStep: TransactionStep = {
    label: t("confirmationModal.proveOn", {
      to: l1.name,
    }),
    pendingHash: pendingProve,
    hash: withdrawal?.prove?.transactionHash,
    chain: l1,
    button: {
      type: ButtonComponent.Prove,
      enabled: readyToProve,
    },
    gasLimit: withdrawal?.prove ? undefined : PROVE_GAS,
  };

  const finaliseStep: TransactionStep = {
    label: t("confirmationModal.getAmountOn", {
      to: l1.name,
      formatted: outputAmount?.formatted,
    }),
    pendingHash: pendingFinalise,
    hash: withdrawal?.finalise?.transactionHash,
    chain: l1,
    button: {
      type: ButtonComponent.Finalise,
      enabled: readyToFinalize,
    },
    gasLimit: withdrawal?.finalise ? undefined : FINALIZE_GAS,
    token,
    amount: outputAmount,
  };

  return [
    withdrawStep,
    buildWaitStep(
      withdrawal?.withdrawal?.timestamp,
      withdrawal?.prove?.timestamp,
      deployment.proveDuration!,
      readyToProve
    ),
    proveStep,
    buildWaitStep(
      withdrawal?.prove?.timestamp,
      withdrawal?.finalise?.timestamp,
      deployment.finalizeDuration,
      readyToFinalize
    ),
    finaliseStep,
  ];
};
