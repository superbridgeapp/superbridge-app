import { useMemo } from "react";

import { MultiChainToken } from "@/types/token";

import { useBackendTokens } from "./use-backend-tokens";
import { useCustomTokenLists } from "./use-custom-token-lists";

export function useAllTokens(): {
  isFetching: boolean;
  data: MultiChainToken[];
} {
  const backendTokens = useBackendTokens();
  const customTokenLists = useCustomTokenLists();

  return useMemo(
    () => ({
      isFetching: backendTokens.isFetching || customTokenLists.isFetching,
      data: [...(backendTokens.data ?? []), ...(customTokenLists.data ?? [])],
    }),
    [
      backendTokens.isFetching,
      backendTokens.data,
      customTokenLists.isFetching,
      customTokenLists.data,
    ]
  );
}
