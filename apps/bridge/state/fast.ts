import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { create } from "zustand";

interface FastState {
  fromChainId: number;
  setFromChainId: (id: number) => void;
  toChainId: number;
  setToChainId: (id: number) => void;
}

const FastState = create<FastState>()((set) => ({
  fromChainId: 10,
  toChainId: 8453,

  setFromChainId: (fromChainId) => {
    set({ fromChainId });
  },
  setToChainId: (toChainId) => set({ toChainId }),
}));

export const useFastState = createSelectorHooks(FastState);
