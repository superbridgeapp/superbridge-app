import { ModalNames } from "@/constants/modal-names";
import { useBridgeRoutes } from "@/hooks/use-bridge-routes";
import { useFromChain, useToChain } from "@/hooks/use-chain";
import { useConfigState } from "@/state/config";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

export const RouteSelectorModal = () => {
  const to = useToChain();
  const from = useFromChain();

  const routes = useBridgeRoutes();
  const open = useConfigState.useModals().RouteSelector === true;
  const removeModal = useConfigState.useRemoveModal();
  const setRouteIndex = useConfigState.useSetRouteIndex();

  const onSelect = (index: number) => {
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

    setRouteIndex(index);
    removeModal(ModalNames.RouteSelector);
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
          {routes?.map((route, index) => (
            <div
              key={route.id}
              onClick={() => onSelect(index)}
              className="flex flex-col p-4 hover:bg-zinc-50 transition"
            >
              <div>Route: {route.id}</div>
              <div>Receive: {route.receive}</div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
