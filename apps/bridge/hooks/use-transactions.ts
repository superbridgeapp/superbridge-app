import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAccount } from "wagmi";

import { bridgeControllerGetActivityV2 } from "@/codegen";
import { isSuperbridge } from "@/config/superbridge";
import { usePendingTransactions } from "@/state/pending-txs";
import { Transaction } from "@/types/transaction";
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

  const response = useQuery({
    // @ts-expect-error
    queryKey: [
      "activity",
      account.address as string,
      deployments.map((x) => x.id),
    ],
    queryFn: () => {
      if (!account.address) {
        return [];
      }
      return bridgeControllerGetActivityV2({
        address: account.address,
        includeAcross: isSuperbridge,
        deploymentIds: deployments.map((d) => d.id),
      });
    },
    enabled: !!account.address && deployments.length > 0,
    refetchInterval: 10_000,
  });

  useEffect(() => {
    if (!response.data?.data) {
      return;
    }

    const txs = response.data.data.transactions as Transaction[];
    txs.forEach((tx) => {
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
