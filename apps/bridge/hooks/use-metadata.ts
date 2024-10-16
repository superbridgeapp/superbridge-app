import { useInjectedStore } from "@/state/injected";

export const useMetadata = () => {
  return useInjectedStore((s) => s.app);
};

export const useApp = () => {
  return useInjectedStore((s) => s.app);
};

export const useHost = () => useInjectedStore((s) => s.host);
export const useIsPaid = () => useInjectedStore((s) => s.isPaid);
export const useDeletedAt = () => useInjectedStore((s) => s.deletedAt);
