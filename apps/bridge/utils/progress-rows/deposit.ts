import { useTranslation } from "react-i18next";
import { P, match } from "ts-pattern";

import { PortalDepositDto, TransactionStatus } from "@/codegen/model";
import { getDepositTime } from "@/hooks/use-finalization-period";
import { usePeriodText } from "@/hooks/use-period-text";
import { useDeployments } from "@/hooks/use-deployments";

import { transactionLink } from "../transaction-link";
import { ExpandedItem, ProgressRowStatus } from "./common";
import { getRemainingTimePeriod } from "./get-remaining-period";

export const useOptimismDepositProgressRows = () => {
  const { t } = useTranslation();
  const transformPeriodText = usePeriodText();
  const { deployments } = useDeployments();

  return (
    tx: Pick<PortalDepositDto, "deposit" | "relay" | "deploymentId">
  ): ExpandedItem[] => {
    const deployment =
      deployments.find((x) => tx.deploymentId === x.id) ?? null;
    if (!deployment) {
      return [];
    }

    const depositTime = getDepositTime(
      deployments.find((x) => tx.deploymentId === x.id) ?? null
    );
    const l2ConfirmationText = (() => {
      if (!tx.deposit.blockNumber) {
        return transformPeriodText("transferTime", {}, depositTime);
      }

      if (tx.relay) {
        return "";
      }

      const remainingTimePeriod = getRemainingTimePeriod(
        tx.deposit.timestamp,
        depositTime
      );
      if (!remainingTimePeriod) return "";
      return transformPeriodText("activity.remaining", {}, remainingTimePeriod);
    })();

    return match(tx)
      .with(
        {
          deposit: P.not(undefined),
          relay: P.not(undefined),
        },
        (d) => [
          {
            label: t("activity.deposited"),
            status: ProgressRowStatus.Done,
            link: transactionLink(d.deposit.transactionHash, deployment.l1),
          },
          {
            label: t("activity.l2Confirmation"),
            status:
              d.relay.status === TransactionStatus.confirmed
                ? ProgressRowStatus.Done
                : ProgressRowStatus.Reverted,
            link: transactionLink(d.relay.transactionHash, deployment.l2),
          },
        ]
      )
      .with({ deposit: P.when(({ blockNumber }) => !blockNumber) }, (d) => [
        {
          label: t("activity.depositing"),
          status: ProgressRowStatus.InProgress,
          link: transactionLink(d.deposit.transactionHash, deployment.l1),
        },
        {
          label: t("activity.l2Confirmation"),
          status: ProgressRowStatus.NotDone,
          time: l2ConfirmationText,
        },
      ])
      .otherwise((d) => [
        {
          label: t("activity.deposited"),
          status: ProgressRowStatus.Done,
          link: transactionLink(d.deposit.transactionHash, deployment.l1),
        },
        {
          label: t("activity.waitingForL2"),
          status: ProgressRowStatus.InProgress,
          time: l2ConfirmationText,
        },
      ]);
  };
};
