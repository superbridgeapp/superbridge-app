import { useTranslation } from "react-i18next";
import { P, match } from "ts-pattern";

import { BridgeWithdrawalDto } from "@/codegen/model";
import { MessageStatus } from "@/constants/optimism-message-status";
import {
  getFinalizationPeriod,
  getProvePeriod,
} from "@/hooks/use-finalization-period";
import { usePeriodText } from "@/hooks/use-period-text";
import { usePendingTransactions } from "@/state/pending-txs";

import { transactionLink } from "../transaction-link";
import { ButtonComponent, ExpandedItem, ProgressRowStatus } from "./common";
import { getRemainingTimePeriod } from "./get-remaining-period";

export const useOptimismWithdrawalProgressRows = () => {
  const pendingFinalises = usePendingTransactions.usePendingFinalises();
  const pendingProves = usePendingTransactions.usePendingProves();
  const transformPeriodText = usePeriodText();
  const { t } = useTranslation();

  return (w: BridgeWithdrawalDto | undefined): ExpandedItem[] => {
    const finalizationPeriod = getFinalizationPeriod(
      w?.deployment ?? null,
      false
    );
    const provePeriod = getProvePeriod(w?.deployment ?? null);
    const pendingProve = pendingProves[w?.id ?? ""];
    const pendingFinalise = pendingFinalises[w?.id ?? ""];
    const prove = match({ w, pendingProve })
      // Special case for saved client side transactions
      .with(
        {
          w: { status: MessageStatus.READY_TO_PROVE },
          pendingProve: P.not(undefined),
        },
        () => ({
          label: t("activity.proving"),
          status: ProgressRowStatus.InProgress,
          buttonComponent: undefined,
          link: transactionLink(pendingProve!, w!.deployment.l1),
        })
      )
      .with({ w: { status: MessageStatus.READY_TO_PROVE } }, () => ({
        label: t("activity.readyToProve"),
        status: ProgressRowStatus.InProgress,
        buttonComponent: ButtonComponent.Prove,
        link: undefined,
      }))
      .with(
        {
          w: {
            status: P.when((status) => status < MessageStatus.READY_TO_PROVE),
          },
        },
        () => ({
          label: t("activity.proved"),
          status: ProgressRowStatus.NotDone,
          buttonComponent: undefined,
          link: undefined,
        })
      )
      .with(
        {
          w: undefined,
        },
        () => ({
          label: t("activity.proved"),
          status: ProgressRowStatus.NotDone,
          buttonComponent: undefined,
          link: undefined,
        })
      )
      // status > MessageStatus.READY_TO_PROVE
      .otherwise(({ w }) => ({
        label: t("activity.proved"),
        status: ProgressRowStatus.Done,
        buttonComponent: undefined,
        link: transactionLink(w!.prove!.transactionHash, w!.deployment.l1),
      }));

    const finalise = match({ ...w, pendingFinalise })
      // Special case for saved client side transactions
      .with(
        {
          status: MessageStatus.READY_FOR_RELAY,
          pendingFinalise: P.not(undefined),
        },
        () => ({
          label: t("activity.finalizing"),
          status: ProgressRowStatus.InProgress,
          buttonComponent: undefined,
          link: transactionLink(pendingFinalise!, w!.deployment.l1),
        })
      )
      .with({ status: MessageStatus.READY_FOR_RELAY }, () => ({
        label: t("activity.readyToFinalize"),
        status: ProgressRowStatus.InProgress,
        buttonComponent: ButtonComponent.Finalise,
        link: undefined,
      }))
      .with({ status: MessageStatus.RELAYED }, (w) => ({
        label: t("activity.finalized"),
        status: ProgressRowStatus.Done,
        buttonComponent: undefined,
        link: transactionLink(w.finalise!.transactionHash, w.deployment?.l1),
      }))
      .otherwise(() => ({
        label: t("activity.finalized"),
        status: ProgressRowStatus.NotDone,
        buttonComponent: undefined,
        link: undefined,
      }));

    const waitingForStateRootText = (() => {
      if (!w?.status || w.status < MessageStatus.STATE_ROOT_NOT_PUBLISHED) {
        return transformPeriodText("transferTime", {}, finalizationPeriod);
      }

      if (w.status > MessageStatus.STATE_ROOT_NOT_PUBLISHED) {
        return "";
      }

      const remainingTimePeriod = getRemainingTimePeriod(
        w.withdrawal.timestamp,
        provePeriod
      );
      return transformPeriodText("activity.remaining", {}, remainingTimePeriod);
    })();

    const challengePeriodText = (() => {
      if (
        !w?.prove ||
        !w?.status ||
        w.status < MessageStatus.IN_CHALLENGE_PERIOD
      ) {
        return transformPeriodText("transferTime", {}, finalizationPeriod);
      }

      if (w.status > MessageStatus.IN_CHALLENGE_PERIOD) {
        return "";
      }

      const remainingTimePeriod = getRemainingTimePeriod(
        w.prove.timestamp,
        finalizationPeriod
      );
      return transformPeriodText("activity.remaining", {}, remainingTimePeriod);
    })();

    return [
      {
        label: t("activity.withdrawn"),
        status: w ? ProgressRowStatus.Done : ProgressRowStatus.NotDone,
        link: w
          ? transactionLink(w.withdrawal.transactionHash, w.deployment.l2)
          : undefined,
      },
      {
        label:
          w?.status === MessageStatus.STATE_ROOT_NOT_PUBLISHED
            ? t("activity.waitingForStateRoot")
            : t("activity.stateRootPublished"),
        status: w
          ? w?.status === MessageStatus.STATE_ROOT_NOT_PUBLISHED
            ? ProgressRowStatus.InProgress
            : ProgressRowStatus.Done
          : ProgressRowStatus.NotDone,
        time: waitingForStateRootText,
      },
      prove,
      {
        label:
          w?.status === MessageStatus.IN_CHALLENGE_PERIOD
            ? `${t("activity.challengePeriod")}…`
            : t("activity.challengePeriod"),
        status:
          !w?.status || w.status < MessageStatus.IN_CHALLENGE_PERIOD
            ? ProgressRowStatus.NotDone
            : w.status === MessageStatus.IN_CHALLENGE_PERIOD
            ? ProgressRowStatus.InProgress
            : ProgressRowStatus.Done,
        time: challengePeriodText,
      },
      finalise,
    ];
  };
};
