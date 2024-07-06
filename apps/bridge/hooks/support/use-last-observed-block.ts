import {
  differenceInHours,
  differenceInSeconds,
  formatDistance,
} from "date-fns";
import { useMemo } from "react";
import { Address } from "viem";
import { useBlock, useReadContract } from "wagmi";

import { OptimismPortalAbi } from "@/abis/OptimismPortal";
import {
  useBridgeControllerGetDeploymentSyncStatus,
  useBridgeControllerGetLatestDisputeGame,
  useBridgeControllerGetLatestStateRoot,
} from "@/codegen/index";
import { ChainDto, DeploymentDto } from "@/codegen/model";
import { SupportCheckStatus } from "@/components/status/types";
import { OptimismDeploymentDto, isOptimism } from "@/utils/is-mainnet";

export const useLastObservedBlock = (chain: ChainDto) => {
  const latestBlock = useBlock({
    blockTag: "latest",
    chainId: chain.id,
  });

  const title = `${chain.name} block production`;

  const { description, status } = useMemo(() => {
    const now = Date.now();
    if (latestBlock.isLoading) {
      return {
        description: "",
        status: SupportCheckStatus.Loading,
      };
    }
    if (latestBlock.data?.timestamp) {
      const lastBlockTimestamp =
        parseInt(latestBlock.data.timestamp.toString()) * 1000;
      const distance = formatDistance(now, lastBlockTimestamp);
      const stale = differenceInSeconds(now, lastBlockTimestamp) > 30;

      return {
        description: stale
          ? `Last observed ${chain.name} block was more than ${distance} ago. This could affect bridging operations to and from ${chain.name}`
          : `Last observed ${chain.name} block was ${distance} ago`,
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

export const useLatestStateRoot = (deployment: OptimismDeploymentDto) => {
  const latestDisputeGame = useBridgeControllerGetLatestDisputeGame(
    deployment.id,
    {
      query: {
        enabled: !deployment.contractAddresses.disputeGameFactory,
      },
    }
  );
  const latestStateRoot = useBridgeControllerGetLatestStateRoot(deployment.id, {
    query: {
      enabled: !deployment.contractAddresses.disputeGameFactory,
    },
  });

  const l2BlockNumber = deployment.contractAddresses.disputeGameFactory
    ? latestDisputeGame.data?.data.value
    : latestStateRoot.data?.data.value;
  const block = useBlock({
    blockNumber: BigInt(l2BlockNumber || "0"),
    chainId: deployment.l2.id,
    query: {
      enabled: !!l2BlockNumber,
    },
  });

  const name = deployment.contractAddresses.disputeGameFactory
    ? "fault dispute game"
    : "state root output";

  return useMemo(() => {
    let blockNumber;

    if (block.isLoading) {
      return {
        title: `Last observed ${name}`,
        description: "Loading...",
        status: SupportCheckStatus.Loading,
      };
    }

    if (deployment.contractAddresses.disputeGameFactory) {
      if (latestDisputeGame.isLoading || block.isLoading) {
        return {
          title: `Last observed ${name}`,
          description: "Loading...",
          status: SupportCheckStatus.Loading,
        };
      }

      blockNumber = latestDisputeGame.data?.data.value;
    } else {
      if (latestStateRoot.isLoading || block.isLoading) {
        return {
          title: `Last observed ${name}`,
          description: "Loading...",
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
        description: `Something went wrong...`,
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
        description: `Last observed ${name} was more than ${distance} ago. This could affect proving withdrawals from ${deployment.l2.name}`,
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

export const usePaused = (deployment: OptimismDeploymentDto | undefined) => {
  const paused = useReadContract({
    chainId: deployment?.l1.id,
    functionName: "paused",
    abi: OptimismPortalAbi,
    address: deployment?.contractAddresses.optimismPortal as Address,
    query: {
      enabled: !!deployment,
    },
  });

  return useMemo(() => {
    if (paused.isFetching) {
      return {
        status: SupportCheckStatus.Loading,
        title: `${deployment?.l2.name} withdrawals status`,
        description: "Loading",
      };
    }

    if (paused.data) {
      return {
        title: `${deployment?.l2.name} withdrawals paused`,
        description: `Withdrawals are unable to be processed in this moment`,
        status: SupportCheckStatus.Warning,
      };
    }

    return {
      title: `${deployment?.l2.name} withdrawals enabled`,
      description: `Withdrawals are enabled and processing as normal`,
      status: SupportCheckStatus.Ok,
    };
  }, [paused.isFetching, paused.data]);
};

const useIndexingStatus = (deployment: DeploymentDto) => {
  const status = useBridgeControllerGetDeploymentSyncStatus(deployment.id);

  return useMemo(() => {
    if (status.isLoading) {
      return [
        {
          title: `${deployment.l2.name} indexing status`,
          status: SupportCheckStatus.Loading,
          description: "Loading...",
        },
      ];
    }
    if (isOptimism(deployment)) {
    }

    return [];
  }, [status.data?.data, status.isLoading]);

  if (status.isLoading) {
    return (
      <StatusLineItem
        title={`${deployment.l2.name} indexing status`}
        description={`Loading...`}
        status={SupportCheckStatus.Loading}
      />
    );
  }

  if (!status.data?.data) {
    return (
      <StatusLineItem
        title={`${deployment.l2.name} indexing status`}
        description={`Unable to load...`}
        status={SupportCheckStatus.Error}
      />
    );
  }

  return (
    <>
      {status.data?.data
        .filter((d) => d.type === "tip")
        .map((d) => {
          let title;
          let description;

          const error = d.diff > 100;

          if (d.name.includes("deposit")) {
            title = "Deposit indexing";
            description = "Deposit operations";
          }

          if (d.name.includes("withdrawals")) {
            title = "Withdrawal indexing";
            description = "Withdrawal operations";
          }

          if (d.name.includes("proveFinalize")) {
            title = "Prove & finalize indexing";
            description = "Prove & finalize operations";
          }

          return (
            <StatusLineItem
              title={`${title}`}
              description={`${description}
                ${
                  error
                    ? "may be delayed as our indexing pipeline catches up"
                    : "operating normally"
                }`}
              status={error ? SupportCheckStatus.Error : SupportCheckStatus.Ok}
            />
          );
        })}
    </>
  );
};
