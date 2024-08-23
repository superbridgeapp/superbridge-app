import clsx from "clsx";

import {
  RouteProvider,
  RouteQuoteDto,
  RouteStepTransactionDto,
} from "@/codegen/model";
import { useBridge } from "@/hooks/bridge/use-bridge";
import { useSelectedBridgeRoute } from "@/hooks/routes/use-selected-bridge-route";
import {
  useDestinationToken,
  useSelectedToken,
} from "@/hooks/tokens/use-token";
import { useToChain } from "@/hooks/use-chain";
import { useFeesForRoute } from "@/hooks/use-fees";
import { useGetFormattedAmount } from "@/hooks/use-get-formatted-amount";
import { useModal } from "@/hooks/use-modal";
import { useNetworkFeeForGasLimit } from "@/hooks/use-network-fee";
import { useApproxTotalBridgeTimeTextForRoute } from "@/hooks/use-transfer-time";

import {
  IconCaretDown,
  IconSimpleFees,
  IconSimpleGas,
  IconSimpleTime,
} from "../icons";
import { NetworkIcon } from "../network-icon";
import { RouteProviderIcon, RouteProviderName } from "../route-provider-icon";
import { TokenIcon } from "../token-icon";
import { Skeleton } from "../ui/skeleton";

export const Route = ({
  provider,
  quote,
  onRoutesClick,
  allowDetailClicks,
}: {
  provider: RouteProvider;
  quote: RouteQuoteDto;
  onRoutesClick?: () => void;
  allowDetailClicks?: boolean;
}) => {
  const selectedToken = useSelectedToken();
  const token = useDestinationToken();
  const to = useToChain();
  const getFormattedAmount = useGetFormattedAmount(selectedToken);
  const feeBreakdownModal = useModal("FeeBreakdown");
  const gasInfoModal = useModal("GasInfo");

  const bridge = useBridge();
  const selected = useSelectedBridgeRoute();

  const receive = getFormattedAmount(quote.receive);

  const estimate = BigInt(
    (quote.steps[0] as RouteStepTransactionDto).estimatedGasLimit
  );
  let gasLimit = estimate;
  if (selected.data?.id === provider && bridge.gas) {
    gasLimit = bridge.gas;
  }
  const networkFee = useNetworkFeeForGasLimit(
    parseInt((quote.steps[0] as RouteStepTransactionDto).chainId),
    gasLimit
  );

  const route = {
    isLoading: false,
    data: { id: provider, result: quote },
  };
  const fees = useFeesForRoute(route);
  const time = useApproxTotalBridgeTimeTextForRoute(route);

  const allowFeeClicks = allowDetailClicks && fees.data?.totals.token !== 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center gap-1">
        <h3 className="text-xs font-heading leading-none">
          Get on {to?.name}{" "}
        </h3>
        {allowDetailClicks && onRoutesClick ? (
          <button
            className="flex gap-1.5 items-center rounded-full bg-muted pl-1.5 pr-2.5 py-1.5 hover:scale-105 transition-all"
            onClick={onRoutesClick}
          >
            <div className="flex gap-1 items-center text-foreground text-xs font-body leading-none">
              <RouteProviderIcon
                provider={provider}
                className="rounded-full bg-muted"
              />
              <span>
                <RouteProviderName provider={provider} />
              </span>
            </div>

            <IconCaretDown className="w-4 w-4 fill-foreground" />
          </button>
        ) : (
          <div className="flex gap-1.5 items-center rounded-full bg-muted pl-1.5 pr-2 py-1.5">
            <div className="flex gap-1 items-center text-foreground text-xs font-body leading-none">
              <RouteProviderIcon
                provider={provider}
                className="rounded-full bg-muted"
              />
              <span>
                <RouteProviderName provider={provider} />
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <TokenIcon token={token} className="h-10 w-10" />
          <NetworkIcon
            chain={to}
            className="w-4 w-4 rounded-2xs absolute bottom-0 -right-1"
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-2xl leading-none">
            {receive.token.formatted}
          </span>
          {receive.fiat && (
            <span className="text-xs leading-none text-muted-foreground">
              {receive.fiat.formatted}
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-3 justify-start mt-2">
        <div className="flex gap-1 items-center mr-auto">
          <IconSimpleTime className="h-4 w-4 fill-muted-foreground" />{" "}
          <span className="text-xs leading-none text-muted-foreground">
            {time.data}
          </span>
        </div>

        <div
          className={clsx(
            "flex gap-1 items-center",
            allowDetailClicks && "cursor-pointer group"
          )}
          onClick={() => (allowDetailClicks ? gasInfoModal.open() : null)}
        >
          <IconSimpleGas className="h-4 w-4 fill-muted-foreground group-hover:fill-foreground" />{" "}
          {networkFee.isLoading ? (
            <Skeleton className="h-3 w-[60px]" />
          ) : (
            <>
              {!networkFee.data?.fiat && (
                <span className="text-xs leading-none text-muted-foreground group-hover:text-foreground">
                  {networkFee.data?.token.formatted}
                </span>
              )}
              {networkFee.data?.fiat && (
                <span className="text-xs leading-none text-muted-foreground group-hover:text-foreground">
                  {networkFee.data.fiat.formatted}
                </span>
              )}
            </>
          )}
        </div>

        <div
          className={clsx(
            fees.data?.totals.token === 0
              ? "bg-primary rounded-full py-0.5 pl-0.5 pr-1.5"
              : "bg-transparent",
            "flex gap-1 items-center ",
            allowFeeClicks && "cursor-pointer group"
          )}
          onClick={() => (allowFeeClicks ? feeBreakdownModal.open() : null)}
        >
          <IconSimpleFees
            className={clsx(
              fees.data?.totals.token === 0
                ? "fill-primary-foreground"
                : "fill-muted-foreground group-hover:fill-foreground",
              "h-4 w-4"
            )}
          />
          {fees.data?.totals.token === 0 ? (
            <span className="text-xs leading-none text-primary-foreground">
              0 fees
            </span>
          ) : (
            <span className="text-xs leading-none text-muted-foreground group-hover:text-foreground">
              {fees.data?.totals.fiatFormatted ??
                fees.data?.totals.tokenFormatted}{" "}
              Fee
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
