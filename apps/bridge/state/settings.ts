import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { isPresent } from "ts-is-present";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { isRollbridge, isSuperbridge } from "@/config/superbridge";
import { MultiChainToken } from "@/types/token";

export interface DefaultTokenList {
  name: string;
  url: string;
  enabled: boolean;
}

export interface CustomTokenList {
  id: string;
  name: string;
  url: string;
  enabled: boolean;
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
        url: "https://tokenlist.arbitrum.io/ArbTokenLists/arbed_uniswap_labs_default.json",
        enabled: true,
      }
    : null,
  // {
  //   name: isSuperbridge ? "Superbridge default" : "Rollbridge default",
  //   url: "",
  //   enabled: true,
  // },
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

  setCustomTokens: (t: MultiChainToken[]) => void;
  customTokens: MultiChainToken[];
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

      customTokens: [] as MultiChainToken[],
      setCustomTokens: (customTokens) => set({ customTokens }),
    }),
    { name: "settings" }
  )
);

export const useSettingsState = createSelectorHooks(SettingsState);
