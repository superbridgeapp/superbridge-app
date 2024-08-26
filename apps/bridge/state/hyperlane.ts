import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { HyperlaneMailboxDto } from "@/codegen/model";
import { MultiChainToken } from "@/types/token";

interface HyperlaneState {
  customWarpRoutesFile: string;
  setCustomWarpRoutesFile: (s: string) => void;

  customMailboxes: HyperlaneMailboxDto[];
  setCustomMailboxes: (m: HyperlaneMailboxDto[]) => void;

  customTokens: MultiChainToken[];
  setCustomTokens: (m: MultiChainToken[]) => void;
}

const HyperlaneState = create<HyperlaneState>()(
  persist(
    (set) => ({
      customWarpRoutesFile: "",
      setCustomWarpRoutesFile: (customWarpRoutesFile) =>
        set({ customWarpRoutesFile }),

      customMailboxes: [],
      setCustomMailboxes: (customMailboxes) => set({ customMailboxes }),

      customTokens: [] as MultiChainToken[],
      setCustomTokens: (customTokens) => set({ customTokens }),
    }),
    {
      name: "hyperlane",
    }
  )
);

export const useHyperlaneState = createSelectorHooks(HyperlaneState);
