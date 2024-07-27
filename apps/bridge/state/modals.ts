import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { create } from "zustand";

import { AlertModals } from "@/constants/modal-names";

interface ModalsState {
  alerts: AlertModals[];
  setAlerts: (a: AlertModals[]) => void;

  pendingBridgeTransactionHash: string | null;
  setPendingBridgeTransactionHash: (x: string | null) => void;

  activityId: string | null;
  setActivityId: (x: string | null) => void;
}

const ModalsState = create<ModalsState>()((set, get) => ({
  alerts: [],
  setAlerts: (alerts) => set({ alerts }),

  pendingBridgeTransactionHash: null,
  setPendingBridgeTransactionHash: (pendingBridgeTransactionHash) =>
    set({ pendingBridgeTransactionHash }),

  activityId: null,
  setActivityId: (activityId) => set({ activityId }),
}));

export const useModalsState = createSelectorHooks(ModalsState);
