import { useEffect } from "react";

import { useConfigState } from "@/state/config";
import { useFastState } from "@/state/fast";
import { isNativeToken } from "@/utils/is-eth";

import { useAllTokens } from "./use-tokens";

export const useInitialiseFastToken = () => {
  const stateToken = useConfigState.useToken();
  const setToken = useConfigState.useSetToken();
  const fast = useConfigState.useFast();
  const fastFromChainId = useFastState.useFromChainId();
  const fastToChainId = useFastState.useToChainId();
  const tokens = useAllTokens();

  useEffect(() => {
    if (!tokens.length || !fast) {
      return;
    }

    if (
      stateToken &&
      stateToken[fastFromChainId] &&
      stateToken[fastToChainId]
    ) {
      return;
    }
    setToken(tokens.find((x) => isNativeToken(x))!);
    return;
  }, [tokens, fast, fastFromChainId, fastToChainId, stateToken]);
};
