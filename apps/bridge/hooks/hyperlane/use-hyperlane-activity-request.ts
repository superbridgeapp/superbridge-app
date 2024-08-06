import { useMemo } from "react";

import { GetHyperlaneActivityDto } from "@/codegen/model";

import { useHyperlaneMailboxes } from "./use-hyperlane-mailboxes";
import { useHyperlaneTokens } from "./use-hyperlane-tokens";

export const useHyperlaneActivityRequest = ():
  | GetHyperlaneActivityDto
  | undefined => {
  const mailboxes = useHyperlaneMailboxes();
  const tokens = useHyperlaneTokens();

  return useMemo(
    () => ({
      mailboxIds: mailboxes.map((m) => m.id),
      routers: tokens.map((x) => x.hyperlane.router),
    }),
    [tokens, mailboxes]
  );
};
