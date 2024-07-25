import { RouteProvider, RouteQuoteDto } from "@/codegen/model";
import { ModalNames } from "@/constants/modal-names";
import { useBridgeRoutes } from "@/hooks/use-bridge-routes";
import { useToChain } from "@/hooks/use-chain";
import { useGetFormattedAmount } from "@/hooks/use-get-formatted-amount";
import { useDestinationToken } from "@/hooks/use-selected-token";
import { useConfigState } from "@/state/config";
import { isRouteQuoteError } from "@/utils/guards";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

const Route = ({
  provider,
  quote,
  onSelect,
}: {
  provider: RouteProvider;
  quote: RouteQuoteDto;
  onSelect: () => void;
}) => {
  const token = useDestinationToken();
  const stateToken = useConfigState.useToken();
  const to = useToChain();
  const getFormattedAmount = useGetFormattedAmount(stateToken, to?.id);

  const receive = getFormattedAmount(quote.receive);
  return (
    <div
      onClick={onSelect}
      className="flex flex-col p-4 hover:bg-zinc-50 transition"
    >
      <div>Route: {provider}</div>
      <div>
        Receive: {receive.token.formatted}{" "}
        {receive.fiat && <span>({receive.fiat.formatted})</span>}
      </div>
    </div>
  );
};

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
              <Route
                key={route.id}
                provider={route.id}
                quote={route.result}
                onSelect={() => onSelect(route.id)}
              />
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
