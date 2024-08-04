import { useInjectedStore } from "@/state/injected";

export const useAllDeployments = () => {
  return useInjectedStore((store) => store.deployments);
};
