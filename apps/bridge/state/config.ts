import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { Address } from "viem";
import { create } from "zustand";

import { DeploymentDto } from "@/codegen/model";
import { ModalNames } from "@/constants/modal-names";
import { MultiChainToken } from "@/types/token";

import { CustomTokenList } from "./settings";

interface ConfigState {
  displayConfirmationModal: boolean;
  setDisplayConfirmationModal: (x: boolean) => void;

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

  initialised: boolean;
  setInitialised: () => void;

  tokens: MultiChainToken[];
  setTokens: (tokens: MultiChainToken[]) => void;

  showCustomTokenListModal: true | CustomTokenList | false;
  setShowCustomTokenListModal: (b: true | CustomTokenList | false) => void;

  showCustomTokenImportModal: Address | false;
  setShowCustomTokenImportModal: (b: Address | false) => void;

  arbitrumCustomGasTokens: (MultiChainToken | null)[];
  setArbitrumCustomGasTokens: (b: (MultiChainToken | null)[]) => void;

  blockProvingModal: DeploymentDto | null;
  setBlockProvingModal: (blockProvingModal: DeploymentDto | null) => void;

  modals: { [x in ModalNames]: boolean };
  addModal: (x: ModalNames) => void;
  removeModal: (x: ModalNames) => void;

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

  initialised: false,
  setInitialised: () => set({ initialised: true }),

  tokens: [],
  setTokens: (tokens) => set({ tokens }),

  displayConfirmationModal: false,
  setDisplayConfirmationModal: (displayConfirmationModal) =>
    set({ displayConfirmationModal }),

  showCustomTokenListModal: false,
  setShowCustomTokenListModal: (showCustomTokenListModal) =>
    set({ showCustomTokenListModal }),

  showCustomTokenImportModal: false,
  setShowCustomTokenImportModal: (showCustomTokenImportModal) =>
    set({ showCustomTokenImportModal }),

  arbitrumCustomGasTokens: [],
  setArbitrumCustomGasTokens: (arbitrumCustomGasTokens) =>
    set({ arbitrumCustomGasTokens }),

  displayNetworkSelector: false,
  setDisplayNetworkSelector: (displayNetworkSelector) =>
    set({ displayNetworkSelector }),

  networkSelectorDirection: "from",
  setNetworkSelectorDirection: (networkSelectorDirection) =>
    set({ networkSelectorDirection }),

  blockProvingModal: null,
  setBlockProvingModal: (blockProvingModal) => set({ blockProvingModal }),

  modals: Object.keys(ModalNames).reduce(
    (accum, name) => ({ ...accum, [name]: false }),
    {} as Record<ModalNames, boolean>
  ),
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

  routeId: null,
  setRouteId: (routeId) => set({ routeId }),
}));

export const useConfigState = createSelectorHooks(ConfigState);
