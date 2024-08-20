import { Transaction } from "@/types/transaction";
import {
  isCctpBridge,
  isForcedWithdrawal,
  isHyperlaneBridge,
} from "@/utils/guards";

export const useTxRecipient = (tx: Transaction) => {
  if (isHyperlaneBridge(tx)) return tx.to;
  if (isCctpBridge(tx)) return tx.to;
  if (isForcedWithdrawal(tx)) return tx.deposit.metadata.to;
  return tx.metadata.to;
};

export const getTxRecipient = useTxRecipient;
