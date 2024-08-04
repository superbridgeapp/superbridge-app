import { Transaction } from "@/types/transaction";
import {
  isAcrossBridge,
  isCctpBridge,
  isDeposit,
  isForcedWithdrawal,
  isHyperlaneBridge,
  isWithdrawal,
} from "@/utils/guards";

import { useDeployments } from "../deployments/use-deployments";
import { useHyperlaneMailboxes } from "../hyperlane/use-hyperlane-mailboxes";
import { useChain } from "../use-chain";

export const useTxFromTo = (tx: Transaction | undefined | null) => {
  const deployments = useDeployments();
  const hyperlaneMailboxes = useHyperlaneMailboxes();

  let fromChainId = 0;
  let toChainId = 0;

  if (tx && isForcedWithdrawal(tx)) {
    const deployment = deployments.find(
      (d) => tx.deposit.deploymentId === d.id
    )!;
    fromChainId = deployment.l2ChainId;
    toChainId = deployment.l1ChainId;
  }

  if (tx && isCctpBridge(tx)) {
    fromChainId = tx.fromChainId;
    toChainId = tx.toChainId;
  }

  if (tx && isAcrossBridge(tx)) {
    fromChainId = tx.fromChainId;
    toChainId = tx.toChainId;
  }

  if (tx && isHyperlaneBridge(tx)) {
    fromChainId =
      hyperlaneMailboxes.find((x) => x.domain === tx.fromDomain)?.chainId ?? 0;
    toChainId =
      hyperlaneMailboxes.find((x) => x.domain === tx.toDomain)?.chainId ?? 0;
  }

  if (tx && isDeposit(tx)) {
    const deployment = deployments.find((d) => tx?.deploymentId === d.id);
    fromChainId = deployment?.l1ChainId ?? 0;
    toChainId = deployment?.l2ChainId ?? 0;
  }

  if (tx && isWithdrawal(tx)) {
    const deployment = deployments.find((d) => tx?.deploymentId === d.id);
    fromChainId = deployment?.l2ChainId ?? 0;
    toChainId = deployment?.l1ChainId ?? 0;
  }

  const from = useChain(fromChainId);
  const to = useChain(toChainId);

  if (!from || !to) {
    return null;
  }

  return { from, to };
};
