import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { Address } from "viem";
import { create } from "zustand";

import { BridgeNftDto } from "@/codegen/model";
import { MultiChainToken } from "@/types/token";

import { CustomTokenList } from "./settings";

interface FastState {
  fromChainId: number;
  setFromChainId: (id: number) => void;
  toChainId: number;
  setToChainId: (id: number) => void;

  displayConfirmationModal: boolean;
  setDisplayConfirmationModal: (x: boolean) => void;

  settingsModal: boolean;
  setSettingsModal: (x: boolean) => void;

  legalModal: boolean;
  setLegalModal: (x: boolean) => void;

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
}

const FastState = create<FastState>()((set, get) => ({
  // todo: inject available domains so we can
  // switch between when you click the same
  fromChainId: 1,
  toChainId: 10,

  setFromChainId: (fromChainId) => {
    set({ fromChainId });
  },
  setToChainId: (toChainId) => set({ toChainId }),

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
}));

export const useFastState = createSelectorHooks(FastState);
