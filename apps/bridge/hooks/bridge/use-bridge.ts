import { Address, Hex } from "viem";
import { useSendTransaction } from "wagmi";

import { isRouteQuote } from "@/utils/guards";

import { useEstimateFeesPerGas } from "../gas/use-estimate-fees-per-gas";
import { useSelectedBridgeRoute } from "../routes/use-selected-bridge-route";
import { useFromChain } from "../use-chain";
import { useBridgeGasEstimateForRoute } from "./use-bridge-gas-estimate";

export const useBridge = () => {
  const selectedRoute = useSelectedBridgeRoute();
  const { sendTransactionAsync, isPending } = useSendTransaction();
  const gasPriceParams = useEstimateFeesPerGas(useFromChain()?.id);

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
