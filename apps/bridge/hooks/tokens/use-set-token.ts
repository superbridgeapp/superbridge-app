import { useCallback } from "react";

import { useConfigState } from "@/state/config";
import { Token } from "@/types/token";

export const useSetToken = () => {
  const setTokenId = useConfigState.useSetTokenId();

  return useCallback(
    (a: Token) => {
      setTokenId(a.address);
    },
    [setTokenId]
  );
};
