import { frontendApps } from "@/config/apps";
import { useInjectedStore } from "@/state/injected";

export const useIsSpecialApp = () => {
  const host = useInjectedStore((s) => s.host);
  return Object.keys(frontendApps).includes(host);
};
