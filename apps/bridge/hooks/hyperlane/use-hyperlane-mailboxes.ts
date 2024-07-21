import { useInjectedStore } from "@/state/injected";

export const useHyperlaneMailboxes = () => {
  return useInjectedStore((s) => s.hyperlaneMailboxes);
};
