import { useInjectedStore } from "@/state/injected";

export const useAcrossDomains = () => {
  return useInjectedStore((s) => s.acrossDomains);
};
