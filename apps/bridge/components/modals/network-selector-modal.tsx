import { AcrossDomainDto } from "@/codegen/model";
import { useAcrossDomains } from "@/hooks/use-across-domains";
import { useFromChain, useToChain } from "@/hooks/use-chain";
import { useConfigState } from "@/state/config";
import { useFastState } from "@/state/fast";

import { NetworkIcon } from "../network-icon";
import { Dialog, DialogContent } from "../ui/dialog";

export const NetworkSelectorModal = () => {
  const to = useToChain();
  const from = useFromChain();

  const networkSelectorModal = useConfigState.useNetworkSelectorModal();
  const setNetworkSelectorModal = useConfigState.useSetNetworkSelectorModal();

  const setFromChainId = useFastState.useSetFromChainId();
  const setToChainId = useFastState.useSetToChainId();

  const acrossDomains = useAcrossDomains();

  const onSelect = (d: AcrossDomainDto) => {
    if (networkSelectorModal === "from") {
      setFromChainId(d.chain.id);
      if (d.chain.id === to?.id) {
        setToChainId(from!.id);
      }
    }

    if (networkSelectorModal === "to") {
      setToChainId(d.chain.id);
      if (d.chain.id === from?.id) {
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
        <div className="flex flex-col gap-8 p-6">
          {acrossDomains.map((domain) => (
            <div onClick={() => onSelect(domain)}>
              <NetworkIcon chain={domain.chain} deployment={null} />
              <span>{domain.chain.name}</span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
