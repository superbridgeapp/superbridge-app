import { useTranslation } from "react-i18next";
import { P, match } from "ts-pattern";

import { DeploymentDto, TransactionStatus } from "@/codegen/model";
import { getDepositTime } from "@/hooks/use-finalization-period";
import { usePeriodText } from "@/hooks/use-period-text";
import { Transaction } from "@/types/transaction";

import { isArbitrumDeposit } from "../guards";
import { transactionLink } from "../transaction-link";
import { ActivityStep, ButtonComponent, ProgressRowStatus } from "./common";
import { getRemainingTimePeriod } from "./get-remaining-period";

export const useArbitrumDepositProgressRows = (
  tx: Transaction | null,
  deployment: DeploymentDto | null
): ActivityStep[] | null => {
  const { t } = useTranslation();
  const transformPeriodText = usePeriodText();

  if (!tx || !isArbitrumDeposit(tx) || !deployment) {
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

  return [
    {
      label: tx.deposit.blockNumber
        ? t("activity.deposited")
        : t("activity.depositing"),
      status: tx.deposit.blockNumber
        ? ProgressRowStatus.Done
        : ProgressRowStatus.InProgress,
      link: transactionLink(tx.deposit.transactionHash, deployment.l1),
    },
    match(tx)
      .with({ deposit: P.when(({ blockNumber }) => !blockNumber) }, (d) => ({
        label: t("activity.l2Confirmation"),
        status: ProgressRowStatus.NotDone,
        time: l2ConfirmationText,
      }))
      .with({ relay: { status: TransactionStatus.confirmed } }, (tx) => ({
        label: t("activity.l2Confirmation"),
        status: ProgressRowStatus.Done,
        link: transactionLink(tx.relay.transactionHash, deployment.l2),
      }))
      .with({ relay: { status: TransactionStatus.reverted } }, (tx) => ({
        label: t("activity.l2Confirmation"),
        status: ProgressRowStatus.Reverted,
        link: transactionLink(tx.relay.transactionHash, deployment.l2),
      }))
      .otherwise((tx) => {
        if (tx.deposit.timestamp < Date.now() - 1000 * 60 * 60) {
          return {
            label: "Manual relay required",
            status: ProgressRowStatus.InProgress,
            buttonComponent: ButtonComponent.Redeem,
          };
        }
        return {
          label: t("activity.waitingForL2"),
          status: ProgressRowStatus.InProgress,
          time: l2ConfirmationText,
        };
      }),
  ];
};
