import {
  differenceInHours,
  differenceInSeconds,
  formatDistance,
} from "date-fns";
import { Dispatch, SetStateAction, useEffect, useMemo } from "react";
import { Address } from "viem";
import { useBlock, useReadContract } from "wagmi";

import { OptimismPortalAbi } from "@/abis/OptimismPortal";
import {
  useBridgeControllerGetDeploymentSyncStatus,
  useBridgeControllerGetLatestDisputeGame,
  useBridgeControllerGetLatestStateRoot,
} from "@/codegen/index";
import { ChainDto, DeploymentDto } from "@/codegen/model";
import { OptimismDeploymentDto, isOptimism } from "@/utils/is-mainnet";

import { StatusCheckProps, SupportCheckStatus } from "./types";

const StatusLineItem = ({
  id,
  title,
  description,
  status,
  setSupportChecks,
}: {
  id: string;
  title: string;
  description: string;
  status: SupportCheckStatus;
} & StatusCheckProps) => {
  useEffect(() => {
    setSupportChecks((c) => ({ ...c, [id]: status }));
  }, [status, id]);

  if (status === SupportCheckStatus.Loading) {
    return (
      <div className="bg-muted rounded-lg p-4 flex justify-between">
        <div>
          <h3 className="text-sm font-heading tracking-tight">{title}</h3>
          <p className="font-body text-xs text-muted-foreground tracking-tight">
            Loading...
          </p>
        </div>
        <div>
          <svg
            fill="none"
            viewBox="0 0 66 66"
            className="w-3.5 h-3.5 block text-primary-foreground"
          >
            <circle
              cx="33"
              cy="33"
              fill="none"
              r="28"
              stroke="currentColor"
              opacity="0.2"
              stroke-width="12"
            ></circle>
            <circle
              cx="33"
              cy="33"
              fill="none"
              r="28"
              stroke="currentColor"
              stroke-dasharray="1, 174"
              stroke-dashoffset="306"
              stroke-linecap="round"
              stroke-width="12"
              className="animate-spinner"
            ></circle>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted rounded-lg p-4 flex gap-8 justify-between items-start">
      <div>
        <h3 className="text-sm font-heading tracking-tight">{title}</h3>
        <p className="font-body text-xs text-muted-foreground tracking-tight">
          {description}
        </p>
      </div>
      {status === SupportCheckStatus.Ok && (
        <span className="flex items-center justify-center px-2 py-1 font-heading text-sm rounded-md text-white bg-green-400">
          OK
        </span>
      )}
      {status === SupportCheckStatus.Warning && (
        <span className="flex items-center justify-center px-2 py-1 font-heading text-sm rounded-md text-white bg-amber-400">
          Warning
        </span>
      )}
      {status === SupportCheckStatus.Error && (
        <span className="flex items-center justify-center px-2 py-1 font-heading text-sm rounded-md text-white bg-red-400">
          Error
        </span>
      )}
    </div>
  );
};

const LastObservedBlock = ({
  chain,
  ...props
}: { chain: ChainDto } & StatusCheckProps) => {
  const latestBlock = useBlock({
    blockTag: "latest",
    chainId: chain.id,
  });

  const title = `${chain.name} block production`;

  const now = Date.now();
  const { description, status } = useMemo(() => {
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

  return (
    <StatusLineItem
      id="lastObservedBlock"
      title={title}
      description={description}
      status={status}
      {...props}
    />
  );
};

const LatestStateRoot = ({
  deployment,
  ...props
}: {
  deployment: OptimismDeploymentDto;
} & StatusCheckProps) => {
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

  const { status, title, description } = useMemo(() => {
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

  return (
    <StatusLineItem
      id="stateRoot"
      title={title}
      description={description}
      status={status}
      {...props}
    />
  );
};

const Paused = ({
  deployment,
  ...props
}: { deployment: OptimismDeploymentDto } & StatusCheckProps) => {
  const paused = useReadContract({
    chainId: deployment.l1.id,
    functionName: "paused",
    abi: OptimismPortalAbi,
    address: deployment.contractAddresses.optimismPortal as Address,
  });

  const { status, title, description } = useMemo(() => {
    if (paused.isFetching) {
      return {
        status: SupportCheckStatus.Loading,
        title: `${deployment.l2.name} withdrawals status`,
        description: "Loading",
      };
    }

    if (paused.data) {
      return {
        title: `${deployment.l2.name} withdrawals paused`,
        description: `Withdrawals are unable to be processed in this moment`,
        status: SupportCheckStatus.Warning,
      };
    }

    return {
      title: `${deployment.l2.name} withdrawals enabled`,
      description: `Withdrawals are enabled and processing as normal`,
      status: SupportCheckStatus.Ok,
    };
  }, [paused.isFetching, paused.data]);

  return (
    <StatusLineItem
      id="paused"
      status={status}
      title={title}
      description={description}
      {...props}
    />
  );
};

// const IndexingStatus = ({
//   deployment,
// }: { deployment: DeploymentDto } & StatusCheckProps) => {
//   const status = useBridgeControllerGetDeploymentSyncStatus(deployment.id);

//   if (status.isLoading) {
//     return (
//       <StatusLineItem
//         title={`${deployment.l2.name} indexing status`}
//         description={`Loading...`}
//         status={SupportCheckStatus.Loading}
//       />
//     );
//   }

//   if (!status.data?.data) {
//     return (
//       <StatusLineItem
//         title={`${deployment.l2.name} indexing status`}
//         description={`Unable to load...`}
//         status={SupportCheckStatus.Error}
//       />
//     );
//   }

//   return (
//     <>
//       {status.data?.data
//         .filter((d) => d.type === "tip")
//         .map((d) => {
//           let title;
//           let description;

//           const error = d.diff > 100;

//           if (d.name.includes("deposit")) {
//             title = "Deposit indexing";
//             description = "Deposit operations";
//           }

//           if (d.name.includes("withdrawals")) {
//             title = "Withdrawal indexing";
//             description = "Withdrawal operations";
//           }

//           if (d.name.includes("proveFinalize")) {
//             title = "Prove & finalize indexing";
//             description = "Prove & finalize operations";
//           }

//           return (
//             <StatusLineItem
//               title={`${title}`}
//               description={`${description}
//                 ${
//                   error
//                     ? "may be delayed as our indexing pipeline catches up"
//                     : "operating normally"
//                 }`}
//               status={error ? SupportCheckStatus.Error : SupportCheckStatus.Ok}
//             />
//           );
//         })}
//     </>
//   );
// };

export const SupportStatusWidget = ({
  deployment,
  ...props
}: {
  deployment: DeploymentDto;
} & StatusCheckProps) => {
  console.log("here I am");
  return (
    <div className="p-6 pt-0 grid gap-2">
      <LastObservedBlock chain={deployment.l1} {...props} />
      <LastObservedBlock chain={deployment.l2} {...props} />
      {isOptimism(deployment) && (
        <>
          <Paused deployment={deployment} {...props} />
          {/* <IndexingStatus deployment={deployment} {...props} /> */}
          <LatestStateRoot deployment={deployment} {...props} />
        </>
      )}
    </div>
  );
};
