import { Transaction } from "@/types/transaction";
import {
  isAcrossBridge,
  isDeposit,
  isForcedWithdrawal,
  isHyperlaneBridge,
  isWithdrawal,
} from "@/utils/guards";

export const getInitiatingTx = (tx: Transaction | undefined) => {
  if (!tx) return null;
  if (isAcrossBridge(tx)) return tx.deposit;
  if (isHyperlaneBridge(tx)) return tx.send;
  if (isDeposit(tx)) return tx.deposit;
  if (isWithdrawal(tx)) return tx.withdrawal;
  if (isForcedWithdrawal(tx)) return tx.deposit.deposit;
  return tx.bridge;
};

export const useInitiatingTx = getInitiatingTx;
