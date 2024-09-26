import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { create } from "zustand";

import { HyperlaneMailboxDto } from "@/codegen/model";
import { MultiChainToken } from "@/types/token";

interface HyperlaneState {
  customRoutesId: string | undefined;
  setCustomRoutesId: (s: string) => void;

  customMailboxes: HyperlaneMailboxDto[];
  setCustomMailboxes: (m: HyperlaneMailboxDto[]) => void;

  customTokens: MultiChainToken[];
  setCustomTokens: (m: MultiChainToken[]) => void;
}

const HyperlaneState = create<HyperlaneState>()((set) => ({
  customRoutesId: undefined,
  setCustomRoutesId: (customRoutesId) => set({ customRoutesId }),

  customMailboxes: [],
  setCustomMailboxes: (customMailboxes) => set({ customMailboxes }),

  customTokens: [] as MultiChainToken[],
  setCustomTokens: (customTokens) => set({ customTokens }),
}));

export const useHyperlaneState = createSelectorHooks(HyperlaneState);
