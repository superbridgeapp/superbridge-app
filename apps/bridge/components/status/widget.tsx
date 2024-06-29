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

const StatusLineItem = ({
  title,
  description,
  isLoading,
}: {
  title: string;
  description: string;
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <div>
        <div>{title}</div>
        <div>Loading</div>
      </div>
    );
  }

  return (
    <div>
      <div>{title}</div>
      <div>{description}</div>
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
        ? `❌ Last observed ${chain.name} block was more than ${distance} ago. This could affect bridging operations to and from ${chain.name}`
        : `✅ Last observed ${chain.name} block was ${distance} ago`;
    }

    return "❌ Unable to query blockchain";
  })();

  return (
    <StatusLineItem
      title={title}
      description={description}
      isLoading={isLoading}
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
      <div>
        <div>Last observed {name}</div>
        <div>Loading...</div>
      </div>
    );
  }

  if (!l2BlockNumber) {
    return (
      <div>
        <div>Last observed {name}</div>
        <div>None submitted just yet, withdrawal proving is delayed</div>
      </div>
    );
  }

  if (block.isLoading) {
    return (
      <div>
        <div>Last observed {name}</div>
        <div>Loading...</div>
      </div>
    );
  }

  if (!block.data) {
    return (
      <div>
        <div>Last observed {name}</div>
        <div>Something went wrong...</div>
      </div>
    );
  }

  const now = Date.now();
  const lastBlockTimestamp = parseInt(block.data.timestamp.toString()) * 1000;

  const distance = formatDistance(now, lastBlockTimestamp);
  const stale = differenceInHours(now, lastBlockTimestamp) > 2;

  if (stale) {
    return (
      <div>
        <div>
          Last observed {name} was more than {distance} ago
        </div>
        <div>
          This could affect proving withdrawals from {deployment.l2.name}
        </div>
      </div>
    );
  }
  return (
    <div>
      <div>
        ✅ Last observed {name} block was {distance} ago
      </div>
    </div>
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
      <div>
        <div>{deployment.l2.name} withdrawals status</div>
        <div>Loading...</div>
      </div>
    );
  }

  if (paused.data) {
    return (
      <div>
        <div>{deployment.l2.name} withdrawals are paused</div>
        <div>Withdrawals are unable to be processed in this moment</div>
      </div>
    );
  }
  return (
    <div>
      <div>
        <div>{deployment.l2.name} withdrawals are not paused </div>
      </div>
    </div>
  );
};

const IndexingStatus = ({ deployment }: { deployment: DeploymentDto }) => {
  const status = useBridgeControllerGetDeploymentSyncStatus(deployment.id);

  if (status.isLoading) {
    return (
      <div>
        <div>{deployment.l2.name} indexing status</div>
        <div>Loading...</div>
      </div>
    );
  }

  if (!status.data?.data) {
    return (
      <div>
        <div>{deployment.l2.name} indexing status</div>
        <div>Unable to load</div>
      </div>
    );
  }

  return (
    <div>
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
            <div key={title}>
              <div>{title}</div>
              <div>
                {description}{" "}
                {error
                  ? "may be delayed as our indexing pipeline catches up"
                  : "operating normally"}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export const SupportStatusWidget = ({
  deployment,
}: {
  deployment: DeploymentDto;
}) => {
  return (
    <div className="flex flex-col gap-4">
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
