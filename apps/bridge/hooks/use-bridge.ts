import {
  useEstimateFeesPerGas,
  useEstimateGas,
  useSendTransaction,
} from "wagmi";

import { useConfigState } from "@/state/config";

import { useFromChain, useToChain } from "./use-chain";
import { useDeployment } from "./use-deployment";
import { useTransactionArgs } from "./use-transaction-args";

export const useBridge = () => {
  const withdrawing = useConfigState.useWithdrawing();
  const escapeHatch = useConfigState.useForceViaL1();

  const bridgeArgs = useTransactionArgs();
  const { sendTransactionAsync, isLoading } = useSendTransaction();
  const deployment = useDeployment();

  const from = useFromChain();
  const to = useToChain();
  const chainId = withdrawing && escapeHatch ? deployment?.l1.id : from?.id;

  const fromFeeData = useEstimateFeesPerGas({ chainId });
  let { data: gas, refetch } = useEstimateGas({
    ...bridgeArgs?.tx,
    gasPrice: fromFeeData.data?.gasPrice,
    maxFeePerGas: fromFeeData.data?.maxFeePerGas,
    maxPriorityFeePerGas: fromFeeData.data?.maxPriorityFeePerGas,
  });

  if (gas) {
    gas = gas + gas / BigInt("75");
    if (gas < BigInt(300_000)) {
      gas = BigInt(300_000);
    }

    if (to?.id === 1301 && gas < BigInt(1_600_000)) {
      gas = BigInt(1_600_000);
    }
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
