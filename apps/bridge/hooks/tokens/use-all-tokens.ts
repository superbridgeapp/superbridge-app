import { useMemo } from "react";

import { useSettingsState } from "@/state/settings";
import { MultiChainToken } from "@/types/token";

import { useHyperlaneCustomRoutes } from "../hyperlane/use-hyperlane-custom-routes";
import { useBackendTokens } from "./use-backend-tokens";
import { useCustomTokenLists } from "./use-custom-token-lists";

export function useAllTokens(): {
  isFetching: boolean;
  data: MultiChainToken[];
} {
  const backendTokens = useBackendTokens();
  const customTokenLists = useCustomTokenLists();
  const customTokens = useSettingsState.useCustomTokens();
  const customHyperlaneRoutes = useHyperlaneCustomRoutes();

  return useMemo(
    () => ({
      isFetching: backendTokens.isFetching || customTokenLists.isFetching,
      data: [
        ...(backendTokens.data ?? []),
        ...(customTokenLists.data ?? []),
        ...(customHyperlaneRoutes?.tokens ?? []),
        ...customTokens,
      ],
    }),
    [
      backendTokens.isFetching,
      backendTokens.data,
      customTokenLists.isFetching,
      customTokenLists.data,
      customHyperlaneRoutes?.tokens,
    ]
  );
}
