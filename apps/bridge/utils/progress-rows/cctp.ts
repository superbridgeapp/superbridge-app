import { useTranslation } from "react-i18next";
import { P, match } from "ts-pattern";

import { CctpBridgeDto } from "@/codegen/model";
import { useDeployments } from "@/hooks/use-deployments";
import { getFinalizationPeriod } from "@/hooks/use-finalization-period";
import { usePeriodText } from "@/hooks/use-period-text";
import { usePendingTransactions } from "@/state/pending-txs";

import { transactionLink } from "../transaction-link";
import { ButtonComponent, ExpandedItem, ProgressRowStatus } from "./common";
import { getRemainingTimePeriod } from "./get-remaining-period";

export const useCctpProgressRows = () => {
  const { t } = useTranslation();
  const pendingFinalises = usePendingTransactions.usePendingFinalises();
  const transformPeriodText = usePeriodText();
  const { deployments } = useDeployments();

  return (tx: CctpBridgeDto): ExpandedItem[] => {
    const deployment =
      deployments.find((x) => tx.deploymentId === x.id) ?? null;
    if (!deployment) {
      return [];
    }

    const pendingFinalise = pendingFinalises[tx?.id ?? ""];
    const bridgeTime = getFinalizationPeriod(deployment, true);

    const l2ConfirmationText = (() => {
      if (!bridgeTime || tx.relay) return "";
      if (!tx.bridge.blockNumber) {
        return transformPeriodText("transferTime", {}, bridgeTime);
      }

      const remainingTimePeriod = getRemainingTimePeriod(
        tx.bridge.timestamp,
        bridgeTime
      );
      if (!remainingTimePeriod) return "";
      return transformPeriodText("activity.remaining", {}, remainingTimePeriod);
    })();
    return [
      {
        label: tx.bridge.blockNumber
          ? t("activity.bridged")
          : t("activity.bridging"),
        status: tx.bridge.blockNumber
          ? ProgressRowStatus.Done
          : ProgressRowStatus.InProgress,
        link: transactionLink(tx.bridge.transactionHash, tx.from),
      },
      match({ tx, pendingFinalise })
        .with(
          { tx: { bridge: P.when(({ blockNumber }) => !blockNumber) } },
          () => ({
            label: t("activity.l2Confirmation"),
            status: ProgressRowStatus.NotDone,
            text: l2ConfirmationText,
          })
        )
        .with(
          { tx: { relay: P.when((relay) => !!relay?.blockNumber) } },
          () => ({
            label: t("activity.minted"),
            status: ProgressRowStatus.Done,
            link: transactionLink(tx.relay!.transactionHash, tx.to),
          })
        )
        .with({ pendingFinalise: P.not(undefined) }, () => ({
          label: t("activity.minting"),
          status: ProgressRowStatus.InProgress,
        }))

        .otherwise(({ tx }) => {
          const mins = bridgeTime?.value ?? 20;
          if (tx.bridge.timestamp < Date.now() - mins * 1000) {
            return {
              label: t("activity.readyToMint"),
              status: ProgressRowStatus.InProgress,
              buttonComponent: ButtonComponent.Mint,
            };
          }
          return {
            label: t("activity.waitingForAttestation"),
            status: ProgressRowStatus.InProgress,
            time: l2ConfirmationText,
          };
        }),
    ];
  };
};
