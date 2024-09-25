import { useTranslation } from "react-i18next";

import { useTxMultichainToken } from "@/hooks/activity/use-tx-token";
import { useLzDomains } from "@/hooks/lz/use-lz-domains";
import { useChain } from "@/hooks/use-chain";
import { Transaction } from "@/types/transaction";

import { isLzBridge } from "../guards";
import { ActivityStep, buildWaitStep } from "./common";

export const useLzProgressRows = (
  tx: Transaction | null
): ActivityStep[] | null => {
  const domains = useLzDomains();
  const { t } = useTranslation();

  const fromDomain =
    tx && isLzBridge(tx) ? domains.find((x) => x.eId === tx.fromEid) : null;
  const toDomain =
    tx && isLzBridge(tx) ? domains.find((x) => x.eId === tx.toEid) : null;

  const fromChain = useChain(fromDomain?.chainId);
  const toChain = useChain(toDomain?.chainId);
  const token = useTxMultichainToken(tx);

  if (!tx || !isLzBridge(tx) || !fromChain || !toChain) {
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
    },
    buildWaitStep(tx.send.timestamp, tx.receive?.timestamp, 1000 * 60 * 2),
    {
      label: t("confirmationModal.getOn", {
        to: toChain.name,
      }),
      hash: tx.receive?.transactionHash,
      pendingHash: undefined,
      chain: toChain,
      button: undefined,
      token,
    },
  ];
};
