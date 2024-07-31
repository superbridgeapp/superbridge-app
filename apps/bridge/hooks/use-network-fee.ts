import { formatUnits } from "viem";
import { useEstimateFeesPerGas } from "wagmi";

import { RouteStepTransactionDto } from "@/codegen/model";
import { currencySymbolMap } from "@/constants/currency-symbol-map";
import { useTokenPrice } from "@/hooks/use-prices";
import { useSettingsState } from "@/state/settings";
import { formatDecimals } from "@/utils/format-decimals";
import { isRouteQuote } from "@/utils/guards";

import { useBridge } from "./bridge/use-bridge";
import { useChain } from "./use-chain";
import { useInitiatingChainId } from "./use-initiating-chain-id";
import { useNativeToken } from "./use-native-token";
import { useSelectedBridgeRoute } from "./use-selected-bridge-route";

export const useNetworkFee = () => {
  const route = useSelectedBridgeRoute();
  const { gas } = useBridge();

  const chainId = isRouteQuote(route.data?.result)
    ? parseInt((route.data.result.steps[0] as RouteStepTransactionDto).chainId)
    : undefined;

  let gasLimit: bigint | undefined = gas;
  if (!gasLimit) {
    gasLimit =
      route.data?.result && isRouteQuote(route.data.result)
        ? BigInt(
            (route.data.result.steps[0] as RouteStepTransactionDto)
              .estimatedGasLimit
          )
        : undefined;
  }
  return useNetworkFeeForGasLimit(chainId, gasLimit);
};

export const useNetworkFeeForGasLimit = (
  chainId: number | undefined,
  gasLimit: bigint | undefined
) => {
  const initiatingChainId = useInitiatingChainId();
  const chain = useChain(initiatingChainId);
  const currency = useSettingsState.useCurrency();
  const nativeToken = useNativeToken();
  const nativeTokenUsdPrice = useTokenPrice(nativeToken ?? null);

  const feeData = useEstimateFeesPerGas({
    chainId,
    query: {
      enabled: !!gasLimit,
    },
  });

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
      (feeData.data.gasPrice ?? feeData.data.maxFeePerGas)! * gasLimit,
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
