import { Transaction } from "@/types/transaction";
import {
  isAcrossBridge,
  isCctpBridge,
  isDeposit,
  isForcedWithdrawal,
  isWithdrawal,
} from "@/utils/guards";

export const useTxTimestamp = (tx: Transaction): number | undefined => {
  if (isDeposit(tx)) return tx.deposit.timestamp;
  if (isWithdrawal(tx)) return tx.withdrawal.timestamp;
  if (isForcedWithdrawal(tx)) return tx.deposit.deposit.timestamp;
  if (isAcrossBridge(tx)) return tx.deposit.timestamp;
  if (isCctpBridge(tx)) return tx.bridge.timestamp;
  return tx.send.timestamp;
};
