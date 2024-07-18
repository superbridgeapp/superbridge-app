import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { Hex } from "viem";
import { create } from "zustand";

import { AlertModals } from "@/constants/modal-names";

interface ModalsState {
  alerts: AlertModals[];
  setAlerts: (a: AlertModals[]) => void;

  pendingBridgeTransactionHash: Hex | null;
  setPendingBridgeTransactionHash: (x: Hex | null) => void;
}

const ModalsState = create<ModalsState>()((set, get) => ({
  alerts: [],
  setAlerts: (alerts) => set({ alerts }),

  pendingBridgeTransactionHash: null,
  setPendingBridgeTransactionHash: (pendingBridgeTransactionHash) =>
    set({ pendingBridgeTransactionHash }),
}));

export const useModalsState = createSelectorHooks(ModalsState);
