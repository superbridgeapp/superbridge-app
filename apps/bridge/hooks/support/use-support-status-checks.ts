import { DeploymentDto } from "@/codegen/model";
import { isOptimism } from "@/utils/is-mainnet";

import { useIndexingStatuses } from "./use-indexing-statuses";
import { useLastObservedBlock } from "./use-last-observed-block";
import { useLatestStateRoot } from "./use-latest-state-root";
import { usePaused } from "./use-paused";

export const useSupportStatusChecks = (deployment: DeploymentDto) => {
  const l1LastObservedBlock = useLastObservedBlock(deployment.l1);
  const l2LastObservedBlock = useLastObservedBlock(deployment.l2);

  const paused = usePaused(isOptimism(deployment) ? deployment : undefined);
  const indexingStatuses = useIndexingStatuses(deployment);
  const lastObservedStateRoot = useLatestStateRoot(
    isOptimism(deployment) ? deployment : undefined
  );

  return [
    l1LastObservedBlock,
    l2LastObservedBlock,
    paused,
    ...indexingStatuses,
  ];
};
