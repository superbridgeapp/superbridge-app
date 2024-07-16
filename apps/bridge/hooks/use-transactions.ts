import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAccount } from "wagmi";

import { bridgeControllerGetActivityV3 } from "@/codegen";
import { isSuperbridge } from "@/config/superbridge";
import { useInjectedStore } from "@/state/injected";
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

  const superbridgeTestnetsEnabled = useInjectedStore((s) => s.testnets);
  const removeFinalising = usePendingTransactions.useRemoveFinalising();
  const removeProving = usePendingTransactions.useRemoveProving();
  const removePending = usePendingTransactions.useRemoveTransactionByHash();

  const { data, isLoading, isError, fetchNextPage } = useInfiniteQuery({
    queryKey: [
      "activity",
      account.address as string,
      deployments.map((x) => x.id),
      superbridgeTestnetsEnabled,
    ],
    queryFn: ({ pageParam }) => {
      if (!account.address) {
        return {
          actionRequiredCount: 0,
          inProgressCount: 0,
          total: 0,
          transactions: [],
        };
      }

      return bridgeControllerGetActivityV3({
        address: account.address,
        includeAcross: isSuperbridge && !superbridgeTestnetsEnabled,
        deploymentIds: deployments.map((d) => d.id),
        cursor: pageParam ?? null,
      }).then((x) => x.data);
    },

    getNextPageParam: (lastPage) =>
      lastPage?.transactions?.[lastPage.transactions.length - 1]?.id,
    enabled: !!account.address && deployments.length > 0,
    refetchInterval: 10_000,
  });

  useEffect(() => {
    if (!data?.pages) {
      return;
    }

    data.pages.forEach(({ transactions }) =>
      transactions.forEach((tx) => {
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
      })
    );
  }, [data?.pages, removePending, removeProving, removeFinalising]);

  return {
    transactions: data?.pages.flatMap((p) => p.transactions) ?? [],
    isLoading: isLoading,
    isError: isError,
    fetchNextPage,
    total: data?.pages?.[0].total ?? 0,
    actionRequiredCount: data?.pages?.[0].actionRequiredCount ?? 0,
    inProgressCount: data?.pages?.[0].inProgressCount ?? 0,
  };
};
