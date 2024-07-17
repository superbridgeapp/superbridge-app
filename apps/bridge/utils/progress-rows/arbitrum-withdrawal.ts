import { useTranslation } from "react-i18next";
import { P, match } from "ts-pattern";

import { ArbitrumWithdrawalDto, DeploymentDto } from "@/codegen/model";
import { ArbitrumMessageStatus } from "@/constants/arbitrum-message-status";
import { getFinalizationPeriod } from "@/hooks/use-finalization-period";
import { usePeriodText } from "@/hooks/use-period-text";
import { usePendingTransactions } from "@/state/pending-txs";

import { transactionLink } from "../transaction-link";
import { ButtonComponent, ExpandedItem, ProgressRowStatus } from "./common";
import {
  getRemainingTimeMs,
  getRemainingTimePeriod,
} from "./get-remaining-period";

export const useArbitrumWithdrawalProgressRows = () => {
  const { t } = useTranslation();
  const pendingFinalises = usePendingTransactions.usePendingFinalises();
  const transformPeriodText = usePeriodText();

  return (
    w: ArbitrumWithdrawalDto | undefined,
    deployment: DeploymentDto | null
  ): ExpandedItem[] => {
    if (!deployment) {
      return [];
    }

    const pendingFinalise = pendingFinalises[w?.id ?? ""];
    const finalizationPeriod = getFinalizationPeriod(deployment, false);

    const finalise = match({ ...w, pendingFinalise })
      // Special case for saved client side transactions
      .with(
        {
          status: ArbitrumMessageStatus.CONFIRMED,
          pendingFinalise: P.not(undefined),
        },
        (w) => ({
          label: t("activity.finalizing"),
          status: ProgressRowStatus.InProgress,
          buttonComponent: undefined,
          link: transactionLink(pendingFinalise!, deployment.l1),
        })
      )
      .with({ status: ArbitrumMessageStatus.CONFIRMED }, () => ({
        label: t("activity.readyToFinalize"),
        status: ProgressRowStatus.InProgress,
        buttonComponent: ButtonComponent.Finalise,
        link: undefined,
      }))
      .with({ status: ArbitrumMessageStatus.EXECUTED }, (w) => ({
        label: t("activity.finalized"),
        status: ProgressRowStatus.Done,
        buttonComponent: undefined,
        link: transactionLink(w.finalise!.transactionHash, deployment.l1),
      }))
      .otherwise(() => ({
        label: t("activity.finalized"),
        status: ProgressRowStatus.NotDone,
        buttonComponent: undefined,
        link: undefined,
      }));

    const challengePeriodText = (() => {
      if (
        w?.status === ArbitrumMessageStatus.EXECUTED ||
        getRemainingTimeMs(
          w?.withdrawal.timestamp || Date.now(),
          finalizationPeriod
        ) < 0
      ) {
        return "";
      }

      if (
        !w?.withdrawal ||
        !w?.status ||
        w.status === ArbitrumMessageStatus.UNCONFIRMED
      ) {
        return transformPeriodText("transferTime", {}, finalizationPeriod);
      }

      const remainingTimePeriod = getRemainingTimePeriod(
        w.withdrawal.timestamp || Date.now(),
        finalizationPeriod
      );
      if (!remainingTimePeriod) return "";
      return transformPeriodText("activity.remaining", {}, remainingTimePeriod);
    })();

    return [
      {
        label: t("activity.withdrawn"),
        status: ProgressRowStatus.Done,
        link: w
          ? transactionLink(w.withdrawal.transactionHash, deployment.l2)
          : undefined,
      },
      {
        label: !w
          ? t("activity.challengePeriod")
          : w.status === ArbitrumMessageStatus.UNCONFIRMED
          ? `${t("activity.challengePeriod")}…`
          : t("activity.challengePeriod"),
        status: !w
          ? ProgressRowStatus.NotDone
          : w.status === ArbitrumMessageStatus.UNCONFIRMED
          ? ProgressRowStatus.InProgress
          : w.status === ArbitrumMessageStatus.CONFIRMED
          ? ProgressRowStatus.Done
          : ProgressRowStatus.Done,
        time: challengePeriodText,
      },
      finalise,
    ];
  };
};
