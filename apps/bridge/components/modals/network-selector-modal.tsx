import { AcrossDomainDto } from "@/codegen/model";
import { useAcrossDomains } from "@/hooks/across/use-across-domains";
import { useFromChain, useToChain } from "@/hooks/use-chain";
import { trackEvent } from "@/services/ga";
import { useConfigState } from "@/state/config";

import { NetworkIcon } from "../network-icon";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

export const NetworkSelectorModal = () => {
  const to = useToChain();
  const from = useFromChain();

  const networkSelectorModal = useConfigState.useNetworkSelectorModal();
  const setNetworkSelectorModal = useConfigState.useSetNetworkSelectorModal();
  const setFromChainId = useConfigState.useSetFromChainId();
  const setToChainId = useConfigState.useSetToChainId();

  const acrossDomains = useAcrossDomains();

  const onSelect = (d: AcrossDomainDto) => {
    if (networkSelectorModal === "from") {
      setFromChainId(d.chain.id);
      if (d.chain.id === to?.id) {
        trackEvent({ event: "to-chain-select", name: from!.name });
        setToChainId(from!.id);
      }

      trackEvent({ event: "from-chain-select", name: d.chain.name });
    }

    if (networkSelectorModal === "to") {
      setToChainId(d.chain.id);
      if (d.chain.id === from?.id) {
        trackEvent({ event: "from-chain-select", name: to!.name });
        setFromChainId(to!.id);
      }

      trackEvent({ event: "to-chain-select", name: d.chain.name });
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
          {acrossDomains.map((domain) => (
            <div
              key={domain.id}
              onClick={() => onSelect(domain)}
              className="flex items-center gap-2 px-6 py-4 bg-transparent transition-all hover:bg-muted cursor-pointer"
            >
              <NetworkIcon chain={domain.chain} width={32} height={32} />
              <span className="text-base leading-none">
                {domain.chain.name}
              </span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
