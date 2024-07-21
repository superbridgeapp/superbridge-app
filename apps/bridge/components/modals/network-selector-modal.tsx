import { useMemo } from "react";

import { ChainDto } from "@/codegen/model";
import { useAcrossDomains } from "@/hooks/across/use-across-domains";
import { useCctpDomains } from "@/hooks/cctp/use-cctp-domains";
import { useFromChain, useToChain } from "@/hooks/use-chain";
import { useDeployments } from "@/hooks/use-deployments";
import { trackEvent } from "@/services/ga";
import { useConfigState } from "@/state/config";
import { useInjectedStore } from "@/state/injected";

import { NetworkIcon } from "../network-icon";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

export const NetworkSelectorModal = () => {
  const to = useToChain();
  const from = useFromChain();

  const networkSelectorModal = useConfigState.useNetworkSelectorModal();
  const setNetworkSelectorModal = useConfigState.useSetNetworkSelectorModal();
  const setFromChainId = useConfigState.useSetFromChainId();
  const setToChainId = useConfigState.useSetToChainId();
  const superbridgeTestnets = useInjectedStore((s) => s.testnets);

  const acrossDomains = useAcrossDomains();
  const deployments = useDeployments();
  const cctpDomains = useCctpDomains();

  const onSelect = (chain: ChainDto) => {
    if (networkSelectorModal === "from") {
      setFromChainId(chain.id);
      if (chain.id === to?.id) {
        trackEvent({ event: "to-chain-select", name: from!.name });
        setToChainId(from!.id);
      }

      trackEvent({ event: "from-chain-select", name: chain.name });
    }

    if (networkSelectorModal === "to") {
      setToChainId(chain.id);
      if (chain.id === from?.id) {
        trackEvent({ event: "from-chain-select", name: to!.name });
        setFromChainId(to!.id);
      }

      trackEvent({ event: "to-chain-select", name: chain.name });
    }

    setNetworkSelectorModal(null);
  };

  const chains = useMemo(() => {
    const byId: { [x: string]: ChainDto } = {};

    for (const d of deployments) {
      if (!byId[d.l1.id]) {
        byId[d.l1.id] = d.l1;
      }
      if (!byId[d.l2.id]) {
        byId[d.l2.id] = d.l2;
      }
    }

    if (!superbridgeTestnets) {
      for (const d of acrossDomains) {
        if (!byId[d.chain.id]) {
          byId[d.chain.id] = d.chain;
        }
      }
    }

    return Object.values(byId);
  }, [superbridgeTestnets]);

  return (
    <Dialog
      open={!!networkSelectorModal}
      onOpenChange={() => setNetworkSelectorModal(null)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose network</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col">
          {chains.map((chain) => (
            <div
              key={`chain-${chain.id}`}
              onClick={() => onSelect(chain)}
              className="flex items-center gap-2 px-6 py-4 bg-transparent transition-all hover:bg-muted cursor-pointer"
            >
              <NetworkIcon chain={chain} width={32} height={32} />
              <span className="text-base leading-none">{chain.name}</span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
