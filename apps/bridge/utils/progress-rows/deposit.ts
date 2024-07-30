import { useTranslation } from "react-i18next";
import { P, match } from "ts-pattern";

import { DeploymentDto, TransactionStatus } from "@/codegen/model";
import { getDepositTime } from "@/hooks/use-finalization-period";
import { usePeriodText } from "@/hooks/use-period-text";
import { Transaction } from "@/types/transaction";

import { isOptimismDeposit } from "../guards";
import { transactionLink } from "../transaction-link";
import { ActivityStep, ProgressRowStatus } from "./common";
import { getRemainingTimePeriod } from "./get-remaining-period";

export const useOptimismDepositProgressRows = (
  tx: Transaction | null,
  deployment: DeploymentDto | null
): ActivityStep[] | null => {
  const { t } = useTranslation();
  const transformPeriodText = usePeriodText();

  if (!tx || !isOptimismDeposit(tx) || !deployment) {
    return null;
  }

  const depositTime = getDepositTime(deployment);
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
          label: t("activity.bridged"),
          status: ProgressRowStatus.Done,
          link: transactionLink(d.deposit.transactionHash, deployment.l1),
        },
        {
          finishedAt: tx.deposit.timestamp + tx.duration,
        },
        {
          label: t("activity.received"),
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
