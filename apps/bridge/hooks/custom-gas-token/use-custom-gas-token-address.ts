import { Address } from "viem";

import { useDeploymentById } from "../deployments/use-deployment-by-id";

export const useCustomGasTokenAddress = (deploymentId: string | undefined) => {
  const deployment = useDeploymentById(deploymentId);
  return (
    (deployment?.arbitrumNativeToken?.address as Address | undefined) ?? null
  );
};
