import { Transaction } from "@/types/transaction";
import { isAcrossBridge } from "@/utils/guards";

import { useAcrossDomains } from "../across/use-across-domains";

export const useTxAcrossDomains = (tx: Transaction | undefined | null) => {
  const acrossDomains = useAcrossDomains();

  if (!tx || !isAcrossBridge(tx)) {
    return null;
  }

  const from = acrossDomains.find((x) => x.chain.id === tx.fromChainId);
  const to = acrossDomains.find((x) => x.chain.id === tx.toChainId);

  if (!from || !to) {
    return null;
  }

  return { from, to };
};
