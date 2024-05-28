import { createStore } from "zustand";

import {
  CctpDomainDto,
  DeploymentDto,
  FiatPricesDto,
  PricesDto,
} from "@/codegen/model";
import { SuperbridgeTokenList, SuperchainTokenList } from "@/types/token-lists";

export type InjectedState = {
  deployment: DeploymentDto | null;
  deployments: DeploymentDto[];
  testnets: boolean;
  fiatPrices: FiatPricesDto;
  prices: PricesDto;

  superchainTokenList: SuperchainTokenList | null;
  superbridgeTokenList: SuperbridgeTokenList | null;

  cctpDomains: CctpDomainDto[];
};

export type InjectedActions = {
  setDeployment: (d: DeploymentDto | null) => void;
  setDeployments: (d: DeploymentDto[]) => void;
  setTestnets: (b: boolean) => void;
};

export type InjectedStore = InjectedState & InjectedActions;

const defaultInitState: Partial<InjectedState> = {
  deployment: null,
  deployments: [],
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
    setTestnets: (testnets) => set({ testnets }),
  }));
};
