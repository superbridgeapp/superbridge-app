import { isRollbridge, isSuperbridge } from "@/config/superbridge";
import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { isPresent } from "ts-is-present";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface DefaultTokenList {
  name: string;
  url: string;
  enabled: boolean;
}

export interface CustomTokenList {
  id: string;
  name: string;
  url: string;
}

export const DEFAULT_TOKEN_LISTS = [
  {
    name: "OP STL",
    url: "https://raw.githubusercontent.com/ethereum-optimism/ethereum-optimism.github.io/master/optimism.tokenlist.json",
    enabled: true,
  },
  isRollbridge
    ? {
        name: "Arb STL",
        url: "https://raw.githubusercontent.com/ethereum-optimism/ethereum-optimism.github.io/master/optimism.tokenlist.json",
        enabled: true,
      }
    : null,
  {
    name: isSuperbridge ? "Superbridge default" : "Rollbridge default",
    url: "https://raw.githubusercontent.com/ethereum-optimism/ethereum-optimism.github.io/master/optimism.tokenlist.json",
    enabled: true,
  },
].filter(isPresent);

interface SettingsState {
  preferredExplorer: string;
  setPreferredExplorer: (x: string) => void;

  currency: string;
  setCurrency: (x: string) => void;

  defaultTokenLists: DefaultTokenList[];
  setDefaultTokenLists: (list: DefaultTokenList[]) => void;

  customTokenLists: CustomTokenList[];
  setCustomTokenLists: (list: CustomTokenList[]) => void;

  hasViewedTos: boolean;
  dismissTos: () => void;
}

const SettingsState = create<SettingsState>()(
  persist(
    (set) => ({
      preferredExplorer: "etherscan",
      setPreferredExplorer: (preferredExplorer) => set({ preferredExplorer }),

      currency: "USD",
      setCurrency: (currency) => set({ currency }),

      defaultTokenLists: DEFAULT_TOKEN_LISTS,
      setDefaultTokenLists: (defaultTokenLists) => set({ defaultTokenLists }),

      customTokenLists: [] as CustomTokenList[],
      setCustomTokenLists: (customTokenLists) => set({ customTokenLists }),

      hasViewedTos: false,
      dismissTos: () => set({ hasViewedTos: true }),
    }),
    { name: "settings" }
  )
);

export const useSettingsState = createSelectorHooks(SettingsState);
