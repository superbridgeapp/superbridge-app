import { Transaction } from "@/types/transaction";
import {
  isCctpBridge,
  isForcedWithdrawal,
  isHyperlaneBridge,
} from "@/utils/guards";

export const useTxSender = (tx: Transaction) => {
  if (isHyperlaneBridge(tx)) return tx.from;
  if (isCctpBridge(tx)) return tx.from;
  if (isForcedWithdrawal(tx)) return tx.deposit.metadata.from;
  return tx.metadata.from;
};
