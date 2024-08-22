import { useTranslation } from "react-i18next";
import { P, match } from "ts-pattern";

import {
  ArbitrumDepositEthDto,
  ArbitrumDepositRetryableDto,
  DeploymentDto,
  TransactionStatus,
} from "@/codegen/model";
import { useDeployments } from "@/hooks/use-deployments";
import { getDepositTime } from "@/hooks/use-finalization-period";
import { usePeriodText } from "@/hooks/use-period-text";

import { transactionLink } from "../transaction-link";
import { ButtonComponent, ExpandedItem, ProgressRowStatus } from "./common";
import { getRemainingTimePeriod } from "./get-remaining-period";

export const useArbitrumDepositProgressRows = () => {
  const { t } = useTranslation();
  const transformPeriodText = usePeriodText();

  return (
    tx: Pick<
      ArbitrumDepositRetryableDto | ArbitrumDepositEthDto,
      "deposit" | "relay"
    >,
    deployment: DeploymentDto | null
  ): ExpandedItem[] => {
    if (!deployment) {
      return [];
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
          if (tx.deposit.timestamp < Date.now() - 1000 * 60 * 25) {
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
};
