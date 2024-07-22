import { useMemo } from "react";

import { isSuperbridge } from "@/config/app";
import { useInjectedStore } from "@/state/injected";

export const useCctpDomains = () => {
  const superbridgeTestnets = useInjectedStore((s) => s.testnets);
  const allCctpDomains = useInjectedStore((s) => s.cctpDomains);

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
