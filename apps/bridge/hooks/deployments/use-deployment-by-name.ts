import { useAllDeployments } from "./use-all-deployments";

export const useDeploymentByName = (name: string) => {
  const deployments = useAllDeployments();
  return deployments.find((x) => x.name === name) ?? null;
};
