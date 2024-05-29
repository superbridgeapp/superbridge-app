import { DeploymentDto } from "@/codegen/model";
import { useConfigState } from "@/state/config";
import { useFastState } from "@/state/fast";

import { useDeployment } from "./use-deployment";
import { useDeployments } from "./use-deployments";

export const getChain = (id: number, deployments: DeploymentDto[]) => {
  const d = deployments.find((x) => x.l1.id === id || x.l2.id === id);
  return id === d?.l1.id ? d.l1 : d?.l2;
};

const useChain = (id: number) => {
  const { deployments } = useDeployments();
  return getChain(id, deployments);
};

export const useFromChain = () => {
  const fast = useConfigState.useFast();
  const fastFromChainId = useFastState.useFromChainId();
  const deployment = useDeployment();
  const withdrawing = useConfigState.useWithdrawing();

  if (fast) {
    return useChain(fastFromChainId);
  }
  return withdrawing ? deployment?.l2 : deployment?.l1;
};

export const useToChain = () => {
  const fast = useConfigState.useFast();
  const fastToChainId = useFastState.useToChainId();
  const deployment = useDeployment();
  const withdrawing = useConfigState.useWithdrawing();

  if (fast) {
    return useChain(fastToChainId);
  }

  return withdrawing ? deployment?.l1 : deployment?.l2;
};
