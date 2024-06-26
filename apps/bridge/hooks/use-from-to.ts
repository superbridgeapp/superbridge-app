import { Transaction } from "@/types/transaction";
import {
  isAcrossBridge,
  isCctpBridge,
  isDeposit,
  isForcedWithdrawal,
} from "@/utils/guards";

import { useAcrossDomains } from "./across/use-across-domains";

export const useFromTo = (tx: Transaction) => {
  const acrossDomains = useAcrossDomains();

  if (isForcedWithdrawal(tx)) {
    return [tx.deposit.deployment.l2, tx.deposit.deployment.l1];
  }

  if (isCctpBridge(tx)) {
    return [tx.from, tx.to];
  }

  if (isAcrossBridge(tx)) {
    const from = acrossDomains.find(
      (x) => x.chain.id === tx.fromChainId
    )!.chain;
    const to = acrossDomains.find((x) => x.chain.id === tx.toChainId)!.chain;
    return [from, to];
  }

  return isDeposit(tx)
    ? [tx.deployment.l1, tx.deployment.l2]
    : [tx.deployment.l2, tx.deployment.l1];
};
