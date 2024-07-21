import { ModalNames } from "@/constants/modal-names";
import { useBridgeRoutes } from "@/hooks/use-bridge-routes";
import { useFromChain, useToChain } from "@/hooks/use-chain";
import { useConfigState } from "@/state/config";
import { isRouteQuoteError } from "@/utils/guards";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

export const RouteSelectorModal = () => {
  const to = useToChain();
  const from = useFromChain();

  const routes = useBridgeRoutes();
  const open = useConfigState.useModals().RouteSelector === true;
  const removeModal = useConfigState.useRemoveModal();
  const setRouteId = useConfigState.useSetRouteId();

  const onSelect = (id: string) => {
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

    setRouteId(id);
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
          {routes.data?.map((route) => {
            if (isRouteQuoteError(route.result)) {
              return null;
            }
            return (
              <div
                key={route.id}
                onClick={() => onSelect(route.id)}
                className="flex flex-col p-4 hover:bg-zinc-50 transition"
              >
                <div>Route: {route.id}</div>
                <div>Receive: {route.result.receive}</div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
