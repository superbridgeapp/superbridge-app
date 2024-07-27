import { ModalNames } from "@/constants/modal-names";
import { useBridgeRoutes } from "@/hooks/use-bridge-routes";
import { useConfigState } from "@/state/config";
import { isRouteQuoteError } from "@/utils/guards";

import { Route } from "../route-preview/route";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

export const RouteSelectorModal = () => {
  const routes = useBridgeRoutes();
  const open = useConfigState.useModals().RouteSelector === true;
  const removeModal = useConfigState.useRemoveModal();
  const setRouteId = useConfigState.useSetRouteId();

  const onSelect = (id: string) => {
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
                className="hover:bg-zinc-50 transition"
                onClick={() => onSelect(route.id)}
              >
                <Route
                  key={route.id}
                  provider={route.id}
                  quote={route.result}
                />
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
