import { useTranslation } from "react-i18next";

import { useTxToken } from "@/hooks/activity/use-tx-token";
import { useChain } from "@/hooks/use-chain";
import { useInjectedStore } from "@/state/injected";
import { Transaction } from "@/types/transaction";

import { isHyperlaneBridge } from "../guards";
import { ActivityStep, buildWaitStep } from "./common";

export const useHyperlaneProgressRows = (
  tx: Transaction | null
): ActivityStep[] | null => {
  const { t } = useTranslation();
  const token = useTxToken(tx);

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
      label: "Start bridge",
      hash: tx.send.timestamp ? tx.send.transactionHash : undefined,
      pendingHash: tx.send.timestamp ? undefined : tx.send.transactionHash,
      chain: fromChain,
      button: undefined,
    },
    buildWaitStep(tx.send.timestamp, tx.receive?.timestamp, 1000 * 60 * 5),
    {
      label: `Receive ${token?.symbol}`,
      hash: tx.receive?.transactionHash,
      pendingHash: undefined,
      chain: toChain,
      button: undefined,
    },
  ];
};
