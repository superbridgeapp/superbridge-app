import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { MultiChainToken } from "@/types/token";

export interface CustomTokenList {
  id: string;
  name: string;
  url: string;
  enabled: boolean;
}

interface SettingsState {
  preferredExplorer: string;
  setPreferredExplorer: (x: string) => void;

  currency: string;
  setCurrency: (x: string) => void;

  customTokenLists: CustomTokenList[];
  setCustomTokenLists: (list: CustomTokenList[]) => void;

  hasViewedTos: boolean;
  dismissTos: () => void;

  setCustomTokens: (t: MultiChainToken[]) => void;
  customTokens: MultiChainToken[];
}

const SettingsState = create<SettingsState>()(
  persist(
    (set) => ({
      preferredExplorer: "blockscout",
      setPreferredExplorer: (preferredExplorer) => set({ preferredExplorer }),

      currency: "USD",
      setCurrency: (currency) => set({ currency }),

      customTokenLists: [] as CustomTokenList[],
      setCustomTokenLists: (customTokenLists) => set({ customTokenLists }),

      hasViewedTos: false,
      dismissTos: () => set({ hasViewedTos: true }),

      customTokens: [] as MultiChainToken[],
      setCustomTokens: (customTokens) => set({ customTokens }),
    }),
    {
      name: "settings",
      version: 1,
      migrate: (persistedState, version) => {
        if (version === 0) {
          // @ts-expect-error
          persistedState.preferredExplorer = "blockscout";
        }
        return persistedState;
      },
    }
  )
);

export const useSettingsState = createSelectorHooks(SettingsState);
