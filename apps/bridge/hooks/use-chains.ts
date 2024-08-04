import { useMemo } from "react";

import { isSuperbridge } from "@/config/app";
import { useInjectedStore } from "@/state/injected";

export const useAllChains = () => {
  return useInjectedStore((s) => s.chains);
};

export const useChains = () => {
  const allChains = useAllChains();

  const superbridgeTestnetsEnabled = useInjectedStore((s) => s.testnets);

  return useMemo(() => {
    if (isSuperbridge) {
      if (superbridgeTestnetsEnabled) return allChains.filter((c) => c.testnet);
      else allChains.filter((c) => !c.testnet);
    }
    return allChains;
  }, [allChains, superbridgeTestnetsEnabled]);
};
