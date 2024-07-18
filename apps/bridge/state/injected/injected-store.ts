import { createStore } from "zustand";

import {
  AcrossDomainDto,
  CctpDomainDto,
  DeploymentDto,
  SuperbridgeConfigDto,
} from "@/codegen/model";

export type InjectedState = {
  deployment: DeploymentDto | null;
  deployments: DeploymentDto[];
  withdrawing: boolean;
  testnets: boolean;

  acrossDomains: AcrossDomainDto[];
  cctpDomains: CctpDomainDto[];
  superbridgeConfig: SuperbridgeConfigDto | null;
};

export type InjectedActions = {
  setDeployment: (d: DeploymentDto | null) => void;
  toggleWithdrawing: () => void;
  setTestnets: (b: boolean) => void;
};

export type InjectedStore = InjectedState & InjectedActions;

const defaultInitState: InjectedState = {
  deployment: null,
  deployments: [],
  withdrawing: false,
  testnets: false,
  acrossDomains: [],
  cctpDomains: [],
  superbridgeConfig: null,
};

export const createInjectedStore = (initState: Partial<InjectedState>) => {
  return createStore<InjectedStore>()((set) => ({
    ...defaultInitState,
    ...initState,

    setDeployment: (deployment) => set({ deployment }),
    toggleWithdrawing: () => set((s) => ({ withdrawing: !s.withdrawing })),
    setTestnets: (testnets) => set({ testnets }),
  }));
};
