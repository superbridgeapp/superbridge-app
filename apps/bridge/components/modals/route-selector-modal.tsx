import { AcrossDomainDto } from "@/codegen/model";
import { ModalNames } from "@/constants/modal-names";
import { useBridgeRoutes } from "@/hooks/use-bridge-routes";
import { useFromChain, useToChain } from "@/hooks/use-chain";
import { useConfigState } from "@/state/config";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

export const NetworkSelectorModal = () => {
  const to = useToChain();
  const from = useFromChain();

  const routes = useBridgeRoutes();
  const open = useConfigState.useModals().RouteSelector === true;
  const removeModal = useConfigState.useRemoveModal();
  const setNetworkSelectorModal = useConfigState.useSetNetworkSelectorModal();

  const onSelect = (d: AcrossDomainDto) => {
    // if (networkSelectorModal === "from") {
    //   setFromChainId(d.chain.id);
    //   if (d.chain.id === to?.id) {
    //     trackEvent({ event: "to-chain-select", name: from!.name });
    //     setToChainId(from!.id);
    //   }

    //   trackEvent({ event: "from-chain-select", name: d.chain.name });
    // }

    // if (networkSelectorModal === "to") {
    //   setToChainId(d.chain.id);
    //   if (d.chain.id === from?.id) {
    //     trackEvent({ event: "from-chain-select", name: to!.name });
    //     setFromChainId(to!.id);
    //   }

    //   trackEvent({ event: "to-chain-select", name: d.chain.name });
    // }

    setNetworkSelectorModal(null);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => removeModal(ModalNames.RouteSelector)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose route</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col">
          {routes?.map((route) => (
            <div
              key={route.id}
              // onClick={() => onSelect(domain)}
              className="flex items-center gap-2 px-6 py-4 bg-transparent transition-all hover:bg-muted cursor-pointer"
            >
              {route.id}
              {/* <NetworkIcon
                chain={domain.chain}
                deployment={null}
                width={32}
                height={32}
              /> */}
              {/* <span className="text-base leading-none">
                {domain.chain.name}
              </span> */}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
