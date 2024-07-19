import { useConfigState } from "@/state/config";

import { useAcrossDomains } from "./across/use-across-domains";
import { useCctpDomains } from "./cctp/use-cctp-domains";
import { useDeployments } from "./use-deployments";

export const useChain = (chainId: number | undefined) => {
  const deployments = useDeployments();
  const acrossDomains = useAcrossDomains();
  const cctpDomains = useCctpDomains();

  if (!chainId) {
    return null;
  }

  const chain =
    deployments.find((d) => d.l1.id === chainId)?.l1 ||
    deployments.find((d) => d.l2.id === chainId)?.l2 ||
    acrossDomains.find((x) => x.chain.id === chainId)?.chain;
  if (chain) {
    return chain;
  }

  return null;
};

export const useFromChain = () => {
  const fromChainId = useConfigState.useFromChainId();
  return useChain(fromChainId);
};

export const useToChain = () => {
  const toChainId = useConfigState.useToChainId();
  return useChain(toChainId);
};
