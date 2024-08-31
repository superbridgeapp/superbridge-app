import { useMemo } from "react";

import { MultiChainToken } from "@/types/token";

import { useBackendTokens } from "./use-backend-tokens";
import { useCustomHyperlaneTokens } from "./use-custom-hyperlane-tokens";
import { useCustomTokenLists } from "./use-custom-token-lists";

export function useAllTokens(): {
  isFetching: boolean;
  data: MultiChainToken[];
} {
  const backendTokens = useBackendTokens();
  const customTokenLists = useCustomTokenLists();
  const customHyperlaneTokens = useCustomHyperlaneTokens();

  return useMemo(
    () => ({
      isFetching: backendTokens.isFetching || customTokenLists.isFetching,
      data: [
        ...(backendTokens.data ?? []),
        ...(customTokenLists.data ?? []),
        ...customHyperlaneTokens,
      ],
    }),
    [
      backendTokens.isFetching,
      backendTokens.data,
      customTokenLists.isFetching,
      customTokenLists.data,
      customHyperlaneTokens,
    ]
  );
}
