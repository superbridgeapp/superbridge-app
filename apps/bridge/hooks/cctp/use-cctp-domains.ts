import { useMemo } from "react";

import { useInjectedStore } from "@/state/injected";

import { useIsSuperbridge } from "../apps/use-is-superbridge";

export const useCctpDomains = () => {
  const superbridgeTestnets = useInjectedStore((s) => s.superbridgeTestnets);
  const allCctpDomains = useInjectedStore((s) => s.cctpDomains);
  const isSuperbridge = useIsSuperbridge();

  return useMemo(() => {
    if (isSuperbridge) {
      if (superbridgeTestnets) {
        return allCctpDomains.filter((x) => x.chain.testnet);
      } else {
        return allCctpDomains.filter((x) => !x.chain.testnet);
      }
    } else {
      return allCctpDomains;
    }
  }, [superbridgeTestnets, allCctpDomains]);
};
