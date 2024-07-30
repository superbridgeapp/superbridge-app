import {
  RouteProvider,
  RouteQuoteDto,
  RouteStepTransactionDto,
} from "@/codegen/model";
import { useFromChain, useToChain } from "@/hooks/use-chain";
import { useFeesForRoute } from "@/hooks/use-fees";
import { useGetFormattedAmount } from "@/hooks/use-get-formatted-amount";
import { useNetworkFeeForGasLimit } from "@/hooks/use-network-fee";
import { useDestinationToken } from "@/hooks/use-selected-token";
import { useApproxTotalBridgeTimeTextForRoute } from "@/hooks/use-transfer-time";
import { useConfigState } from "@/state/config";

import { IconSimpleFees, IconSimpleGas, IconSimpleTime } from "../icons";
import { NetworkIcon } from "../network-icon";
import { RouteProviderIcon, RouteProviderName } from "../route-provider-icon";
import { TokenIcon } from "../token-icon";

export const Route = ({
  provider,
  quote,
}: {
  provider: RouteProvider;
  quote: RouteQuoteDto;
}) => {
  const token = useDestinationToken();
  const stateToken = useConfigState.useToken();
  const from = useFromChain();
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
    <div className="flex flex-col gap-2 p-4 border rounded-xl">
      <div className="flex items-center gap-1 text-xs font-heading">
        <RouteProviderIcon provider={provider} className="rounded bg-muted" />
        <h3>
          Get on {to?.name}{" "}
          <span className="text-muted-foreground">
            via <RouteProviderName provider={provider} />
          </span>
        </h3>
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
          <span className="text-2xl leading-none">
            {receive.token.formatted}
          </span>
          {receive.fiat && (
            <span className="text-xs leading-none text-muted-foreground">
              ({receive.fiat.formatted})
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-4 justify-end mt-2">
        <div className="flex gap-1 items-center">
          <IconSimpleGas className="h-3 w-auto fill-muted-foreground" />{" "}
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
        </div>

        <div className="flex gap-1 items-center">
          <IconSimpleFees className="h-3 w-auto fill-muted-foreground" />
          {!fees.data?.totals.fiatFormatted && (
            <span className="text-xs leading-none text-muted-foreground">
              {fees.data?.totals.tokenFormatted}
            </span>
          )}
          {fees.data?.totals.fiatFormatted && (
            <span className="text-xs leading-none text-muted-foreground">
              {fees.data?.totals.fiatFormatted}
            </span>
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
