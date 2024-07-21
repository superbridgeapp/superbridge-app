import { useMemo } from "react";

import { ChainDto } from "@/codegen/model";
import { useInjectedStore } from "@/state/injected";

export const useChains = () => {
  const { deployments, cctpDomains, acrossDomains, hyperlaneMailboxes } =
    useInjectedStore((s) => s);

  return useMemo(() => {
    const byId: { [chainId: string]: ChainDto } = {};

    for (const d of deployments) {
      if (!byId[d.l1.id]) {
        byId[d.l1.id] = d.l1;
      }
      if (!byId[d.l2.id]) {
        byId[d.l2.id] = d.l2;
      }
    }

    [...cctpDomains, ...acrossDomains, ...hyperlaneMailboxes].forEach((d) => {
      if (!byId[d.chain.id]) {
        byId[d.chain.id] = d.chain;
      }
    });

    return Object.values(byId);
  }, []);
};
