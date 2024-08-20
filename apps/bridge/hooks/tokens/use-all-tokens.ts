import { useMemo } from "react";

import { MultiChainToken } from "@/types/token";

import { useBackendTokens } from "./use-backend-tokens";
import { useCustomTokenLists } from "./use-custom-token-lists";
import { useCustomWarpRoutes } from "./use-custom-warp-routes";

export function useAllTokens(): {
  isFetching: boolean;
  data: MultiChainToken[];
} {
  const backendTokens = useBackendTokens();
  const customTokenLists = useCustomTokenLists();
  const a = useCustomWarpRoutes();

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
