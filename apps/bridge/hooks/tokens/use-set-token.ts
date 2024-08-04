import { useCallback } from "react";

import { useConfigState } from "@/state/config";
import { Token } from "@/types/token";

import { useFromChain, useToChain } from "../use-chain";
import { getTokenId } from "./use-token";

export const useSetToken = () => {
  const setTokenId = useConfigState.useSetTokenId();
  const to = useToChain();
  const from = useFromChain();

  return useCallback(
    (a: Token, b: Token) => {
      setTokenId(getTokenId(a.address, b.address));
    },
    [setTokenId, to, from]
  );
};
