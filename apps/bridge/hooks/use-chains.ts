import { useMemo } from "react";

import { ChainDto } from "@/codegen/model";
import { useInjectedStore } from "@/state/injected";

import { useIsSuperbridge } from "./apps/use-is-superbridge";
import { useHyperlaneMailboxes } from "./hyperlane/use-hyperlane-mailboxes";

export const useAllChains = () => {
  const hyperlaneMailboxes = useHyperlaneMailboxes();
  const injectedChains = useInjectedStore((s) => s.chains);

  return useMemo(() => {
    const cache: { [chainId: number]: ChainDto } = {};

    for (const chain of [
      ...injectedChains,
      ...hyperlaneMailboxes.map((x) => x.chain),
    ]) {
      cache[chain.id] = chain;
    }

    return Object.values(cache);
  }, [injectedChains, hyperlaneMailboxes]);
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
      else return allChains.filter((c) => !c.testnet);
    }
    return allChains;
  }, [allChains, superbridgeTestnetsEnabled]);
};
