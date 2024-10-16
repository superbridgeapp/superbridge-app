import { useMemo } from "react";

import { useInjectedStore } from "@/state/injected";

import { useIsSuperbridge } from "../apps/use-is-superbridge";
import { useAllDeployments } from "./use-all-deployments";

export const useDeployments = () => {
  const allDeployments = useAllDeployments();
  const testnets = useInjectedStore((store) => store.superbridgeTestnets);
  const isSuperbridge = useIsSuperbridge();

  return useMemo(() => {
    if (isSuperbridge) {
      if (testnets) {
        return allDeployments.filter(({ l2 }) => l2.testnet);
      } else {
        return allDeployments.filter(({ l2 }) => !l2.testnet);
      }
    }
    return allDeployments;
  }, [allDeployments, testnets]);
};
