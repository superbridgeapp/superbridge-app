import { Transaction } from "@/types/transaction";
import {
  isAcrossBridge,
  isCctpBridge,
  isDeposit,
  isForcedWithdrawal,
  isHyperlaneBridge,
  isWithdrawal,
} from "@/utils/guards";

export function getInitiatingHash(tx: Transaction) {
  if (isDeposit(tx)) return tx.deposit.transactionHash;
  if (isWithdrawal(tx)) return tx.withdrawal.transactionHash;
  if (isForcedWithdrawal(tx)) return tx.deposit.deposit.transactionHash;
  if (isCctpBridge(tx)) return tx.bridge.transactionHash;
  if (isAcrossBridge(tx)) return tx.deposit.transactionHash;
  if (isHyperlaneBridge(tx)) return tx.send.transactionHash;
}
