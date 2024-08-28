import { Transaction } from "@/types/transaction";
import {
  isCctpBridge,
  isForcedWithdrawal,
  isHyperlaneBridge,
  isLzBridge,
} from "@/utils/guards";

export const useTxSender = (tx: Transaction) => {
  if (isHyperlaneBridge(tx) || isLzBridge(tx)) return tx.from;
  if (isCctpBridge(tx)) return tx.sender;
  if (isForcedWithdrawal(tx)) return tx.deposit.metadata.from;
  return tx.metadata.from;
};
