import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { create } from "zustand";

interface ModalsState {
  alerts: AlertName[];
  setAlerts: (a: AlertName[]) => void;

  modals: {
    [x in ModalName]?: boolean;
  };
  addModal: (x: ModalName) => void;
  removeModal: (x: ModalName) => void;

  activeId: string | null;
  setActiveId: (x: string | null) => void;
}

const modalNames = [
  "TransferTime",
  "FeeBreakdown",
  "RecipientAddress",
  "WithdrawSettings",
  "RouteSelector",
  "NetworkSelector",
  "TransactionDetails",
  "Settings",
  "FaultProofInfo",
  "WithdrawalReadyToFinalize",
  "TokenSelector",
  "Legal",
  "GasInfo",
  "CustomTokenImport",
  "CustomTokenListImport",
  "BlockProving",
  "FaultProof",
  "CustomWarpRoutes",
] as const;
export type ModalName = (typeof modalNames)[number];

const alerts = ["no-gas", "gas-expensive", "fault-proofs"] as const;
export type AlertName = (typeof alerts)[number];

const ModalsState = create<ModalsState>()((set, get) => ({
  alerts: [],
  setAlerts: (alerts) => set({ alerts }),

  modals: {},
  addModal: (name) =>
    set({
      modals: {
        ...get().modals,
        [name]: true,
      },
    }),
  removeModal: (name) =>
    set({
      modals: {
        ...get().modals,
        [name]: false,
      },
    }),

  activeId: null,
  setActiveId: (activeId) => set({ activeId }),
}));

export const useModalsState = createSelectorHooks(ModalsState);
