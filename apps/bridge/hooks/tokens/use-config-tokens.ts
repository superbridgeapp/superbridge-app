import { useInjectedStore } from "@/state/injected";
import { MultiChainToken } from "@/types/token";

export function useConfigTokens(): MultiChainToken[] {
  const a = useInjectedStore((s) => s.tokens);
  return a;
}
