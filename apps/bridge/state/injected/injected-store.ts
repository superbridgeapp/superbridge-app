import { createStore } from "zustand";

import {
  AcrossDomainDto,
  CctpDomainDto,
  ChainDto,
  DeploymentDto,
  HyperlaneMailboxDto,
  SuperbridgeConfigDto,
} from "@/codegen/model";
import { MultiChainToken } from "@/types/token";

export type InjectedState = {
  deployments: DeploymentDto[];
  testnets: boolean;

  acrossDomains: AcrossDomainDto[];
  cctpDomains: CctpDomainDto[];
  hyperlaneMailboxes: HyperlaneMailboxDto[];
  superbridgeConfig: SuperbridgeConfigDto | null;

  fromChainId: number;
  toChainId: number;

  tokens: MultiChainToken[];

  chains: ChainDto[];
};

export type InjectedActions = {
  setTestnets: (b: boolean) => void;
  setFromChainId: (id: number) => void;
  setToChainId: (id: number) => void;
};

export type InjectedStore = InjectedState & InjectedActions;

export const createInjectedStore = (initState: InjectedState) => {
  return createStore<InjectedStore>()((set) => ({
    ...initState,

    setTestnets: (testnets) => set({ testnets }),
    setFromChainId: (fromChainId) => set({ fromChainId }),
    setToChainId: (toChainId) => set({ toChainId }),
  }));
};
