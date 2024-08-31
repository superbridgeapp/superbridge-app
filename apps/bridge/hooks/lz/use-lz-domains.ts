import { useInjectedStore } from "@/state/injected";

export const useLzDomains = () => {
  return useInjectedStore((s) => s.lzDomains);
};
