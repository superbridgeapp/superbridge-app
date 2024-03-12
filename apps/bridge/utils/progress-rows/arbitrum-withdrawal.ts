import { P, match } from "ts-pattern";

import { ArbitrumWithdrawalDto, DeploymentType } from "@/codegen/model";
import { ArbitrumMessageStatus } from "@/constants/arbitrum-message-status";
import { usePendingTransactions } from "@/state/pending-txs";

import { transactionLink } from "../transaction-link";
import { ButtonComponent, ExpandedItem, ProgressRowStatus } from "./common";

export const useArbitrumWithdrawalProgressRows = () => {
  const pendingFinalises = usePendingTransactions.usePendingFinalises();
  const pendingProves = usePendingTransactions.usePendingProves();

  return (w: ArbitrumWithdrawalDto | undefined): ExpandedItem[] => {
    const pendingFinalise = pendingFinalises[w?.id ?? ""];

    const finalise = match({ ...w, pendingFinalise })
      // Special case for saved client side transactions
      .with(
        {
          status: ArbitrumMessageStatus.CONFIRMED,
          pendingFinalise: P.not(undefined),
        },
        (w) => ({
          label: "Finalizing...",
          status: ProgressRowStatus.InProgress,
          buttonComponent: undefined,
          link: transactionLink(pendingFinalise!, w.deployment!.l1),
        })
      )
      .with({ status: ArbitrumMessageStatus.CONFIRMED }, () => ({
        label: "Ready to finalize...",
        status: ProgressRowStatus.InProgress,
        buttonComponent: ButtonComponent.Finalise,
        link: undefined,
      }))
      .with({ status: ArbitrumMessageStatus.EXECUTED }, (w) => ({
        label: "Finalized",
        status: ProgressRowStatus.Done,
        buttonComponent: undefined,
        link: transactionLink(w.finalise!.transactionHash, w.deployment!.l1),
      }))
      .otherwise(() => ({
        label: "Finalized",
        status: ProgressRowStatus.NotDone,
        buttonComponent: undefined,
        link: undefined,
      }));

    return [
      {
        label: "Withdrawn",
        status: ProgressRowStatus.Done,
        link: w
          ? transactionLink(w.withdrawal.transactionHash, w.deployment.l2)
          : undefined,
      },
      {
        label: !w
          ? "Challenge period"
          : w.status === ArbitrumMessageStatus.UNCONFIRMED
          ? "Challenge period..."
          : "Challenge period",
        status: !w
          ? ProgressRowStatus.NotDone
          : w.status === ArbitrumMessageStatus.UNCONFIRMED
          ? ProgressRowStatus.InProgress
          : w.status === ArbitrumMessageStatus.CONFIRMED
          ? ProgressRowStatus.Done
          : ProgressRowStatus.Done,
        time:
          w?.status === ArbitrumMessageStatus.CONFIRMED
            ? undefined
            : w?.deployment.type === DeploymentType.testnet
            ? "~ 1 hour"
            : "7 days",
      },
      finalise,
    ];
  };
};
