import {
  RouteProvider,
  RouteQuoteDto,
  RouteStepTransactionDto,
} from "@/codegen/model";
import { ModalNames } from "@/constants/modal-names";
import { useBridgeRoutes } from "@/hooks/use-bridge-routes";
import { useToChain } from "@/hooks/use-chain";
import { useFeesForRoute } from "@/hooks/use-fees";
import { useGetFormattedAmount } from "@/hooks/use-get-formatted-amount";
import { useNetworkFeeForGasLimit } from "@/hooks/use-network-fee";
import { useDestinationToken } from "@/hooks/use-selected-token";
import { useApproxTotalBridgeTimeTextForRoute } from "@/hooks/use-transfer-time";
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

  const networkFee = useNetworkFeeForGasLimit(
    parseInt((quote.steps[0] as RouteStepTransactionDto).chainId),
    BigInt((quote.steps[0] as RouteStepTransactionDto).estimatedGasLimit)
  );

  const route = {
    isLoading: false,
    data: { id: provider, result: quote },
  };
  const fees = useFeesForRoute(route);
  const time = useApproxTotalBridgeTimeTextForRoute(route);

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

      <div>
        Network fee: {networkFee.data?.token.formatted}{" "}
        {networkFee.data?.fiat && <span>{networkFee.data.fiat.formatted}</span>}
      </div>

      <div>
        Fees: {fees.data?.totals.tokenFormatted}{" "}
        {fees.data?.totals.fiatFormatted && (
          <span>{fees.data?.totals.fiatFormatted}</span>
        )}
      </div>

      <div>Bridge time: {time.data}</div>
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
