import { useMemo } from "react";

import { ChainDto } from "@/codegen/model";
import { useInjectedStore } from "@/state/injected";

import { useAcrossDomains } from "./across/use-across-domains";
import { useCctpDomains } from "./cctp/use-cctp-domains";
import { useHyperlaneMailboxes } from "./hyperlane/use-hyperlane-mailboxes";
import { useDeployments } from "./use-deployments";

export const useAllChains = () => {
  const { deployments, cctpDomains, acrossDomains, hyperlaneMailboxes } =
    useInjectedStore((s) => s);

  const a = useMemo(() => {
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

  return a;
};

export const useChains = () => {
  const deployments = useDeployments();
  const cctpDomains = useCctpDomains();
  const acrossDomains = useAcrossDomains();
  const hyperlaneMailboxes = useHyperlaneMailboxes();

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
