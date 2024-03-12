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

export const useOptimismWithdrawalProgressRows = () => {
  const pendingFinalises = usePendingTransactions.usePendingFinalises();
  const pendingProves = usePendingTransactions.usePendingProves();
  const transformPeriodText = usePeriodText();

  return (w: BridgeWithdrawalDto | undefined): ExpandedItem[] => {
    const finalizationPeriod = getFinalizationPeriod(
      w?.deployment ?? null,
      false
    );
    const provePeriod = getProvePeriod(w?.deployment ?? null);
    console.log(">>>", w?.deployment, provePeriod);
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
          label: "Proving...",
          status: ProgressRowStatus.InProgress,
          buttonComponent: undefined,
          link: transactionLink(pendingProve!, w!.deployment.l1),
        })
      )
      .with({ w: { status: MessageStatus.READY_TO_PROVE } }, () => ({
        label: "Ready to prove...",
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
          label: "Proved",
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
          label: "Proved",
          status: ProgressRowStatus.NotDone,
          buttonComponent: undefined,
          link: undefined,
        })
      )
      // status > MessageStatus.READY_TO_PROVE
      .otherwise(({ w }) => ({
        label: "Proved",
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
          label: "Finalizing...",
          status: ProgressRowStatus.InProgress,
          buttonComponent: undefined,
          link: transactionLink(pendingFinalise!, w!.deployment.l1),
        })
      )
      .with({ status: MessageStatus.READY_FOR_RELAY }, () => ({
        label: "Ready to finalize...",
        status: ProgressRowStatus.InProgress,
        buttonComponent: ButtonComponent.Finalise,
        link: undefined,
      }))
      .with({ status: MessageStatus.RELAYED }, (w) => ({
        label: "Finalized",
        status: ProgressRowStatus.Done,
        buttonComponent: undefined,
        link: transactionLink(w.finalise!.transactionHash, w.deployment?.l1),
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
        status: w ? ProgressRowStatus.Done : ProgressRowStatus.NotDone,
        link: w
          ? transactionLink(w.withdrawal.transactionHash, w.deployment.l2)
          : undefined,
      },
      {
        label:
          w?.status === MessageStatus.STATE_ROOT_NOT_PUBLISHED
            ? "Waiting for state root..."
            : "State root published",
        status: w
          ? w?.status === MessageStatus.STATE_ROOT_NOT_PUBLISHED
            ? ProgressRowStatus.InProgress
            : ProgressRowStatus.Done
          : ProgressRowStatus.NotDone,
        time:
          !w?.status || w.status <= MessageStatus.STATE_ROOT_NOT_PUBLISHED
            ? transformPeriodText("transferTime", {}, provePeriod)
            : undefined,
      },
      prove,
      {
        label:
          w?.status === MessageStatus.IN_CHALLENGE_PERIOD
            ? "Challenge period..."
            : "Challenge period",
        status:
          !w?.status || w.status < MessageStatus.IN_CHALLENGE_PERIOD
            ? ProgressRowStatus.NotDone
            : w.status === MessageStatus.IN_CHALLENGE_PERIOD
            ? ProgressRowStatus.InProgress
            : ProgressRowStatus.Done,
        time:
          w?.status === MessageStatus.IN_CHALLENGE_PERIOD
            ? "" // countdown
            : w?.status && w.status <= MessageStatus.IN_CHALLENGE_PERIOD
            ? transformPeriodText("transferTime", {}, finalizationPeriod)
            : undefined,
      },
      finalise,
    ];
  };
};
