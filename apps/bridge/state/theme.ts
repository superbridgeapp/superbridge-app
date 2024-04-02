import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { create } from "zustand";

interface ThemeState {
  navIcon: string | null;
  setNavIcon: (d: string) => void;
}

const themeState = create<ThemeState>()((set) => ({
  navIcon: null,
  setNavIcon: (navIcon) => set({ navIcon }),
}));

export const useThemeState = createSelectorHooks(themeState);
