import { useTranslation } from "react-i18next";
import { P, match } from "ts-pattern";

import { DeploymentDto } from "@/codegen/model";
import { getFinalizationPeriod } from "@/hooks/use-finalization-period";
import { usePeriodText } from "@/hooks/use-period-text";
import { usePendingTransactions } from "@/state/pending-txs";
import { Transaction } from "@/types/transaction";

import { isCctpBridge } from "../guards";
import { transactionLink } from "../transaction-link";
import { ActivityStep, ButtonComponent, ProgressRowStatus } from "./common";
import { getRemainingTimePeriod } from "./get-remaining-period";

export const useCctpProgressRows = (
  tx: Transaction | null,
  deployment: DeploymentDto | null
): ActivityStep[] | null => {
  const { t } = useTranslation();
  const pendingFinalises = usePendingTransactions.usePendingFinalises();
  const transformPeriodText = usePeriodText();

  if (!tx || !isCctpBridge(tx) || !deployment) {
    return null;
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
      // status: tx.bridge.blockNumber
      //   ? ProgressRowStatus.Done
      //   : ProgressRowStatus.InProgress,
      chain: tx.from,
      link: transactionLink(tx.bridge.transactionHash, tx.from),
    },
    match({ tx, pendingFinalise })
      .with(
        { tx: { bridge: P.when(({ blockNumber }) => !blockNumber) } },
        () => ({
          label: t("activity.l2Confirmation"),
          status: ProgressRowStatus.NotDone,
          text: l2ConfirmationText,
          chain: tx.to,
        })
      )
      .with({ tx: { relay: P.when((relay) => !!relay?.blockNumber) } }, () => ({
        label: t("activity.minted"),
        status: ProgressRowStatus.Done,
        link: transactionLink(tx.relay!.transactionHash, tx.to),
        chain: tx.to,
      }))
      .with({ pendingFinalise: P.not(undefined) }, () => ({
        label: t("activity.minting"),
        status: ProgressRowStatus.InProgress,
        chain: tx.to,
      }))

      .otherwise(({ tx }) => {
        const mins = bridgeTime?.value ?? 20;
        if (tx.bridge.timestamp < Date.now() - mins * 60 * 1000) {
          return {
            label: t("activity.readyToMint"),
            status: ProgressRowStatus.InProgress,
            buttonComponent: ButtonComponent.Mint,
            chain: tx.to,
          };
        }
        return {
          label: t("activity.waitingForAttestation"),
          status: ProgressRowStatus.InProgress,
          time: l2ConfirmationText,
          chain: tx.to,
        };
      }),
  ];
};
