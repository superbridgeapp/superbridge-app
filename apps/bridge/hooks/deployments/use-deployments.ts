import { useMemo } from "react";

import {
  SUPERCHAIN_MAINNETS,
  SUPERCHAIN_TESTNETS,
} from "@/constants/superbridge";
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
        return allDeployments.filter(({ name }) =>
          SUPERCHAIN_TESTNETS.includes(name)
        );
      } else {
        return allDeployments.filter(({ name }) =>
          SUPERCHAIN_MAINNETS.includes(name)
        );
      }
    }
    return allDeployments;
  }, [allDeployments, testnets]);
};
