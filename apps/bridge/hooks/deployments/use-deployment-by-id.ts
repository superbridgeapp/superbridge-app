import { useAllDeployments } from "./use-all-deployments";

export const useDeploymentById = (id: string) => {
  const deployments = useAllDeployments();
  return deployments.find((x) => x.id === id) ?? null;
};
