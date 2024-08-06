import { useMemo } from "react";

import { useInjectedStore } from "@/state/injected";

import { useChains } from "./use-chains";

export const useChain = (chainId: number | undefined | null) => {
  const chains = useChains();
  return useMemo(() => {
    const chain = chains.find((x) => x.id === chainId);
    if (chain) {
      return chain;
    }

    return null;
  }, [chainId, chains]);
};

export const useFromChain = () => {
  const fromChainId = useInjectedStore((s) => s.fromChainId);
  return useChain(fromChainId);
};

export const useToChain = () => {
  const toChainId = useInjectedStore((s) => s.toChainId);
  return useChain(toChainId);
};
