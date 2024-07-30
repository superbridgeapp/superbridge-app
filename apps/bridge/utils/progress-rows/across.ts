import { useTranslation } from "react-i18next";

import { useAcrossDomains } from "@/hooks/across/use-across-domains";
import { usePeriodText } from "@/hooks/use-period-text";
import { Transaction } from "@/types/transaction";

import { isAcrossBridge } from "../guards";
import { ActivityStep } from "./common";

export const useAcrossProgressRows = (
  tx: Transaction | null
): ActivityStep[] | null => {
  const { t } = useTranslation();
  const transformPeriodText = usePeriodText();

  const acrossDomains = useAcrossDomains();

  if (!tx || !isAcrossBridge(tx)) {
    return null;
  }

  const fromDomain = acrossDomains.find((x) => x.chain.id === tx.fromChainId);
  const toDomain = acrossDomains.find((x) => x.chain.id === tx.toChainId);
  if (!fromDomain?.chain || !toDomain?.chain) {
    return null;
  }

  return [
    {
      label: "bridge",
      hash: tx.deposit.timestamp ? tx.deposit.transactionHash : undefined,
      pendingHash: tx.deposit.timestamp
        ? undefined
        : tx.deposit.transactionHash,
      chain: fromDomain.chain,
      button: undefined,
      fee: undefined,
    },
    tx.deposit.timestamp
      ? {
          startedAt: tx.deposit.timestamp,
          duration: tx.duration,
        }
      : {
          duration: tx.duration,
        },
    {
      label: "receive",
      hash: tx.fill?.transactionHash,
      pendingHash: undefined,
      chain: toDomain.chain,
      button: undefined,
      fee: undefined,
    },
  ];
};
