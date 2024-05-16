import { createStore } from "zustand";

import { DeploymentDto, FiatPricesDto, PricesDto } from "@/codegen/model";
import { SuperbridgeTokenList, SuperchainTokenList } from "@/types/token-lists";

export type InjectedState = {
  deployment: DeploymentDto | null;
  deployments: DeploymentDto[];
  withdrawing: boolean;
  testnets: boolean;
  fiatPrices: FiatPricesDto;
  prices: PricesDto;

  superchainTokenList: SuperchainTokenList | null;
  superbridgeTokenList: SuperbridgeTokenList | null;
};

export type InjectedActions = {
  setDeployment: (d: DeploymentDto | null) => void;
  setDeployments: (d: DeploymentDto[]) => void;
  toggleWithdrawing: () => void;
  setTestnets: (b: boolean) => void;
};

export type InjectedStore = InjectedState & InjectedActions;

const defaultInitState: Partial<InjectedState> = {
  deployment: null,
  deployments: [],
  withdrawing: false,
  testnets: false,
  fiatPrices: {},
  prices: {},
};

export const createInjectedStore = (initState: InjectedState) => {
  return createStore<InjectedStore>()((set) => ({
    ...defaultInitState,
    ...initState,

    setDeployment: (deployment) => set({ deployment }),
    setDeployments: (deployments) => set({ deployments }),
    toggleWithdrawing: () => set((s) => ({ withdrawing: !s.withdrawing })),
    setTestnets: (testnets) => set({ testnets }),
  }));
};
