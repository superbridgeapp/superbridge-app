import { Transaction } from "@/types/transaction";
import {
  isAcrossBridge,
  isCctpBridge,
  isDeposit,
  isForcedWithdrawal,
  isWithdrawal,
} from "@/utils/guards";

export const useFinalisingTx = (tx: Transaction | undefined) => {
  if (!tx) return null;
  if (isAcrossBridge(tx)) return tx.fill;
  if (isDeposit(tx)) return tx.relay;
  if (isWithdrawal(tx)) return tx.finalise;
  if (isForcedWithdrawal(tx)) return tx.withdrawal?.finalise;
  if (isCctpBridge(tx)) return tx.relay;
  return tx.receive;
};
