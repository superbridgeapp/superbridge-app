import { useInjectedStore } from "@/state/injected";

export const useMetadata = () => {
  return useInjectedStore((s) => s.app);
};

export const useApp = () => {
  return useInjectedStore((s) => s.app);
};
