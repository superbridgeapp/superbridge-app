import { useInjectedStore } from "@/state/injected";

import { useFromChain, useToChain } from "./use-chain";

export const useDeployment = () => {
  const from = useFromChain();
  const to = useToChain();
  const deployments = useInjectedStore((store) => store.deployments);

  if (deployments.length === 1) {
    return deployments[0];
  }

  const d = deployments.find(
    (x) =>
      (x.l1.id === from?.id && x.l2.id === to?.id) ||
      (x.l1.id === to?.id && x.l2.id === from?.id)
  );
  return d ?? null;
};
