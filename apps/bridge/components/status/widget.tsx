import { differenceInSeconds, formatDistance } from "date-fns";
import { Address } from "viem";
import { useBlock, useReadContract } from "wagmi";

import { OptimismPortalAbi } from "@/abis/OptimismPortal";
import { useBridgeControllerGetDeploymentSyncStatus } from "@/codegen/index";
import { ChainDto, DeploymentDto } from "@/codegen/model";
import { isOptimism } from "@/utils/is-mainnet";

const LastObservedBlock = ({ chain }: { chain: ChainDto }) => {
  const latestBlock = useBlock({
    blockTag: "latest",
    chainId: chain.id,
  });

  const timestamp = latestBlock.data?.timestamp;
  if (!timestamp) {
    return (
      <div>
        <div>Last observed {chain.name} block</div>
        <div>Loading</div>
      </div>
    );
  }

  const now = Date.now();
  const lastBlockTimestamp = parseInt(timestamp.toString()) * 1000;

  const distance = formatDistance(now, lastBlockTimestamp);
  const stale = differenceInSeconds(now, lastBlockTimestamp) > 30;

  if (stale) {
    return (
      <div>
        <div>
          Last observed {chain.name} block was more than {distance} ago
        </div>
        <div>
          This could affect bridging operations to and from {chain.name}
        </div>
      </div>
    );
  }
  return (
    <div>
      <div>
        {stale ? `Last observed ${chain.name} block was  ${distance} ago` : ""}
      </div>
    </div>
  );
};

const Paused = ({ deployment }: { deployment: DeploymentDto }) => {
  const paused = useReadContract({
    chainId: deployment.l1.id,
    functionName: "paused",
    abi: OptimismPortalAbi,
    query: {
      enabled: isOptimism(deployment),
    },
    address: isOptimism(deployment)
      ? (deployment.contractAddresses.optimismPortal as Address)
      : "0x",
  });

  if (!isOptimism(deployment)) {
    return null;
  }

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
  console.log(status);
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

          console.log(title, description);
          return (
            <div>
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

      <Paused deployment={deployment} />
      <IndexingStatus deployment={deployment} />
    </div>
  );
};
