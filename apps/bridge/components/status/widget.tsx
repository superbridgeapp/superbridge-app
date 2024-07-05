import {
  differenceInHours,
  differenceInSeconds,
  formatDistance,
} from "date-fns";
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
import { t } from "i18next";

const StatusLineItem = ({
  title,
  description,
  isLoading,
  isOk = false,
  isWarning = false,
  isError = false,
}: {
  title: string;
  description: string;
  isLoading: boolean;
  isOk?: boolean;
  isWarning?: boolean;
  isError?: boolean;
}) => {
  if (isLoading) {
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
      {/* todo: make this work */}
      {/* {isOk ?? ( */}
      <span className="flex items-center justify-center px-2 py-1 font-heading text-sm rounded-md text-white bg-green-400">
        OK
      </span>
      {/* )} */}
      {isWarning ?? (
        <span className="flex items-center justify-center px-2 py-1 font-heading text-sm rounded-md text-white bg-amber-400">
          Warning
        </span>
      )}
      {isError ?? (
        <span className="flex items-center justify-center px-2 py-1 font-heading text-sm rounded-md text-white bg-red-400">
          Error
        </span>
      )}
    </div>
  );
};

const LastObservedBlock = ({ chain }: { chain: ChainDto }) => {
  const latestBlock = useBlock({
    blockTag: "latest",
    chainId: chain.id,
  });

  const title = `${chain.name} block production`;
  const isLoading = latestBlock.isLoading;

  const now = Date.now();
  const description = (() => {
    if (latestBlock.data?.timestamp) {
      const lastBlockTimestamp =
        parseInt(latestBlock.data.timestamp.toString()) * 1000;
      const distance = formatDistance(now, lastBlockTimestamp);
      const stale = differenceInSeconds(now, lastBlockTimestamp) > 30;

      return stale
        ? `Last observed ${chain.name} block was more than ${distance} ago. This could affect bridging operations to and from ${chain.name}`
        : `Last observed ${chain.name} block was ${distance} ago`;
    }

    return "Unable to query blockchain";
  })();

  return (
    <StatusLineItem
      title={title}
      description={description}
      isLoading={isLoading}
      // todo: can we pass proper status here
      isOk={true}
    />
  );
};

const LatestStateRoot = ({
  deployment,
}: {
  deployment: OptimismDeploymentDto;
}) => {
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

  if (latestDisputeGame.isLoading || latestStateRoot.isLoading) {
    return (
      <StatusLineItem
        title={`Last observed ${name}`}
        description={"Loading..."}
        isLoading={true}
      />
    );
  }

  if (!l2BlockNumber) {
    return (
      <StatusLineItem
        title={`Last observed ${name}`}
        description={`None submitted just yet, withdrawal proving is delayed`}
        isLoading={false}
        isWarning={true}
      />
    );
  }

  if (block.isLoading) {
    return (
      <StatusLineItem
        title={`Last observed $name}`}
        description={"Loading..."}
        isLoading={true}
      />
    );
  }

  if (!block.data) {
    return (
      <StatusLineItem
        title={`Last observed ${name}`}
        description={`Something went wrong...`}
        isLoading={false}
        isError={true}
      />
    );
  }

  const now = Date.now();
  const lastBlockTimestamp = parseInt(block.data.timestamp.toString()) * 1000;

  const distance = formatDistance(now, lastBlockTimestamp);
  const stale = differenceInHours(now, lastBlockTimestamp) > 2;

  if (stale) {
    return (
      <StatusLineItem
        title={`Block production`}
        description={`Last observed ${name} was more than ${distance} ago. This could affect proving withdrawals from ${deployment.l2.name}`}
        isLoading={false}
        isWarning={true}
      />
    );
  }
  return (
    <StatusLineItem
      title={`Block production`}
      description={`Last observed ${name} block was ${distance} ago`}
      isLoading={false}
      isOk={true}
    />
  );
};

const Paused = ({ deployment }: { deployment: OptimismDeploymentDto }) => {
  const paused = useReadContract({
    chainId: deployment.l1.id,
    functionName: "paused",
    abi: OptimismPortalAbi,
    address: deployment.contractAddresses.optimismPortal as Address,
  });

  if (paused.isFetching) {
    return (
      <StatusLineItem
        title={`${deployment.l2.name} withdrawals status`}
        description={`Loading...`}
        isLoading={true}
      />
    );
  }

  if (paused.data) {
    return (
      <StatusLineItem
        title={`${deployment.l2.name} withdrawals paused`}
        description={`Withdrawals are unable to be processed in this moment`}
        isLoading={false}
        isWarning={true}
      />
    );
  }
  return (
    <StatusLineItem
      title={`${deployment.l2.name} withdrawals enabled`}
      description={`Withdrawals are enabled and processing as normal`}
      isLoading={false}
      isOk={true}
    />
  );
};

const IndexingStatus = ({ deployment }: { deployment: DeploymentDto }) => {
  const status = useBridgeControllerGetDeploymentSyncStatus(deployment.id);

  if (status.isLoading) {
    return (
      <StatusLineItem
        title={`${deployment.l2.name} indexing status`}
        description={`Loading...`}
        isLoading={true}
      />
    );
  }

  if (!status.data?.data) {
    return (
      <StatusLineItem
        title={`${deployment.l2.name} indexing status`}
        description={`Unable to load...`}
        isLoading={false}
        isError={true}
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
              isLoading={false}
              isError={error}
              isOk={!error}
            />
          );
        })}
    </>
  );
};

export const SupportStatusWidget = ({
  deployment,
}: {
  deployment: DeploymentDto;
}) => {
  return (
    <div className="p-6 pt-0 grid gap-2">
      <LastObservedBlock chain={deployment.l1} />
      <LastObservedBlock chain={deployment.l2} />
      {isOptimism(deployment) && (
        <>
          <Paused deployment={deployment} />
          <IndexingStatus deployment={deployment} />
          <LatestStateRoot deployment={deployment} />
        </>
      )}
    </div>
  );
};
