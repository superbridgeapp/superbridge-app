import { useMemo } from "react";

import { isSuperbridge } from "@/config/app";
import { useInjectedStore } from "@/state/injected";

export const useAcrossDomains = () => {
  const superbridgeTestnets = useInjectedStore((s) => s.testnets);
  const domains = useInjectedStore((s) => s.acrossDomains);

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
