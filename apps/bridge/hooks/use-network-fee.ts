import { formatUnits } from "viem";
import { useEstimateFeesPerGas } from "wagmi";

import { RouteStepTransactionDto } from "@/codegen/model";
import { currencySymbolMap } from "@/constants/currency-symbol-map";
import { useTokenPrice } from "@/hooks/use-prices";
import { useSettingsState } from "@/state/settings";
import { formatDecimals } from "@/utils/format-decimals";
import { isRouteQuote, isRouteQuoteError } from "@/utils/guards";

import { useBridge } from "./bridge/use-bridge";
import { useChain } from "./use-chain";
import { useInitiatingChainId } from "./use-initiating-chain-id";
import { useNativeToken } from "./use-native-token";
import { useSelectedBridgeRoute } from "./use-selected-bridge-route";

export const useNetworkFee = () => {
  const route = useSelectedBridgeRoute();
  const initiatingChainId = useInitiatingChainId();
  const chain = useChain(initiatingChainId);
  const currency = useSettingsState.useCurrency();
  const nativeToken = useNativeToken();
  const nativeTokenUsdPrice = useTokenPrice(nativeToken ?? null);
  const { gas } = useBridge();

  const feeData = useEstimateFeesPerGas({
    chainId: isRouteQuote(route.data?.result)
      ? parseInt(
          (route.data.result.steps[0] as RouteStepTransactionDto).chainId
        )
      : undefined,
  });

  if (route.isLoading || feeData.isFetching) {
    return {
      isLoading: true,
      data: null,
    };
  }

  if (
    !route.data?.result ||
    isRouteQuoteError(route.data?.result) ||
    !feeData.data
  ) {
    return {
      isLoading: false,
      data: null,
    };
  }

  const gasLimit =
    gas ??
    (route.data.result.steps[0] as RouteStepTransactionDto).estimatedGasLimit;

  const gwei = parseFloat(
    formatUnits(
      (feeData.data.gasPrice ?? feeData.data.maxFeePerGas)! * BigInt(gasLimit),
      18
    )
  );

  return {
    isLoading: false,
    data: {
      fiat: nativeTokenUsdPrice
        ? {
            raw: gwei * nativeTokenUsdPrice,
            formatted: nativeTokenUsdPrice
              ? `${currencySymbolMap[currency]}${(
                  gwei * nativeTokenUsdPrice
                ).toLocaleString("en", {
                  maximumFractionDigits: 4,
                })}`
              : undefined,
          }
        : null,
      token: {
        raw: gwei,
        formatted: `${formatDecimals(gwei)} ${nativeToken?.[chain?.id ?? 0]
          ?.symbol}`,
      },
    },
  };
};
