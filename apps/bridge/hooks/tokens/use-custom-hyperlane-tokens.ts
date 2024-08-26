import { useHyperlaneState } from "@/state/hyperlane";
import { MultiChainToken } from "@/types/token";

export const useCustomHyperlaneTokens = (): MultiChainToken[] => {
  return useHyperlaneState.useCustomTokens();
};
