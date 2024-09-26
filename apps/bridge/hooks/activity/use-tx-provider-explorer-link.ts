import { Transaction } from "@/types/transaction";
import { isHyperlaneBridge } from "@/utils/guards";

export const useTxProviderExplorerLink = (
  tx: Transaction | null | undefined
) => {
  if (tx && isHyperlaneBridge(tx))
    return `https://explorer.hyperlane.xyz/message/${tx.hyperlaneMessageId}`;

  return null;
};
