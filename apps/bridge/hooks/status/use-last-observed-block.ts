import { differenceInSeconds, formatDistanceStrict } from "date-fns";
import { useMemo } from "react";
import { useBlock } from "wagmi";

import { ChainDto } from "@/codegen/model";
import { SupportCheckStatus } from "@/components/status/types";

export const useLastObservedBlock = (chain: ChainDto | undefined) => {
  const latestBlock = useBlock({
    blockTag: "latest",
    chainId: chain?.id,
    query: {
      refetchInterval: 30_000,
    },
  });

  const title = `${chain?.name} block production`;

  const { description, status } = useMemo(() => {
    const now = Date.now();
    if (latestBlock.isLoading) {
      return {
        description: "Loading…",
        status: SupportCheckStatus.Loading,
      };
    }
    if (latestBlock.data?.timestamp) {
      const lastBlockTimestamp =
        parseInt(latestBlock.data.timestamp.toString()) * 1000;

      const distance = formatDistanceStrict(now, lastBlockTimestamp);
      const stale = differenceInSeconds(now, lastBlockTimestamp) > 60;

      return {
        description: stale
          ? `Last observed ${chain?.name} block was more than ${distance} ago. This could affect bridging operations to and from ${chain?.name}`
          : `Last observed ${chain?.name} block was ${distance} ago`,
        status: stale ? SupportCheckStatus.Warning : SupportCheckStatus.Ok,
      };
    }

    return {
      description: "Unable to query blockchain",
      status: SupportCheckStatus.Error,
    };
  }, [latestBlock.data, latestBlock.isLoading]);

  return { status, title, description };
};
