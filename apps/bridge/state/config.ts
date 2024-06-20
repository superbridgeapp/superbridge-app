import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { Address } from "viem";
import { create } from "zustand";

import { BridgeNftDto, DeploymentDto } from "@/codegen/model";
import { MultiChainToken } from "@/types/token";

import { CustomTokenList } from "./settings";
import { ModalNames } from "@/constants/modals";

interface ConfigState {
  withdrawing: boolean;
  toggleWithdrawing: () => void;
  setWithdrawing: (b: boolean) => void;

  displayConfirmationModal: boolean;
  setDisplayConfirmationModal: (x: boolean) => void;

  settingsModal: boolean;
  setSettingsModal: (x: boolean) => void;

  tokensModal: boolean;
  setTokensModal: (x: boolean) => void;

  legalModal: boolean;
  setLegalModal: (x: boolean) => void;

  fast: boolean;
  setFast: (x: boolean) => void;

  forceViaL1: boolean;
  toggleForceViaL1: () => void;
  setForceViaL1: (b: boolean) => void;

  easyMode: boolean;
  toggleEasyMode: () => void;
  setEasyMode: (b: boolean) => void;

  token: MultiChainToken | null;
  setToken: (token: MultiChainToken | null) => void;

  nft: BridgeNftDto | null;
  setNft: (n: BridgeNftDto | null) => void;

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

  tokensImportedFromLists: string[];
  setTokensImportedFromLists: (s: string[]) => void;

  showCustomTokenListModal: true | CustomTokenList | false;
  setShowCustomTokenListModal: (b: true | CustomTokenList | false) => void;

  showCustomTokenImportModal: Address | false;
  setShowCustomTokenImportModal: (b: Address | false) => void;

  arbitrumCustomGasTokens: (MultiChainToken | null)[];
  setArbitrumCustomGasTokens: (b: (MultiChainToken | null)[]) => void;

  faultProofInfoModal: boolean;
  setFaultProofInfoModal: (faultProofInfoModal: boolean) => void;

  hasWithdrawalReadyToFinalizeModal: boolean;
  setHasWithdrawalReadyToFinalizeModal: (
    hasWithdrawalReadyToFinalizeModal: boolean
  ) => void;

  blockProvingModal: DeploymentDto | null;
  setBlockProvingModal: (blockProvingModal: DeploymentDto | null) => void;

  modals: { [x in ModalNames]: boolean };
  addModal: (x: ModalNames) => void;
  removeModal: (x: ModalNames) => void;
}

const ConfigState = create<ConfigState>()((set, get) => ({
  withdrawing: false,
  toggleWithdrawing: () =>
    set((s) => ({ withdrawing: !s.withdrawing, fast: false })),
  setWithdrawing: (withdrawing) => set({ withdrawing, fast: false }),

  fast: false,
  setFast: (fast: boolean) => set({ fast }),

  forceViaL1: false,
  toggleForceViaL1: () => set((s) => ({ forceViaL1: !s.forceViaL1 })),
  setForceViaL1: (forceViaL1) => set({ forceViaL1 }),

  easyMode: false,
  toggleEasyMode: () => set((s) => ({ easyMode: !s.easyMode })),
  setEasyMode: (easyMode) => set({ easyMode }),

  token: null,
  setToken: (token) => set({ token, nft: null }),

  nft: null,
  setNft: (nft) => {
    set({ nft, token: null });
  },

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

  tokensImportedFromLists: [],
  setTokensImportedFromLists: (tokensImportedFromLists) =>
    set({ tokensImportedFromLists }),

  settingsModal: false,
  setSettingsModal: (settingsModal) => set({ settingsModal }),

  tokensModal: false,
  setTokensModal: (tokensModal) => set({ tokensModal }),

  legalModal: false,
  setLegalModal: (legalModal) => set({ legalModal }),

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

  faultProofInfoModal: false,
  setFaultProofInfoModal: (faultProofInfoModal) => set({ faultProofInfoModal }),

  hasWithdrawalReadyToFinalizeModal: false,
  setHasWithdrawalReadyToFinalizeModal: (hasWithdrawalReadyToFinalizeModal) =>
    set({ hasWithdrawalReadyToFinalizeModal }),

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
}));

export const useConfigState = createSelectorHooks(ConfigState);
