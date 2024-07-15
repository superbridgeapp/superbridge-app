import { useConfigState } from "@/state/config";
import { useFastState } from "@/state/fast";

import { useAcrossDomains } from "./across/use-across-domains";
import { useDeployment } from "./use-deployment";

export const useFromChain = () => {
  const deployment = useDeployment();
  const acrossDomains = useAcrossDomains();

  const fast = useConfigState.useFast();
  const withdrawing = useConfigState.useWithdrawing();
  const fastFromChainId = useFastState.useFromChainId();

  if (fast) {
    return acrossDomains.find((x) => x.chain.id === fastFromChainId)?.chain;
  }

  return withdrawing ? deployment?.l2 : deployment?.l1;
};

export const useToChain = () => {
  const deployment = useDeployment();
  const acrossDomains = useAcrossDomains();

  const fast = useConfigState.useFast();
  const withdrawing = useConfigState.useWithdrawing();
  const fastToChainId = useFastState.useToChainId();

  if (fast) {
    return acrossDomains.find((x) => x.chain.id === fastToChainId)?.chain;
  }

  return withdrawing ? deployment?.l1 : deployment?.l2;
};

export const useChain = (chainId: number | undefined) => {
  const deployment = useDeployment();
  const acrossDomains = useAcrossDomains();

  const fast = useConfigState.useFast();

  if (!chainId) {
    return null;
  }

  if (fast) {
    return acrossDomains.find((x) => x.chain.id === chainId)?.chain;
  }

  if (deployment?.l1.id === chainId) return deployment.l1;
  if (deployment?.l2.id === chainId) return deployment.l2;

  return null;
};
