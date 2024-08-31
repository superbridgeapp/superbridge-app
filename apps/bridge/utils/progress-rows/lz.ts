import { useTxToken } from "@/hooks/activity/use-tx-token";
import { useLzDomains } from "@/hooks/lz/use-lz-domains";
import { useChain } from "@/hooks/use-chain";
import { Transaction } from "@/types/transaction";

import { isLzBridge } from "../guards";
import { ActivityStep, buildWaitStep } from "./common";

export const useLzProgressRows = (
  tx: Transaction | null
): ActivityStep[] | null => {
  const token = useTxToken(tx);
  const domains = useLzDomains();

  const fromDomain =
    tx && isLzBridge(tx) ? domains.find((x) => x.eId === tx.fromEid) : null;
  const toDomain =
    tx && isLzBridge(tx) ? domains.find((x) => x.eId === tx.toEid) : null;

  const fromChain = useChain(fromDomain?.chainId);
  const toChain = useChain(toDomain?.chainId);

  if (!tx || !isLzBridge(tx) || !fromChain || !toChain) {
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
    buildWaitStep(tx.send.timestamp, tx.receive?.timestamp, 1000 * 60 * 2),
    {
      label: `Receive ${token?.symbol}`,
      hash: tx.receive?.transactionHash,
      pendingHash: undefined,
      chain: toChain,
      button: undefined,
    },
  ];
};
