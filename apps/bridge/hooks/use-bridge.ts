import { usePrepareSendTransaction, useSendTransaction } from "wagmi";

import { useTransactionArgs } from "./use-transaction-args";

export const useBridge = () => {
  const bridgeArgs = useTransactionArgs();

  const { config, refetch } = usePrepareSendTransaction({
    ...bridgeArgs?.tx,
    enabled: !!bridgeArgs,
  });

  if (config.gas) {
    config.gas = config.gas + config.gas / BigInt("10");
  }

  const write = useSendTransaction(config);

  return {
    write,
    address: bridgeArgs?.approvalAddress,
    refetch,
    valid: !!bridgeArgs,
  };
};
