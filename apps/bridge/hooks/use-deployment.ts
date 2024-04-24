import { useInjectedStore } from "@/state/injected";

export const useDeployment = () =>
  useInjectedStore((store) => store.deployment);
