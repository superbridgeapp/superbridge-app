import { useMemo } from "react";

import { useHyperlaneState } from "@/state/hyperlane";
import { useInjectedStore } from "@/state/injected";

export const useHyperlaneMailboxes = () => {
  const customHyperlaneMailboxes = useHyperlaneState.useCustomMailboxes();
  const defaultMailboxes = useInjectedStore((s) => s.hyperlaneMailboxes);

  return useMemo(
    () => [...defaultMailboxes, ...customHyperlaneMailboxes],
    [customHyperlaneMailboxes, defaultMailboxes]
  );
};
