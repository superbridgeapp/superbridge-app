import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { Address, Hex } from "viem";
import { create } from "zustand";

import { RouteProvider } from "@/codegen/model";
import { MultiChainToken } from "@/types/token";

interface ConfigState {
  displayConfirmationModal: boolean;
  setDisplayConfirmationModal: (x: boolean) => void;

  submittingBridge: boolean;
  setSubmittingBridge: (x: boolean) => void;

  submittedHash: Hex | null;
  setSubmittedHash: (x: Hex | null) => void;

  forceViaL1: boolean;
  toggleForceViaL1: () => void;
  setForceViaL1: (b: boolean) => void;

  easyMode: boolean;
  toggleEasyMode: () => void;
  setEasyMode: (b: boolean) => void;

  token: MultiChainToken | null;
  setToken: (token: MultiChainToken) => void;

  rawAmount: string;
  setRawAmount: (raw: string) => void;

  recipientName: string;
  recipientAddress: Address | "";
  setRecipientName: (r: string) => void;
  setRecipientAddress: (r: Address | "") => void;

  displayTransactions: boolean;
  setDisplayTransactions: (b: boolean) => void;

  displayNetworkSelector: boolean;
  setDisplayNetworkSelector: (x: boolean) => void;

  networkSelectorDirection: "from" | "to";
  setNetworkSelectorDirection: (x: "from" | "to") => void;

  routeId: RouteProvider | null;
  setRouteId: (n: RouteProvider | null) => void;
}

const ConfigState = create<ConfigState>()((set, get) => ({
  forceViaL1: false,
  toggleForceViaL1: () => set((s) => ({ forceViaL1: !s.forceViaL1 })),
  setForceViaL1: (forceViaL1) => set({ forceViaL1 }),

  easyMode: false,
  toggleEasyMode: () => set((s) => ({ easyMode: !s.easyMode })),
  setEasyMode: (easyMode) => set({ easyMode }),

  token: null,
  setToken: (token) => set({ token }),

  rawAmount: "",
  setRawAmount: (rawAmount) => set({ rawAmount }),

  recipientName: "",
  recipientAddress: "",
  setRecipientName: (recipientName) => set({ recipientName }),
  setRecipientAddress: (recipientAddress) => set({ recipientAddress }),

  displayTransactions: false,
  setDisplayTransactions: (displayTransactions) => set({ displayTransactions }),

  submittingBridge: false,
  setSubmittingBridge: (submittingBridge) => set({ submittingBridge }),

  submittedHash: null,
  setSubmittedHash: (submittedHash) => set({ submittedHash }),

  displayConfirmationModal: false,
  setDisplayConfirmationModal: (displayConfirmationModal) =>
    set({ displayConfirmationModal }),

  displayNetworkSelector: false,
  setDisplayNetworkSelector: (displayNetworkSelector) =>
    set({ displayNetworkSelector }),

  networkSelectorDirection: "from",
  setNetworkSelectorDirection: (networkSelectorDirection) =>
    set({ networkSelectorDirection }),

  routeId: null,
  setRouteId: (routeId) => set({ routeId }),
}));

export const useConfigState = createSelectorHooks(ConfigState);
