import { useInjectedStore } from "@/state/injected";

export const useCctpDomains = () => {
  return useInjectedStore((s) => s.cctpDomains);
};
