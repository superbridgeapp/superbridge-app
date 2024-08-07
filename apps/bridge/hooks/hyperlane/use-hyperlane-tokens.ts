import { useMemo } from "react";

import { HyperlaneTokenDto } from "@/codegen/model";
import { isHyperlaneToken } from "@/utils/guards";

import { useAllTokens } from "../tokens";

export const useHyperlaneTokens = (): HyperlaneTokenDto[] => {
  const allTokens = useAllTokens();

  return useMemo(() => {
    return allTokens
      .flatMap((x) => Object.values(x))
      .filter((x) => isHyperlaneToken(x));
  }, [allTokens]);
};
