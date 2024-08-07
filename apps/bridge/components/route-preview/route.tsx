import clsx from "clsx";

import {
  RouteProvider,
  RouteQuoteDto,
  RouteStepTransactionDto,
} from "@/codegen/model";
import {
  useDestinationToken,
  useSelectedToken,
} from "@/hooks/tokens/use-token";
import { useToChain } from "@/hooks/use-chain";
import { useFeesForRoute } from "@/hooks/use-fees";
import { useGetFormattedAmount } from "@/hooks/use-get-formatted-amount";
import { useNetworkFeeForGasLimit } from "@/hooks/use-network-fee";
import { useApproxTotalBridgeTimeTextForRoute } from "@/hooks/use-transfer-time";

import { IconSimpleFees, IconSimpleGas, IconSimpleTime } from "../icons";
import { NetworkIcon } from "../network-icon";
import { RouteProviderIcon, RouteProviderName } from "../route-provider-icon";
import { TokenIcon } from "../token-icon";
import { Skeleton } from "../ui/skeleton";

export const Route = ({
  provider,
  quote,
}: {
  provider: RouteProvider;
  quote: RouteQuoteDto;
}) => {
  const selectedToken = useSelectedToken();
  const token = useDestinationToken();
  const to = useToChain();
  const getFormattedAmount = useGetFormattedAmount(selectedToken);

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
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center gap-1">
        <h3 className="text-xs font-heading">Get on {to?.name} </h3>
        <div className="flex gap-1 items-center">
          <span className="text-foreground text-xs font-body">
            Via <RouteProviderName provider={provider} />
          </span>
          <RouteProviderIcon
            provider={provider}
            className="rounded-full bg-muted"
          />
          {/* <IconCaretDown className="w-3 w-3 fill-foreground" /> */}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <TokenIcon token={token} className="h-8 w-8" />
          <NetworkIcon
            chain={to}
            className="w-3.5 w-3.5 absolute bottom-0 -right-1"
          />
        </div>
        <div className="flex flex-col gap-0">
          <span className="text-xl leading-none">
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
        <div
          className={clsx(
            fees.data?.totals.token === 0
              ? "bg-primary rounded-full py-0.5 pl-0.5 pr-1.5"
              : "bg-transparent",
            "flex gap-1 items-center"
          )}
        >
          <IconSimpleFees
            className={clsx(
              fees.data?.totals.token === 0
                ? "fill-primary-foreground"
                : "fill-muted-foreground",
              "h-3 w-auto"
            )}
          />
          {fees.data?.totals.token === 0 ? (
            <span className="text-xs leading-none text-primary-foreground">
              0 fees
            </span>
          ) : (
            <span className="text-xs leading-none text-muted-foreground">
              {fees.data?.totals.fiatFormatted ??
                fees.data?.totals.tokenFormatted}{" "}
              Fee
            </span>
          )}
        </div>

        <div className="flex gap-1 items-center">
          <IconSimpleGas className="h-3 w-auto fill-muted-foreground" />{" "}
          {networkFee.isLoading ? (
            <Skeleton className="h-3 w-[60px]" />
          ) : (
            <>
              {!networkFee.data?.fiat && (
                <span className="text-xs leading-none text-muted-foreground">
                  {networkFee.data?.token.formatted}
                </span>
              )}
              {networkFee.data?.fiat && (
                <span className="text-xs leading-none text-muted-foreground">
                  {networkFee.data.fiat.formatted}
                </span>
              )}
            </>
          )}
        </div>

        <div className="flex gap-1 items-center">
          <IconSimpleTime className="h-3 w-auto fill-muted-foreground" />{" "}
          <span className="text-xs leading-none text-muted-foreground">
            {time.data}
          </span>
        </div>
      </div>
    </div>
  );
};
