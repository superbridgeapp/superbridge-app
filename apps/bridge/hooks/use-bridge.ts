import { useEstimateGas, useSendTransaction } from "wagmi";

import { useTransactionArgs } from "./use-transaction-args";

export const useBridge = () => {
  const bridgeArgs = useTransactionArgs();
  const { sendTransactionAsync, isLoading } = useSendTransaction();
  let { data: gas, refetch } = useEstimateGas(bridgeArgs?.tx);

  if (gas) {
    gas = gas + gas / BigInt("10");
  }

  return {
    write: !bridgeArgs?.tx
      ? undefined
      : () => sendTransactionAsync({ ...bridgeArgs.tx, gas }),
    isLoading,
    address: bridgeArgs?.approvalAddress,
    refetch,
    valid: !!bridgeArgs,
  };
};
