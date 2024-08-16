import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { Address } from "viem";
import { create } from "zustand";

interface ConfigState {
  displayConfirmationModal: boolean;
  setDisplayConfirmationModal: (x: boolean) => void;

  submittingBridge: boolean;
  setSubmittingBridge: (x: boolean) => void;

  forceViaL1: boolean;
  toggleForceViaL1: () => void;
  setForceViaL1: (b: boolean) => void;

  easyMode: boolean;
  toggleEasyMode: () => void;
  setEasyMode: (b: boolean) => void;

  tokenId: string | null;
  setTokenId: (tokenId: string) => void;

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

  routeId: string | null;
  setRouteId: (n: string | null) => void;
}

const ConfigState = create<ConfigState>()((set, get) => ({
  forceViaL1: false,
  toggleForceViaL1: () => set((s) => ({ forceViaL1: !s.forceViaL1 })),
  setForceViaL1: (forceViaL1) => set({ forceViaL1 }),

  easyMode: false,
  toggleEasyMode: () => set((s) => ({ easyMode: !s.easyMode })),
  setEasyMode: (easyMode) => set({ easyMode }),

  tokenId: null,
  setTokenId: (tokenId) => set({ tokenId }),

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
