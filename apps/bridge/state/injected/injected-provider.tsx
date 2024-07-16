import { type ReactNode, createContext, useContext, useRef } from "react";
import { type StoreApi, useStore } from "zustand";

import {
  InjectedState,
  type InjectedStore,
  createInjectedStore,
} from "./injected-store";

export const InjectedStoreContext =
  createContext<StoreApi<InjectedStore> | null>(null);

export interface InjectedStoreProviderProps {
  children: ReactNode;
  initialValues: InjectedState;
}

export const InjectedStoreProvider = ({
  children,
  initialValues,
}: InjectedStoreProviderProps) => {
  const storeRef = useRef<StoreApi<InjectedStore>>();
  if (!storeRef.current) {
    storeRef.current = createInjectedStore(initialValues);
  }

  return (
    <InjectedStoreContext.Provider value={storeRef.current}>
      {children}
    </InjectedStoreContext.Provider>
  );
};

export const useInjectedStore = <T,>(
  selector: (store: InjectedStore) => T
): T => {
  const injectedStoreContext = useContext(InjectedStoreContext);

  if (!injectedStoreContext) {
    throw new Error(
      `useInjectedStore must be use within InjectedStoreProvider`
    );
  }

  return useStore(injectedStoreContext, selector);
};
