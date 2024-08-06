import { useMemo } from "react";

import { useInjectedStore } from "@/state/injected";

import { useIsSuperbridge } from "../apps/use-is-superbridge";

export const useAcrossDomains = () => {
  const superbridgeTestnets = useInjectedStore((s) => s.superbridgeTestnets);
  const domains = useInjectedStore((s) => s.acrossDomains);
  const isSuperbridge = useIsSuperbridge();

  return useMemo(() => {
    if (isSuperbridge) {
      if (superbridgeTestnets) {
        return domains.filter((x) => x.chain.testnet);
      } else {
        return domains.filter((x) => !x.chain.testnet);
      }
    } else {
      return domains;
    }
  }, [superbridgeTestnets, domains]);
};
