import { DeploymentDto } from "@/codegen/model";
import { useLastObservedBlock, usePaused } from "./use-last-observed-block";
import { isOptimism } from "@/utils/is-mainnet";

export const useSupportStatusChecks = (deployment: DeploymentDto) => {
  const l1LastObservedBlock = useLastObservedBlock(deployment.l1);
  const l2LastObservedBlock = useLastObservedBlock(deployment.l2);

  const paused = usePaused(isOptimism(deployment) ? deployment : undefined);

  return [l1LastObservedBlock, l2LastObservedBlock, paused];
};
