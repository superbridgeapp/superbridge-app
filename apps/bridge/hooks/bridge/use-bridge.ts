import { Address, Hex, parseUnits } from "viem";
import { berachainTestnetbArtio, scroll } from "viem/chains";
import { useSendTransaction } from "wagmi";

import { isRouteQuote } from "@/utils/guards";

import { useEstimateFeesPerGas } from "../gas/use-estimate-fees-per-gas";
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

  const fromFeeData = useEstimateFeesPerGas(initiatingChainId);

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
    maxFeePerGas: (() => {
      if (!fromFeeData.data?.maxFeePerGas || !from || !to) return undefined;

      if (from.id === scroll.id)
        return fromFeeData.data.maxFeePerGas * BigInt(10);

      if (
        from.id === berachainTestnetbArtio.id &&
        to.id === 50333 /* pretzel */
      )
        return fromFeeData.data.maxFeePerGas < parseUnits("0.2", 9)
          ? parseUnits("0.2", 9)
          : fromFeeData.data.maxFeePerGas;

      return fromFeeData.data.maxFeePerGas;
    })(),
    maxPriorityFeePerGas: (() => {
      if (!fromFeeData.data?.maxPriorityFeePerGas || !from || !to)
        return undefined;

      if (
        from.id === berachainTestnetbArtio.id &&
        to.id === 50333 /* pretzel */
      )
        return fromFeeData.data.maxPriorityFeePerGas < parseUnits("0.2", 9)
          ? parseUnits("0.2", 9)
          : fromFeeData.data.maxPriorityFeePerGas;

      return fromFeeData.data.maxPriorityFeePerGas;
    })(),
  };
  const estimate = useBridgeGasEstimateForRoute(selectedRoute.data);

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
