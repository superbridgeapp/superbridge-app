import { ChainDto } from "@/codegen/model";
import { usePossibleFromChains } from "@/hooks/network-selector/use-possible-from-chains";
import { useGetPossibleToChains } from "@/hooks/network-selector/use-possible-to-chains";
import { useFromChain, useToChain } from "@/hooks/use-chain";
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
  const setFromChainId = useInjectedStore((s) => s.setFromChainId);
  const toChainId = useInjectedStore((s) => s.toChainId);
  const setToChainId = useInjectedStore((s) => s.setToChainId);

  const possibleFrom = usePossibleFromChains();
  const getPossibleTo = useGetPossibleToChains();

  const availableChains =
    networkSelectorModal === "from" ? possibleFrom : getPossibleTo(from);

  const onSelect = (chain: ChainDto) => {
    if (networkSelectorModal === "from") {
      trackEvent({ event: "from-chain-select", name: chain.name });

      setFromChainId(chain.id);

      // invert
      if (chain.id === to?.id) {
        trackEvent({ event: "to-chain-select", name: from!.name });
        setToChainId(from!.id);
        return;
      }

      // handle case where no routes to toChain
      const nextToChains = getPossibleTo(chain);
      if (!nextToChains.find((x) => x.id === toChainId)) {
        const nextTo = nextToChains.find((x) => x.id !== chain.id);
        if (nextTo) {
          trackEvent({ event: "to-chain-select", name: nextTo.name });
          setToChainId(nextTo.id);
        }
      }
    }

    if (networkSelectorModal === "to") {
      trackEvent({ event: "to-chain-select", name: chain.name });

      setToChainId(chain.id);

      // invert
      if (chain.id === from?.id) {
        trackEvent({ event: "from-chain-select", name: to!.name });
        setFromChainId(to!.id);
      }
    }

    setNetworkSelectorModal(null);
  };

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
          {availableChains.map((chain) => (
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
