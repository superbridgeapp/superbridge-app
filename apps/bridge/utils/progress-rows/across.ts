import { useAcrossDomains } from "@/hooks/across/use-across-domains";
import { useTxToken } from "@/hooks/activity/use-tx-token";
import { Transaction } from "@/types/transaction";

import { isAcrossBridge } from "../guards";
import { ActivityStep, buildWaitStep } from "./common";

export const useAcrossProgressRows = (
  tx: Transaction | null
): ActivityStep[] | null => {
  const acrossDomains = useAcrossDomains();
  const token = useTxToken(tx);

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
      label: "Start bridge",
      hash: tx.deposit.timestamp ? tx.deposit.transactionHash : undefined,
      pendingHash: tx.deposit.timestamp
        ? undefined
        : tx.deposit.transactionHash,
      chain: fromDomain.chain,
      button: undefined,
      fee: undefined,
    },
    buildWaitStep(tx.deposit.timestamp, tx.fill?.timestamp, 2 * 1000 * 60),
    {
      label: `Receive ${token?.symbol}`,
      hash: tx.fill?.transactionHash,
      pendingHash: undefined,
      chain: toDomain.chain,
      button: undefined,
      fee: undefined,
    },
  ];
};
