import { Transaction } from "@/types/transaction";
import {
  isAcrossBridge,
  isDeposit,
  isForcedWithdrawal,
  isHyperlaneBridge,
  isWithdrawal,
} from "@/utils/guards";

export const useTxTimestamp = (tx: Transaction): number => {
  if (isDeposit(tx)) return tx.deposit.timestamp;
  if (isWithdrawal(tx)) return tx.withdrawal.timestamp;
  if (isForcedWithdrawal(tx)) return tx.deposit.deposit.timestamp;
  if (isAcrossBridge(tx)) return tx.deposit.timestamp;
  if (isHyperlaneBridge(tx)) return tx.send.timestamp;
  return tx.bridge.timestamp;
};
