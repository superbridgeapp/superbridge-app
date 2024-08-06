import { Address, Hex } from "viem";
import {
  useEstimateFeesPerGas,
  useEstimateGas,
  useSendTransaction,
} from "wagmi";

import { isRouteQuote } from "@/utils/guards";

import { useSelectedBridgeRoute } from "../routes/use-selected-bridge-route";
import { useInitiatingChainId } from "../use-initiating-chain-id";

export const useBridge = () => {
  const initiatingChainId = useInitiatingChainId();

  const selectedRoute = useSelectedBridgeRoute();
  const { sendTransactionAsync, isLoading } = useSendTransaction();

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
    maxFeePerGas: fromFeeData.data?.maxFeePerGas,
    maxPriorityFeePerGas: fromFeeData.data?.maxPriorityFeePerGas,
  };

  if (tx) {
    params.data = tx.data as Hex;
    params.to = tx.to as Address;
    params.chainId = parseInt(tx.chainId);
    params.value = BigInt(tx.value);
  }

  let { data: gas, refetch } = useEstimateGas(params);

  if (gas) {
    params.gas = gas + gas / BigInt("10");
  }

  return {
    write: !params.gas ? undefined : () => sendTransactionAsync(params),
    isLoading,
    refetch,
    valid: !!tx && !!params.gas,
    gas,
  };
};
