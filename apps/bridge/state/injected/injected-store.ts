import { createStore } from "zustand";

import {
  AcrossDomainDto,
  CctpDomainDto,
  ChainDto,
  DeploymentDto,
  HyperlaneMailboxDto,
  LzDomainDto,
  SuperbridgeConfigDto,
} from "@/codegen/model";
import { AppConfig } from "@/types/app-config";

export type InjectedState = {
  /* superbridge  */
  superbridgeTestnets: boolean;
  superbridgeConfig: SuperbridgeConfigDto | null;

  deployments: DeploymentDto[];
  acrossDomains: AcrossDomainDto[];
  cctpDomains: CctpDomainDto[];
  lzDomains: LzDomainDto[];
  hyperlaneMailboxes: HyperlaneMailboxDto[];
  fromChainId: number;
  toChainId: number;
  chains: ChainDto[];

  app: AppConfig;
  host: string;
};

export type InjectedActions = {
  setSuperbridgeTestnets: (b: boolean) => void;
  setFromChainId: (id: number) => void;
  setToChainId: (id: number) => void;
};

export type InjectedStore = InjectedState & InjectedActions;

export const createInjectedStore = (initState: InjectedState) => {
  return createStore<InjectedStore>()((set) => ({
    ...initState,

    setSuperbridgeTestnets: (superbridgeTestnets) =>
      set({ superbridgeTestnets }),
    setFromChainId: (fromChainId) => set({ fromChainId }),
    setToChainId: (toChainId) => set({ toChainId }),
  }));
};
