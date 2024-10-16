import { Address, Hex } from "viem";
import { scroll } from "viem/chains";
import { useEstimateFeesPerGas, useSendTransaction } from "wagmi";

import { isRouteQuote } from "@/utils/guards";

import { useSelectedBridgeRoute } from "../routes/use-selected-bridge-route";
import { useFromChain, useToChain } from "../use-chain";
import { useInitiatingChainId } from "../use-initiating-chain-id";
import { useBridgeGasEstimateForRoute } from "./use-bridge-gas-estimate";

export const useBridge = () => {
  const initiatingChainId = useInitiatingChainId();
  const from = useFromChain();
  const to = useToChain();

  const selectedRoute = useSelectedBridgeRoute();
  const { sendTransactionAsync, isPending } = useSendTransaction();

  const fromFeeData = useEstimateFeesPerGas({
    chainId: initiatingChainId || undefined,
  });

  const route = isRouteQuote(selectedRoute?.data?.result)
    ? selectedRoute.data.result
    : undefined;
  const tx = route?.initiatingTransaction;

  const params: (
    | {
        gasPrice: bigint | undefined;
      }
    | {
        maxFeePerGas: bigint | undefined;
        maxPriorityFeePerGas: bigint | undefined;
      }
  ) & {
    data?: Hex;
    to?: Hex;
    chainId?: number;
    gas?: bigint;
    value?: bigint;
  } = {
    gasPrice: fromFeeData.data?.gasPrice,
    maxFeePerGas:
      from?.id === scroll.id && fromFeeData.data?.maxFeePerGas
        ? fromFeeData.data.maxFeePerGas * BigInt(10)
        : fromFeeData.data?.maxFeePerGas,
    maxPriorityFeePerGas: fromFeeData.data?.maxPriorityFeePerGas,
  };
  const estimate = useBridgeGasEstimateForRoute(selectedRoute.data);

  console.log(estimate);

  if (tx && estimate) {
    params.data = tx.data as Hex;
    params.to = tx.to as Address;
    params.chainId = parseInt(tx.chainId);
    params.value = BigInt(tx.value);
    params.gas = BigInt(estimate);
  }

  return {
    write: !params.gas ? undefined : () => sendTransactionAsync(params),
    isLoading: isPending,
    valid: !!tx && !!params.gas,
    gas: estimate,
  };
};
