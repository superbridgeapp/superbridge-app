import { useAllDeployments } from "./use-all-deployments";

export const useDeploymentById = (id: string | undefined) => {
  const deployments = useAllDeployments();
  return deployments.find((x) => x.id === id) ?? null;
};
