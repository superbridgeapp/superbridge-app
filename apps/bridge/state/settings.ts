import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  preferredExplorer: string;
  setPreferredExplorer: (x: string) => void;

  currency: string;
  setCurrency: (x: string) => void;

  tokenLists: string[];
  setTokenLists: (list: string[]) => void;
}

const SettingsState = create<SettingsState>()(
  persist(
    (set) => ({
      preferredExplorer: "etherscan",
      setPreferredExplorer: (preferredExplorer) => set({ preferredExplorer }),

      currency: "USD",
      setCurrency: (currency) => set({ currency }),

      tokenLists: [
        "https://raw.githubusercontent.com/ethereum-optimism/ethereum-optimism.github.io/master/optimism.tokenlist.json",
      ],
      setTokenLists: (tokenLists) => set({ tokenLists }),
    }),
    { name: "settings" }
  )
);

export const useSettingsState = createSelectorHooks(SettingsState);
