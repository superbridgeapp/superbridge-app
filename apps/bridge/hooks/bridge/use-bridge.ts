import { Address, Hex } from "viem";
import { useSendTransaction } from "wagmi";

import { isRouteQuote } from "@/utils/guards";

import { useGasPrice } from "../gas/use-gas-price";
import { useSelectedBridgeRoute } from "../routes/use-selected-bridge-route";
import { useBridgeGasEstimateForRoute } from "./use-bridge-gas-estimate";

export const useBridge = () => {
  const selectedRoute = useSelectedBridgeRoute();
  const { sendTransactionAsync, isPending } = useSendTransaction();
  const gasPriceParams = useGasPrice();

  const route = isRouteQuote(selectedRoute?.data?.result)
    ? selectedRoute.data.result
    : undefined;
  const tx = route?.initiatingTransaction;

  const estimate = useBridgeGasEstimateForRoute(selectedRoute.data);

  const params: any = {
    ...gasPriceParams,
  };

  if (tx && estimate?.data) {
    params.data = tx.data as Hex;
    params.to = tx.to as Address;
    params.chainId = parseInt(tx.chainId);
    params.value = BigInt(tx.value);
    params.gas = BigInt(estimate.data);
  }

  return {
    write: !params.gas ? undefined : () => sendTransactionAsync(params),
    isLoading: isPending,
    valid: !!tx && !!params.gas,
    gas: estimate,
  };
};
