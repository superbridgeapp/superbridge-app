import { useMemo } from "react";
import { isPresent } from "ts-is-present";

import { GetHyperlaneActivityDto } from "@/codegen/model";

import { useAllTokens } from "../tokens";
import { useHyperlaneMailboxes } from "./use-hyperlane-mailboxes";

export const useHyperlaneActivityRequest = ():
  | GetHyperlaneActivityDto
  | undefined => {
  const mailboxes = useHyperlaneMailboxes();
  const tokens = useAllTokens();

  return useMemo(
    () => ({
      mailboxIds: mailboxes.map((m) => m.id),
      routers: tokens.data
        .flatMap((x) => Object.values(x).map((y) => y.hyperlane?.router))
        .filter(isPresent),
    }),
    [tokens, mailboxes]
  );
};
