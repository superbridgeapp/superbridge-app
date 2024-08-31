import { useMemo } from "react";

import { useInjectedStore } from "@/state/injected";

import { useHyperlaneCustomRoutes } from "./use-hyperlane-custom-routes";

export const useHyperlaneMailboxes = () => {
  const customRoutes = useHyperlaneCustomRoutes();
  const defaultMailboxes = useInjectedStore((s) => s.hyperlaneMailboxes);

  return useMemo(
    () => [...defaultMailboxes, ...(customRoutes?.mailboxes ?? [])],
    [customRoutes, defaultMailboxes]
  );
};
