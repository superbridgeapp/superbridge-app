import { Transaction } from "@/types/transaction";
import {
  isAcrossBridge,
  isDeposit,
  isForcedWithdrawal,
  isHyperlaneBridge,
  isWithdrawal,
} from "@/utils/guards";

export const useFinalisingTx = (tx: Transaction | undefined) => {
  if (!tx) return null;
  if (isAcrossBridge(tx)) return tx.fill;
  if (isHyperlaneBridge(tx)) return tx.receive;
  if (isDeposit(tx)) return tx.relay;
  if (isWithdrawal(tx)) return tx.finalise;
  if (isForcedWithdrawal(tx)) return tx.withdrawal?.finalise;
  return tx.relay;
};
