import { useInjectedStore } from "@/state/injected";

export const useIsWidget = () => useInjectedStore((s) => s.widget);
