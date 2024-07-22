import { useTranslation } from "react-i18next";

import { useChain } from "@/hooks/use-chain";
import { Period } from "@/hooks/use-finalization-period";
import { usePeriodText } from "@/hooks/use-period-text";
import { useInjectedStore } from "@/state/injected";
import { usePendingTransactions } from "@/state/pending-txs";
import { Transaction } from "@/types/transaction";

import { isHyperlaneBridge } from "../guards";
import { transactionLink } from "../transaction-link";
import { ExpandedItem, ProgressRowStatus } from "./common";
import { getRemainingTimePeriod } from "./get-remaining-period";

export const useHyperlaneProgressRows = (
  tx: Transaction
): ExpandedItem[] | null => {
  const { t } = useTranslation();
  const pendingFinalises = usePendingTransactions.usePendingFinalises();
  const transformPeriodText = usePeriodText();

  const hyperlaneMailboxes = useInjectedStore((s) => s.hyperlaneMailboxes);

  const mailbox = isHyperlaneBridge(tx)
    ? hyperlaneMailboxes.find((x) => x.domain === tx.fromDomain)
    : null;

  const chain = useChain(mailbox?.chainId);

  if (!isHyperlaneBridge(tx)) {
    return null;
  }

  const pendingFinalise = pendingFinalises[tx?.id ?? ""];
  const bridgeTime: Period = { period: "mins", value: 5 };

  const l2ConfirmationText = (() => {
    if (!bridgeTime || tx.receive) return "";
    if (!tx.send.blockNumber) {
      return transformPeriodText("transferTime", {}, bridgeTime);
    }

    const remainingTimePeriod = getRemainingTimePeriod(
      tx.send.timestamp,
      bridgeTime
    );
    if (!remainingTimePeriod) return "";
    return transformPeriodText("activity.remaining", {}, remainingTimePeriod);
  })();
  return [
    {
      label: tx.send.blockNumber
        ? t("activity.bridged")
        : t("activity.bridging"),
      status: tx.send.blockNumber
        ? ProgressRowStatus.Done
        : ProgressRowStatus.InProgress,
      link: transactionLink(tx.send.transactionHash, chain),
    },
    {
      label: tx.receive?.blockNumber
        ? t("activity.bridged")
        : t("activity.bridging"),
      status: tx.receive?.blockNumber
        ? ProgressRowStatus.Done
        : ProgressRowStatus.InProgress,
      link: tx.receive
        ? transactionLink(tx.receive?.transactionHash, chain)
        : undefined,
    },
    // .with(
    //   { tx: { bridge: P.when(({ blockNumber }) => !blockNumber) } },
    //   () => ({
    //     label: t("activity.l2Confirmation"),
    //     status: ProgressRowStatus.NotDone,
    //     text: l2ConfirmationText,
    //   })
    // )
    // .with({ tx: { relay: P.when((relay) => !!relay?.blockNumber) } }, () => ({
    //   label: t("activity.minted"),
    //   status: ProgressRowStatus.Done,
    //   link: transactionLink(tx.relay!.transactionHash, tx.to),
    // }))
    // .with({ pendingFinalise: P.not(undefined) }, () => ({
    //   label: t("activity.minting"),
    //   status: ProgressRowStatus.InProgress,
    // }))
  ];
};
