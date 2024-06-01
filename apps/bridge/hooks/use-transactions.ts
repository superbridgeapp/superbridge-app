import { useEffect } from "react";
import { useAccount } from "wagmi";

import { useBridgeControllerGetActivity } from "@/codegen";
import { usePendingTransactions } from "@/state/pending-txs";
import {
  isForcedWithdrawal,
  isOptimismForcedWithdrawal,
  isOptimismWithdrawal,
  isWithdrawal,
} from "@/utils/guards";
import { getInitiatingHash } from "@/utils/initiating-tx-hash";

import { useDeployments } from "./use-deployments";

export const useTransactions = () => {
  const account = useAccount();
  const { deployments } = useDeployments();

  const removeFinalising = usePendingTransactions.useRemoveFinalising();
  const removeProving = usePendingTransactions.useRemoveProving();
  const removePending = usePendingTransactions.useRemoveTransactionByHash();

  const response = useBridgeControllerGetActivity(
    account.address ?? "",
    {
      deploymentIds: deployments.map((d) => d.id),
    },
    {
      query: {
        enabled: !!account.address && deployments.length > 0,
        refetchInterval: 10_000,
      },
    }
  );

  useEffect(() => {
    response.data?.data.transactions.forEach((tx) => {
      const hash = getInitiatingHash(tx);
      if (hash) removePending(hash);

      if (isWithdrawal(tx)) {
        if (isOptimismWithdrawal(tx)) if (tx.prove) removeProving(tx.id);
        if (tx.finalise) removeFinalising(tx.id);
      }
      if (isForcedWithdrawal(tx)) {
        if (isOptimismForcedWithdrawal(tx))
          if (tx.withdrawal?.prove) removeProving(tx.id);
        if (tx.withdrawal?.finalise) removeFinalising(tx.id);
      }
    });
  }, [
    response.data?.data.transactions,
    removePending,
    removeProving,
    removeFinalising,
  ]);

  return {
    transactions: response.data?.data.transactions ?? [],
    isLoading: response.isLoading,
    isError: response.isError,
  };
};
