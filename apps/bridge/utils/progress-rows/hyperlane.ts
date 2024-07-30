import { useTranslation } from "react-i18next";

import { useChain } from "@/hooks/use-chain";
import { useInjectedStore } from "@/state/injected";
import { Transaction } from "@/types/transaction";

import { isHyperlaneBridge } from "../guards";
import { transactionLink } from "../transaction-link";
import { ActivityStep } from "./common";

export const useHyperlaneProgressRows = (
  tx: Transaction | null
): ActivityStep[] | null => {
  const { t } = useTranslation();

  const hyperlaneMailboxes = useInjectedStore((s) => s.hyperlaneMailboxes);

  const fromMailbox =
    tx && isHyperlaneBridge(tx)
      ? hyperlaneMailboxes.find((x) => x.domain === tx.fromDomain)
      : null;
  const toMailbox =
    tx && isHyperlaneBridge(tx)
      ? hyperlaneMailboxes.find((x) => x.domain === tx.toDomain)
      : null;

  const fromChain = useChain(fromMailbox?.chainId);
  const toChain = useChain(toMailbox?.chainId);

  if (!tx || !isHyperlaneBridge(tx) || !fromChain || !toChain) {
    return null;
  }

  return [
    {
      label: tx.send.blockNumber
        ? t("activity.bridged")
        : t("activity.bridging"),
      // status: tx.send.blockNumber
      //   ? ProgressRowStatus.Done
      //   : ProgressRowStatus.InProgress,
      link: transactionLink(tx.send.transactionHash, fromChain),
      chain: fromChain,
    },
    tx.send.timestamp
      ? {
          startedAt: tx.send.timestamp,
          duration: tx.duration,
        }
      : {
          duration: tx.duration,
        },
    {
      label: "Received",
      // status: !tx.send.blockNumber
      //   ? ProgressRowStatus.NotDone
      //   : tx.receive?.blockNumber
      //   ? ProgressRowStatus.Done
      //   : ProgressRowStatus.InProgress,
      link: tx.receive
        ? transactionLink(tx.receive?.transactionHash, toChain)
        : undefined,
      chain: toChain,
    },
  ];
};
