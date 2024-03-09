import { isEth } from "@/utils/is-eth";

import { useFromChain } from "./use-chain";
import { useAllTokens } from "./use-tokens";

export function useNativeToken() {
  const from = useFromChain();
  const tokens = useAllTokens();

  return tokens.find((x) => isEth(x[from?.id ?? 0]));
}
