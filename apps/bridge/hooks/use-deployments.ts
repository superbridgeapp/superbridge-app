import { useInjectedStore } from "@/state/injected";

export const useDeployments = () => {
  const deployments = useInjectedStore((store) => store.deployments);
  return {
    deployments,
    isLoading: false,
    isError: false,
  };
};
