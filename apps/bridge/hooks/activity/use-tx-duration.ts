import { Transaction } from "@/types/transaction";
import {
  isAcrossBridge,
  isCctpBridge,
  isDeposit,
  isHyperlaneBridge,
} from "@/utils/guards";

import { useTxDeployment } from "./use-tx-deployment";

export const useTxDuration = (tx: Transaction): number | undefined => {
  const deployment = useTxDeployment(tx);
  if (isDeposit(tx)) return deployment?.depositDuration;
  if (isAcrossBridge(tx)) return tx.duration;
  if (isHyperlaneBridge(tx)) return tx.duration;
  if (isCctpBridge(tx)) return tx.duration;
};
