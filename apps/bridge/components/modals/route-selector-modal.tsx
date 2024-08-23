import { useBridgeRoutes } from "@/hooks/routes/use-bridge-routes";
import { useModal } from "@/hooks/use-modal";
import { useConfigState } from "@/state/config";
import { isRouteQuoteError } from "@/utils/guards";

import { Route } from "../route-preview/route";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

export const RouteSelectorModal = () => {
  const routes = useBridgeRoutes();
  const modal = useModal("RouteSelector");
  const setRouteId = useConfigState.useSetRouteId();

  const onSelect = (id: string) => {
    setRouteId(id);
    modal.close();
  };

  return (
    <Dialog open={modal.isOpen} onOpenChange={modal.close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose route</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col px-4 pb-6 gap-3">
          {routes.data?.results.map((route) => {
            if (isRouteQuoteError(route.result)) {
              return null;
            }
            return (
              <div
                key={route.id}
                onClick={() => onSelect(route.id)}
                className="p-4 border border-muted rounded-xl hover:scale-[1.015] transition-all cursor-pointer"
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
