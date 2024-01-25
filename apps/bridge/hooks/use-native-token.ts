import { isNativeToken } from "@/utils/is-eth";

import { useActiveTokens } from "./use-tokens";

export function useNativeToken() {
  const tokens = useActiveTokens();

  return tokens.find((x) => isNativeToken(x));
}
