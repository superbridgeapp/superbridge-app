import { useMemo } from "react";

import { useInjectedStore } from "@/state/injected";

export const useDeploymentById = (id: string) => {
  const deployments = useInjectedStore((store) => store.deployments);
  return useMemo(
    () => deployments.find((x) => x.id === id) ?? null,
    [deployments, id]
  );
};
