import { createStore } from "zustand";

import { DeploymentDto } from "@/codegen/model";

export type InjectedState = {
  deployment: DeploymentDto | null;
  deployments: DeploymentDto[];
  withdrawing: boolean;
};

export type InjectedActions = {
  setDeployment: (d: DeploymentDto | null) => void;
  setDeployments: (d: DeploymentDto[]) => void;
  toggleWithdrawing: () => void;
};

export type InjectedStore = InjectedState & InjectedActions;

const defaultInitState: InjectedState = {
  deployment: null,
  deployments: [],
  withdrawing: false,
};

export const createInjectedStore = (initState: Partial<InjectedState>) => {
  return createStore<InjectedStore>()((set) => ({
    ...defaultInitState,
    ...initState,

    setDeployment: (deployment) => set({ deployment }),
    setDeployments: (deployments) => set({ deployments }),
    toggleWithdrawing: () => set((s) => ({ withdrawing: !s.withdrawing })),
  }));
};
