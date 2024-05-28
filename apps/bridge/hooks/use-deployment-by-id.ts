import { useInjectedStore } from "@/state/injected";

export const useDeploymentById = (id: string) => {
  const deployments = useInjectedStore((store) => store.deployments);
  return deployments.find((x) => x.id === id) ?? null;
};
