import clsx from "clsx";

import {
  RouteProvider,
  RouteQuoteDto,
  RouteStepTransactionDto,
} from "@/codegen/model";
import { useBridgeGasEstimateForRoute } from "@/hooks/bridge/use-bridge-gas-estimate";
import { useFeesForRoute } from "@/hooks/fees/use-fees";
import { useNetworkFeeForGasLimit } from "@/hooks/gas/use-network-fee";
import {
  useDestinationToken,
  useSelectedToken,
} from "@/hooks/tokens/use-token";
import { useToChain } from "@/hooks/use-chain";
import { useGetFormattedAmount } from "@/hooks/use-get-formatted-amount";
import { useModal } from "@/hooks/use-modal";
import { useApproxTotalBridgeTimeTextForRoute } from "@/hooks/use-transfer-time";
import { isRouteTransactionStep } from "@/utils/guards";

import {
  IconCaretDown,
  IconSimpleFees,
  IconSimpleGas,
  IconTime,
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
  const getFormattedAmount = useGetFormattedAmount(token);
  const feeBreakdownModal = useModal("FeeBreakdown");
  const gasInfoModal = useModal("GasInfo");

  const receive = getFormattedAmount(quote.receive);

  const gasEstimate = useBridgeGasEstimateForRoute({
    id: provider,
    result: quote,
  });

  const networkFee = useNetworkFeeForGasLimit(
    parseInt((quote.steps[0] as RouteStepTransactionDto).chainId),
    gasEstimate.data
  );
  console.log({
    gasEstimate: gasEstimate.isFetching,
    networkFee: networkFee.isLoading,
  });

  const route = {
    isLoading: false,
    data: { id: provider, result: quote },
  };
  const fees = useFeesForRoute(route);
  const time = useApproxTotalBridgeTimeTextForRoute(route);

  const transactionStepCount = quote.steps.filter((x) =>
    isRouteTransactionStep(x)
  ).length;

  const allowFeeClicks = allowDetailClicks && fees.data?.totals.token !== 0;

  return (
    <div className="flex flex-col gap-2">
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
                provider={route.data.id}
                fromChainId={selectedToken?.chainId ?? 0}
                toChainId={token?.chainId ?? 0}
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
                provider={route.data.id}
                fromChainId={selectedToken?.chainId ?? 0}
                toChainId={token?.chainId ?? 0}
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

      <div className="flex gap-3 justify-start mt-4">
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
              "h-3.5 w-3.5"
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
        <div
          className={clsx(
            "flex gap-1 items-center",
            allowDetailClicks && "cursor-pointer group"
          )}
          onClick={() => (allowDetailClicks ? gasInfoModal.open() : null)}
        >
          <IconSimpleGas className="h-3.5 w-3.5 fill-muted-foreground group-hover:fill-foreground" />{" "}
          {networkFee.data?.token.formatted ? (
            <span className="text-xs leading-none text-muted-foreground group-hover:text-foreground">
              {networkFee.data?.token.formatted}
            </span>
          ) : (
            <Skeleton className="h-3 w-[60px]" />
          )}
          {transactionStepCount > 1 && (
            <span className="rounded-full text-[10px] leading-none bg-primary text-primary-foreground py-1 px-1.5">
              +{transactionStepCount - 1}
            </span>
          )}
        </div>
        <div className="flex gap-1 items-center ml-auto">
          <span className="text-xs text-right leading-none text-muted-foreground">
            {time.data}
          </span>
          <IconTime className="h-3.5 w-3.5 fill-muted-foreground" />{" "}
        </div>
      </div>
    </div>
  );
};
