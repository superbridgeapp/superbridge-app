import { useTranslation } from "react-i18next";

import { useTxAmount } from "@/hooks/activity/use-tx-amount";
import { useTxMultichainToken } from "@/hooks/activity/use-tx-token";
import { useHyperlaneMailboxes } from "@/hooks/hyperlane/use-hyperlane-mailboxes";
import { useChain } from "@/hooks/use-chain";
import { Transaction } from "@/types/transaction";

import { isHyperlaneBridge } from "../guards";
import { ActivityStep, buildWaitStep } from "./common";

export const useHyperlaneProgressRows = (
  tx: Transaction | null
): ActivityStep[] | null => {
  const { t } = useTranslation();
  const token = useTxMultichainToken(tx);

  const hyperlaneMailboxes = useHyperlaneMailboxes();

  const fromMailbox =
    tx && isHyperlaneBridge(tx)
      ? hyperlaneMailboxes.find((x) => x.domain === tx.fromDomain)
      : null;
  const toMailbox =
    tx && isHyperlaneBridge(tx)
      ? hyperlaneMailboxes.find((x) => x.domain === tx.toDomain)
      : null;

  const inputAmount = useTxAmount(tx, token?.[fromMailbox?.chainId ?? 0]);
  const outputAmount = useTxAmount(tx, token?.[toMailbox?.chainId ?? 0]);

  const fromChain = useChain(fromMailbox?.chainId);
  const toChain = useChain(toMailbox?.chainId);

  if (!tx || !isHyperlaneBridge(tx) || !fromChain || !toChain) {
    return null;
  }

  return [
    {
      label: t("confirmationModal.startBridgeOn", {
        from: fromChain.name,
      }),
      hash: tx.send.timestamp ? tx.send.transactionHash : undefined,
      pendingHash: tx.send.timestamp ? undefined : tx.send.transactionHash,
      chain: fromChain,
      button: undefined,
      token,
      amount: inputAmount,
    },
    buildWaitStep(tx.send.timestamp, tx.receive?.timestamp, tx.duration),
    {
      label: t("confirmationModal.getAmountOn", {
        to: toChain.name,
        formatted: outputAmount?.text,
      }),
      hash: tx.receive?.transactionHash,
      pendingHash: undefined,
      chain: toChain,
      button: undefined,
      token,
      amount: outputAmount,
    },
  ];
};
