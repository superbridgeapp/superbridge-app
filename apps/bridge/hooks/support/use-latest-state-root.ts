import { differenceInHours, formatDistance } from "date-fns";
import { useMemo } from "react";
import { useBlock } from "wagmi";

import {
  useBridgeControllerGetLatestDisputeGame,
  useBridgeControllerGetLatestStateRoot,
} from "@/codegen/index";
import { SupportCheckStatus } from "@/components/status/types";
import { OptimismDeploymentDto } from "@/utils/is-mainnet";

export const useLatestStateRoot = (
  deployment: OptimismDeploymentDto | undefined
): { title: string; description: string; status: SupportCheckStatus } => {
  const latestDisputeGame = useBridgeControllerGetLatestDisputeGame(
    deployment?.id ?? "",
    {
      query: {
        enabled: !deployment?.contractAddresses.disputeGameFactory,
      },
    }
  );
  const latestStateRoot = useBridgeControllerGetLatestStateRoot(
    deployment?.id ?? "",
    {
      query: {
        enabled: !deployment?.contractAddresses.disputeGameFactory,
      },
    }
  );

  const l2BlockNumber = deployment?.contractAddresses.disputeGameFactory
    ? latestDisputeGame.data?.data.value
    : latestStateRoot.data?.data.value;
  const block = useBlock({
    blockNumber: BigInt(l2BlockNumber || "0"),
    chainId: deployment?.l2.id,
    query: {
      enabled: !!l2BlockNumber,
    },
  });

  const name = deployment?.contractAddresses.disputeGameFactory
    ? "fault dispute game"
    : "state root output";

  return useMemo(() => {
    let blockNumber;

    if (block.isLoading) {
      return {
        title: `Last observed ${name}`,
        description: "Loading…",
        status: SupportCheckStatus.Loading,
      };
    }

    if (deployment?.contractAddresses.disputeGameFactory) {
      if (latestDisputeGame.isLoading || block.isLoading) {
        return {
          title: `Last observed ${name}`,
          description: "Loading…",
          status: SupportCheckStatus.Loading,
        };
      }

      blockNumber = latestDisputeGame.data?.data.value;
    } else {
      if (latestStateRoot.isLoading || block.isLoading) {
        return {
          title: `Last observed ${name}`,
          description: "Loading…",
          status: SupportCheckStatus.Loading,
        };
      }

      blockNumber = latestStateRoot.data?.data.value;
    }

    if (!blockNumber) {
      return {
        title: `Last observed ${name}`,
        description: `None submitted just yet, withdrawal proving is delayed`,
        status: SupportCheckStatus.Warning,
      };
    }

    if (!block.data) {
      return {
        title: `Last observed ${name}`,
        description: `Something went wrong…`,
        status: SupportCheckStatus.Error,
      };
    }

    const now = Date.now();
    const lastBlockTimestamp = parseInt(block.data.timestamp.toString()) * 1000;

    const distance = formatDistance(now, lastBlockTimestamp);
    const stale = differenceInHours(now, lastBlockTimestamp) > 2;

    if (stale) {
      return {
        status: SupportCheckStatus.Warning,
        title: `Block production`,
        description: `Last observed ${name} was more than ${distance} ago. This could affect proving withdrawals from ${deployment?.l2.name}`,
      };
    }

    return {
      status: SupportCheckStatus.Ok,
      title: `Block production`,
      description: `Last observed ${name} block was ${distance} ago`,
    };
  }, [
    latestDisputeGame.data,
    latestDisputeGame.isLoading,
    latestStateRoot.data,
    latestStateRoot.isLoading,
    block.data,
    block.isLoading,
  ]);
};
