import { useDeploymentById } from "../deployments/use-deployment-by-id";

export const useCustomGasTokenAddress = (deploymentId: string | undefined) => {
  const deployment = useDeploymentById(deploymentId);
  return deployment?.arbitrumNativeToken?.address ?? null;
};
