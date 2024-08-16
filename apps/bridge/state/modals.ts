import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { create } from "zustand";

import { AlertModals } from "@/constants/modal-names";

interface ModalsState {
  alerts: AlertModals[];
  setAlerts: (a: AlertModals[]) => void;

  activeId: string | null;
  setActiveId: (x: string | null) => void;
}

const ModalsState = create<ModalsState>()((set, get) => ({
  alerts: [],
  setAlerts: (alerts) => set({ alerts }),

  activeId: null,
  setActiveId: (activeId) => set({ activeId }),
}));

export const useModalsState = createSelectorHooks(ModalsState);
