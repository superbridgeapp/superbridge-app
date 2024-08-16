import { Transaction } from "@/types/transaction";
import {
  isAcrossBridge,
  isCctpBridge,
  isDeposit,
  isForcedWithdrawal,
} from "@/utils/guards";

import { useAcrossDomains } from "./across/use-across-domains";
import { useDeployments } from "./use-deployments";

export const useFromTo = (tx: Transaction) => {
  const acrossDomains = useAcrossDomains();
  const deployments = useDeployments();

  if (isForcedWithdrawal(tx)) {
    const deployment = deployments.find(
      (d) => tx.deposit.deploymentId === d.id
    );
    if (!deployment) {
      return null;
    }
    return [deployment.l2, deployment.l1];
  }

  if (isCctpBridge(tx)) {
    return [tx.from, tx.to];
  }

  if (isAcrossBridge(tx)) {
    const from = acrossDomains.find(
      (x) => x.chain.id === tx.fromChainId
    )?.chain;
    const to = acrossDomains.find((x) => x.chain.id === tx.toChainId)?.chain;
    if (!from || !to) {
      return null;
    }
    return [from, to];
  }

  const deployment = deployments.find((d) => tx.deploymentId === d.id);
  if (!deployment) {
    return null;
  }
  return isDeposit(tx)
    ? [deployment.l1, deployment.l2]
    : [deployment.l2, deployment.l1];
};
