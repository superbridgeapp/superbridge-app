import { useMemo } from "react";
import { isPresent } from "ts-is-present";

import { GetLzActivityDto } from "@/codegen/model";

import { useAllTokens } from "../tokens";
import { useLzDomains } from "./use-lz-domains";

export const useLzActivityRequest = (): GetLzActivityDto => {
  const domains = useLzDomains();
  const tokens = useAllTokens();

  return useMemo(
    () => ({
      domainIds: domains.map((m) => m.id),
      adapters: tokens.data
        .flatMap((x) => Object.values(x).map((y) => y.lz?.adapter))
        .filter(isPresent),
    }),
    [tokens, domains]
  );
};
