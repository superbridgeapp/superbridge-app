import { Transaction } from "@/types/transaction";
import {
  isOptimismForcedWithdrawal,
  isOptimismWithdrawal,
} from "@/utils/guards";

export const useProveTx = (tx: Transaction | undefined) => {
  if (!tx) return null;
  if (isOptimismWithdrawal(tx)) return tx.prove;
  if (isOptimismForcedWithdrawal(tx)) return tx.withdrawal?.prove;
  return undefined;
};
