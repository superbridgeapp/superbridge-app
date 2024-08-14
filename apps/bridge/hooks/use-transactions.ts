import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAccount } from "wagmi";

import { bridgeControllerGetActivityV4 } from "@/codegen";
import { ActivityV3Dto } from "@/codegen/model";
import { useInjectedStore } from "@/state/injected";

import { useDeployments } from "./deployments/use-deployments";
import { useHyperlaneActivityRequest } from "./hyperlane/use-hyperlane-activity-request";

export const useTransactions = () => {
  const account = useAccount();
  const deployments = useDeployments();
  const hyperlane = useHyperlaneActivityRequest();
  const superbridgeTestnetsEnabled = useInjectedStore(
    (s) => s.superbridgeTestnets
  );
  const acrossDomains = useInjectedStore((s) => s.acrossDomains);
  const cctpDomains = useInjectedStore((s) => s.cctpDomains);

  const address = account.address;
  const { data, isLoading, isFetchingNextPage, isError, fetchNextPage } =
    useInfiniteQuery({
      queryKey: [
        "activity",
        address,
        deployments.map((x) => x.id),
        acrossDomains.map((x) => x.id),
        cctpDomains.map((x) => x.id),
        hyperlane.mailboxIds,
        hyperlane.routers,
        superbridgeTestnetsEnabled,
      ],
      queryFn: async ({ pageParam }) => {
        if (!address) {
          return {
            actionRequiredCount: 0,
            inProgressCount: 0,
            total: 0,
            transactions: [] as ActivityV3Dto["transactions"],
            hasWithdrawalReadyToFinalize: null,
          };
        }

        return await bridgeControllerGetActivityV4({
          address,
          acrossDomains: acrossDomains.map((x) => x.id),
          cctpDomains: cctpDomains.map((x) => x.id),
          deploymentIds: deployments.map((d) => d.id),
          cursor: pageParam || null,
          hyperlane,
        }).then((x) => x.data);
      },
      initialPageParam: "",
      getNextPageParam: (lastPage) =>
        lastPage?.transactions?.[lastPage.transactions.length - 1]?.id,
      enabled: !!address,
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
    hasWithdrawalReadyToFinalize:
      data?.pages?.[0]?.hasWithdrawalReadyToFinalize ?? null,
  };
};
