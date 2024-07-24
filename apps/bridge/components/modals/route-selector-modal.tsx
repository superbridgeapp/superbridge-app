import { formatUnits } from "viem";

import { RouteProvider, RouteQuoteDto } from "@/codegen/model";
import { currencySymbolMap } from "@/constants/currency-symbol-map";
import { ModalNames } from "@/constants/modal-names";
import { useBridgeRoutes } from "@/hooks/use-bridge-routes";
import { useTokenPrice } from "@/hooks/use-prices";
import { useDestinationToken } from "@/hooks/use-selected-token";
import { useConfigState } from "@/state/config";
import { useSettingsState } from "@/state/settings";
import { isRouteQuoteError } from "@/utils/guards";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

const useFormattedAmount = (
  raw: string | undefined,
  chainId: number | undefined
) => {
  const stateToken = useConfigState.useToken();
  const currency = useSettingsState.useCurrency();
  const usdPrice = useTokenPrice(stateToken);

  const amount = parseFloat(
    formatUnits(BigInt(raw ?? "0"), stateToken?.[chainId ?? 0]?.decimals ?? 18)
  );

  const fiat = usdPrice ? amount * usdPrice : null;
  const fiatFormatted = fiat
    ? `${currencySymbolMap[currency]}${fiat.toLocaleString("en")}`
    : null;

  const tokenFormatted = `${amount.toLocaleString("en", {
    maximumFractionDigits: 4,
  })} ${stateToken?.[chainId ?? 0]?.symbol}`;

  return {
    fiat: fiat ? { formatted: fiatFormatted, amount: fiat } : null,
    token: { formatted: tokenFormatted, amount },
  };
};

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

  const amount = useFormattedAmount(quote.receive, token?.chainId);
  return (
    <div
      onClick={onSelect}
      className="flex flex-col p-4 hover:bg-zinc-50 transition"
    >
      <div>Route: {provider}</div>
      <div>
        Receive: {amount.token.formatted}{" "}
        {amount.fiat && <span>({amount.fiat.formatted})</span>}
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
