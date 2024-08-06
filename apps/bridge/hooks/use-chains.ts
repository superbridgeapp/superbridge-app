import { useMemo } from "react";

import { useInjectedStore } from "@/state/injected";

import { useIsSuperbridge } from "./apps/use-is-superbridge";

export const useAllChains = () => {
  return useInjectedStore((s) => s.chains);
};

export const useChains = () => {
  const allChains = useAllChains();
  const isSuperbridge = useIsSuperbridge();

  const superbridgeTestnetsEnabled = useInjectedStore(
    (s) => s.superbridgeTestnets
  );

  return useMemo(() => {
    if (isSuperbridge) {
      if (superbridgeTestnetsEnabled) return allChains.filter((c) => c.testnet);
      else allChains.filter((c) => !c.testnet);
    }
    return allChains;
  }, [allChains, superbridgeTestnetsEnabled]);
};
