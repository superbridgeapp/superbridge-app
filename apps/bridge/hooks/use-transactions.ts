import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAccount } from "wagmi";

import { bridgeControllerGetActivityV3 } from "@/codegen";
import { isSuperbridge } from "@/config/superbridge";
import { useInjectedStore } from "@/state/injected";

import { useDeployments } from "./use-deployments";

export const useTransactions = () => {
  const account = useAccount();
  const deployments = useDeployments();

  const superbridgeTestnetsEnabled = useInjectedStore((s) => s.testnets);

  const { data, isLoading, isFetchingNextPage, isError, fetchNextPage } =
    useInfiniteQuery({
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

  return {
    transactions: useMemo(
      () => data?.pages.flatMap((p) => p.transactions) ?? [],
      [data?.pages]
    ),
    isLoading,
    isFetchingNextPage,
    isError,
    fetchNextPage,
    total: data?.pages?.[0].total ?? 0,
    actionRequiredCount: data?.pages?.[0].actionRequiredCount ?? 0,
    inProgressCount: data?.pages?.[0].inProgressCount ?? 0,
  };
};
