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

import { NetworkIcon } from "../network-icon";
import { RouteProviderIcon } from "../route-provider-icon";
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
    <div className="flex flex-col p-4">
      <div className="flex items-center gap-2">
        <span>Route:</span>
        <RouteProviderIcon provider={provider} />
      </div>

      <div className="flex items-center gap-2">
        <span>Token:</span>
        <span>{token?.symbol}</span>
        <TokenIcon token={token} className="h-6 w-6" />
      </div>

      <div className="flex items-center gap-2">
        <span>From:</span>
        <span>{from?.name}</span>
        <NetworkIcon chain={from} className="w-6 w-6" />
      </div>

      <div className="flex items-center gap-2">
        <span>To:</span>
        <span>{to?.name}</span>
        <NetworkIcon chain={to} className="w-6 w-6" />
      </div>

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
