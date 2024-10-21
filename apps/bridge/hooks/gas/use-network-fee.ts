import { useEffect, useState } from "react";
import { FeeValuesType, formatUnits } from "viem";
import { useEstimateFeesPerGas } from "wagmi";

import { RouteStepTransactionDto } from "@/codegen/model";
import { currencySymbolMap } from "@/constants/currency-symbol-map";
import { useTokenPrice } from "@/hooks/use-prices";
import { useSettingsState } from "@/state/settings";
import { formatDecimals } from "@/utils/format-decimals";
import { isRouteQuote } from "@/utils/guards";

import { useBridgeGasEstimateForRoute } from "../bridge/use-bridge-gas-estimate";
import { useSelectedBridgeRoute } from "../routes/use-selected-bridge-route";
import { useNativeTokenForChainId } from "../tokens/use-native-token";

export const useNetworkFee = () => {
  const route = useSelectedBridgeRoute();
  const gasEstimate = useBridgeGasEstimateForRoute(route.data);

  const chainId = isRouteQuote(route.data?.result)
    ? parseInt((route.data.result.steps[0] as RouteStepTransactionDto).chainId)
    : undefined;

  return useNetworkFeeForGasLimit(chainId, gasEstimate.data);
};

export const useNetworkFeeForGasLimit = (
  chainId: number | undefined,
  gasLimit: number | bigint | undefined | null
) => {
  const [type, setType] = useState<FeeValuesType>("eip1559");
  const currency = useSettingsState.useCurrency();
  const nativeToken = useNativeTokenForChainId(chainId);
  const nativeTokenUsdPrice = useTokenPrice(nativeToken ?? null);

  const feeData = useEstimateFeesPerGas({
    chainId,
    type,
    query: {
      enabled: !!gasLimit,
    },
  });

  useEffect(() => {
    if (feeData.failureReason?.message.includes("does not support")) {
      setType("legacy");
    }
  }, [feeData.failureReason]);

  if (feeData.isFetching) {
    return {
      isLoading: true,
      data: null,
    };
  }

  if (!feeData.data || !gasLimit) {
    return {
      isLoading: false,
      data: null,
    };
  }

  const gwei = parseFloat(
    formatUnits(
      (feeData.data.gasPrice ?? feeData.data.maxFeePerGas ?? BigInt(0)) *
        BigInt(gasLimit),
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
        formatted: `${formatDecimals(gwei)} ${nativeToken?.symbol}`,
      },
    },
  };
};
