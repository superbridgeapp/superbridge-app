import { Address, Hex } from "viem";
import {
  Config,
  useEstimateFeesPerGas,
  useEstimateGas,
  useSendTransaction,
} from "wagmi";
import { SendTransactionVariables } from "wagmi/query";

import { useConfigState } from "@/state/config";
import { isRouteQuote } from "@/utils/guards";

import { useInitiatingChainId } from "../use-initiating-chain-id";
import { useSelectedBridgeRoute } from "../use-selected-bridge-route";

export const useBridge = () => {
  const initiatingChainId = useInitiatingChainId();
  const escapeHatch = useConfigState.useForceViaL1();

  const selectedRoute = useSelectedBridgeRoute();
  const { sendTransactionAsync, isLoading } = useSendTransaction();

  const fromFeeData = useEstimateFeesPerGas({
    chainId: initiatingChainId || undefined,
  });

  const route = isRouteQuote(selectedRoute?.data?.result)
    ? selectedRoute.data.result
    : undefined;
  const tx = route?.initiatingTransaction;

  const params: Partial<SendTransactionVariables<Config, number>> = {
    gasPrice: fromFeeData.data?.gasPrice,
    maxFeePerGas: fromFeeData.data?.maxFeePerGas,
    maxPriorityFeePerGas: fromFeeData.data?.maxPriorityFeePerGas,
  };

  if (tx) {
    params.data = tx.data as Hex;
    params.to = tx.to as Address;
    params.chainId = parseInt(tx.chainId);
  }

  // @ts-expect-error
  let { data: gas, refetch, error } = useEstimateGas(params);

  if (gas) {
    params.gas = gas + gas / BigInt("10");
  }

  console.log(params, error, gas);

  return {
    write: !params.gas ? undefined : () => sendTransactionAsync(params),
    isLoading,
    address: route?.tokenApprovalAddress,
    refetch,
    valid: !!tx && !!params.gas,
    gas,
  };
};
