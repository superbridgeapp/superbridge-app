import { Transaction } from "@/types/transaction";
import {
  isAcrossBridge,
  isCctpBridge,
  isDeposit,
  isForcedWithdrawal,
  isHyperlaneBridge,
} from "@/utils/guards";

import { useAcrossDomains } from "../across/use-across-domains";
import { useHyperlaneMailboxes } from "../hyperlane/use-hyperlane-mailboxes";
import { useDeployments } from "../use-deployments";

export const useTxFromTo = (tx: Transaction | undefined) => {
  const acrossDomains = useAcrossDomains();
  const deployments = useDeployments();
  const hyperlaneMailboxes = useHyperlaneMailboxes();

  if (!tx) {
    return null;
  }

  if (isForcedWithdrawal(tx)) {
    const deployment = deployments.find(
      (d) => tx.deposit.deploymentId === d.id
    )!;
    return { from: deployment.l2, to: deployment.l1 };
  }

  if (isCctpBridge(tx)) {
    return { from: tx.from, to: tx.to };
  }

  if (isAcrossBridge(tx)) {
    const from = acrossDomains.find(
      (x) => x.chain.id === tx.fromChainId
    )!.chain;
    const to = acrossDomains.find((x) => x.chain.id === tx.toChainId)!.chain;
    return { from, to };
  }

  if (isHyperlaneBridge(tx)) {
    const from = hyperlaneMailboxes.find(
      (x) => x.domain === tx.fromDomain
    )!.chain;
    const to = hyperlaneMailboxes.find((x) => x.domain === tx.toDomain)!.chain;
    return { from, to };
  }

  const deployment = deployments.find((d) => tx?.deploymentId === d.id)!;
  return isDeposit(tx)
    ? { from: deployment.l1, to: deployment.l2 }
    : { from: deployment.l2, to: deployment.l1 };
};
