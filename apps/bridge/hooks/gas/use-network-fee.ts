import { RouteStepTransactionDto } from "@/codegen/model";
import { isRouteQuote } from "@/utils/guards";
import { scaleToNativeTokenDecimals } from "@/utils/native-token-scaling";

import { useBridgeGasEstimateForRoute } from "../bridge/use-bridge-gas-estimate";
import { useSelectedBridgeRoute } from "../routes/use-selected-bridge-route";
import { useNativeTokenForChainId } from "../tokens/use-native-token";
import { useGetFormattedAmount } from "../use-get-formatted-amount";
import { useEstimateFeesPerGas } from "./use-estimate-fees-per-gas";

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
  const nativeToken = useNativeTokenForChainId(chainId);
  const getFormattedAmount = useGetFormattedAmount(nativeToken);
  const feeData = useEstimateFeesPerGas(chainId, !!gasLimit);

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

  const fee = feeData.data.maxFeePerGas
    ? feeData.data.maxFeePerGas + feeData.data.maxPriorityFeePerGas
    : (feeData.data.gasPrice ?? BigInt(0));
  const gwei = fee * BigInt(gasLimit);

  return {
    isLoading: false,
    data: getFormattedAmount(
      scaleToNativeTokenDecimals({
        amount: gwei,
        decimals: nativeToken?.decimals ?? 18,
      }).toString()
    ),
  };
};
