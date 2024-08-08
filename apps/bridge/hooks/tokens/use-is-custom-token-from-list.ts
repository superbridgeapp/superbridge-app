import { Token } from "@/types/token";

import { useCustomTokenLists } from "./use-custom-token-lists";

export const useIsCustomTokenFromList = (token: Token | null) => {
  const customTokens = useCustomTokenLists();

  if (!token) {
    return false;
  }

  return !!customTokens.data?.find(
    (x) =>
      x[token?.chainId ?? 0]?.address.toLowerCase() ===
      token?.address.toLowerCase()
  );
};
