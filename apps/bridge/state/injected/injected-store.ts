import { createStore } from "zustand";

import {
  AcrossDomainDto,
  CctpDomainDto,
  DeploymentDto,
  SuperbridgeConfigDto,
} from "@/codegen/model";

export type InjectedState = {
  deployments: DeploymentDto[];
  testnets: boolean;

  acrossDomains: AcrossDomainDto[];
  cctpDomains: CctpDomainDto[];
  superbridgeConfig: SuperbridgeConfigDto | null;

  fromChainId: number;
  toChainId: number;
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
