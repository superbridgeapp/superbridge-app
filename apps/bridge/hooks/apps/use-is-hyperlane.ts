import { useInjectedStore } from "@/state/injected";

export const useIsHyperlanePlayground = () => {
  return useInjectedStore((s) => s.host) === "hyperlane.superbridge.app";
};
