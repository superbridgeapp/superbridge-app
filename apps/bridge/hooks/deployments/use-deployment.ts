import { useFromChain, useToChain } from "../use-chain";
import { useAllDeployments } from "./use-all-deployments";

export const useDeployment = () => {
  const from = useFromChain();
  const to = useToChain();
  const deployments = useAllDeployments();

  if (deployments.length === 1) {
    return deployments[0];
  }

  const d = deployments.find(
    (x) =>
      (x.l1ChainId === from?.id && x.l2ChainId === to?.id) ||
      (x.l1ChainId === to?.id && x.l2ChainId === from?.id)
  );
  return d ?? null;
};
