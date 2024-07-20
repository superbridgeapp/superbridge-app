import { useMemo } from "react";

import { useConfigState } from "@/state/config";

import { useAcrossDomains } from "./across/use-across-domains";
import { useCctpDomains } from "./cctp/use-cctp-domains";
import { useDeployments } from "./use-deployments";

export const useChain = (chainId: number | undefined | null) => {
  const deployments = useDeployments();
  const acrossDomains = useAcrossDomains();
  const cctpDomains = useCctpDomains();

  return useMemo(() => {
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
  }, [deployments, acrossDomains, cctpDomains, chainId]);
};

export const useFromChain = () => {
  const fromChainId = useConfigState.useFromChainId();
  return useChain(fromChainId);
};

export const useToChain = () => {
  const toChainId = useConfigState.useToChainId();
  return useChain(toChainId);
};
