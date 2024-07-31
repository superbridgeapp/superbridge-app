import { isEth } from "@/utils/is-eth";

import { useAllTokens } from "./tokens/use-all-tokens";
import { useFromChain, useToChain } from "./use-chain";

export function useNativeToken() {
  const from = useFromChain();
  const tokens = useAllTokens();

  return tokens.find((x) => isEth(x[from?.id ?? 0]));
}

export function useToNativeToken() {
  const to = useToChain();
  const tokens = useAllTokens();

  return tokens.find((x) => isEth(x[to?.id ?? 0]));
}

export function useNativeTokenForChainId(chainId: number | undefined) {
  const tokens = useAllTokens();
  return tokens.find((x) => isEth(x[chainId ?? 0]));
}
