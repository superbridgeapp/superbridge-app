import {
  useEstimateFeesPerGas,
  useEstimateGas,
  useSendTransaction,
} from "wagmi";

import { useConfigState } from "@/state/config";

import { useInitiatingChainId } from "../use-initiating-chain-id";
import { useTransactionArgs } from "../use-transaction-args";

export const useBridge = () => {
  const initiatingChainId = useInitiatingChainId();
  const escapeHatch = useConfigState.useForceViaL1();

  const bridgeArgs = useTransactionArgs();
  const { sendTransactionAsync, isLoading } = useSendTransaction();

  const fromFeeData = useEstimateFeesPerGas({
    chainId: initiatingChainId || undefined,
  });
  let { data: gas, refetch } = useEstimateGas({
    ...bridgeArgs?.tx,
    gasPrice: fromFeeData.data?.gasPrice,
    maxFeePerGas: fromFeeData.data?.maxFeePerGas,
    maxPriorityFeePerGas: fromFeeData.data?.maxPriorityFeePerGas,
  });

  if (gas) {
    gas = gas + gas / BigInt("10");
  }

  return {
    write: !bridgeArgs?.tx
      ? undefined
      : () =>
          sendTransactionAsync({
            ...bridgeArgs.tx,
            gas,
            gasPrice: fromFeeData.data?.gasPrice,
            maxFeePerGas: fromFeeData.data?.maxFeePerGas,
            maxPriorityFeePerGas: fromFeeData.data?.maxPriorityFeePerGas,
          }),
    isLoading,
    address: bridgeArgs?.approvalAddress,
    refetch,
    valid: !!bridgeArgs,
    args: bridgeArgs,
    gas,
  };
};
