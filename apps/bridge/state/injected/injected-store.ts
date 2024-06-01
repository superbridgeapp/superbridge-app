import { createStore } from "zustand";

import { CctpDomainDto, DeploymentDto } from "@/codegen/model";
import { AcrossDomain } from "@/types/across";

export type InjectedState = {
  deployment: DeploymentDto | null;
  deployments: DeploymentDto[];
  withdrawing: boolean;
  testnets: boolean;

  acrossDomains: AcrossDomain[];
  cctpDomains: CctpDomainDto[];
};

export type InjectedActions = {
  setDeployment: (d: DeploymentDto | null) => void;
  setDeployments: (d: DeploymentDto[]) => void;
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
};

export const createInjectedStore = (initState: Partial<InjectedState>) => {
  return createStore<InjectedStore>()((set) => ({
    ...defaultInitState,
    ...initState,

    setDeployment: (deployment) => set({ deployment }),
    setDeployments: (deployments) => set({ deployments }),
    toggleWithdrawing: () => set((s) => ({ withdrawing: !s.withdrawing })),
    setTestnets: (testnets) => set({ testnets }),
  }));
};
