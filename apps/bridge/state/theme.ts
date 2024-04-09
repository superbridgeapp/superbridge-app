import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { create } from "zustand";

interface ThemeState {
  darkModeEnabled: boolean | null;
  setDarkModeEnabled: (d: boolean) => void;
  navIcon: string | null;
  setNavIcon: (d: string) => void;
}

const themeState = create<ThemeState>()((set) => ({
  navIcon: null,
  setNavIcon: (navIcon) => set({ navIcon }),

  darkModeEnabled: null,
  setDarkModeEnabled: (darkModeEnabled) => set({ darkModeEnabled }),
}));

export const useThemeState = createSelectorHooks(themeState);
