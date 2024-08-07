import { useMemo } from "react";
import { isPresent } from "ts-is-present";

import { isHyperlaneToken } from "@/utils/guards";

import { useAllTokens } from "./use-all-tokens";

export function useHyperlaneRouters() {
  const all = useAllTokens();

  return useMemo(() => {
    return all
      .flatMap((t) =>
        Object.values(t).map((x) =>
          isHyperlaneToken(x) ? x.hyperlane.router : null
        )
      )
      .filter(isPresent);
  }, [all]);
}
