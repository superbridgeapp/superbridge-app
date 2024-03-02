import { useEstimateGas, useSendTransaction } from "wagmi";

import { useTransactionArgs } from "./use-transaction-args";

export const useBridge = () => {
  const bridgeArgs = useTransactionArgs();
  const { sendTransactionAsync } = useSendTransaction();
  let { data: gas, refetch } = useEstimateGas(bridgeArgs?.tx);

  if (gas) {
    gas = gas + gas / BigInt("10");
  }

  return {
    write: () => {
      if (!bridgeArgs?.tx) return;
      return sendTransactionAsync({ ...bridgeArgs.tx, gas });
    },
    address: bridgeArgs?.approvalAddress,
    refetch,
    valid: !!bridgeArgs,
  };
};
