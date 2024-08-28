import { Transaction } from "@/types/transaction";
import {
  isAcrossBridge,
  isCctpBridge,
  isDeposit,
  isForcedWithdrawal,
  isWithdrawal,
} from "@/utils/guards";

export const getInitiatingTx = (tx: Transaction | undefined) => {
  if (!tx) return null;
  if (isAcrossBridge(tx)) return tx.deposit;
  if (isCctpBridge(tx)) return tx.bridge;
  if (isDeposit(tx)) return tx.deposit;
  if (isWithdrawal(tx)) return tx.withdrawal;
  if (isForcedWithdrawal(tx)) return tx.deposit.deposit;
  return tx.send;
};

export const useInitiatingTx = getInitiatingTx;
