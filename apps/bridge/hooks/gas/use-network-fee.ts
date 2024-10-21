import { useEffect, useState } from "react";
import { FeeValuesType } from "viem";

import { RouteStepTransactionDto } from "@/codegen/model";
import { isRouteQuote } from "@/utils/guards";

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
  const [type, setType] = useState<FeeValuesType>("eip1559");
  const nativeToken = useNativeTokenForChainId(chainId);
  const getFormattedAmount = useGetFormattedAmount(nativeToken);
  const feeData = useEstimateFeesPerGas(chainId, type, !!gasLimit);

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

  const gwei =
    (feeData.data.gasPrice ?? feeData.data.maxFeePerGas ?? BigInt(0)) *
    BigInt(gasLimit);

  return {
    isLoading: false,
    data: getFormattedAmount(gwei.toString()),
  };
};
