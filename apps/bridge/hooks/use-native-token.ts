import { isEth } from "@/utils/is-eth";

import { useFromChain, useToChain } from "./use-chain";
import { useAllTokens } from "./use-tokens";

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
