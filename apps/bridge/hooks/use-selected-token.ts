import { useConfigState } from "@/state/config";

import { useDeployment } from "./use-deployment";

export const useSelectedToken = () => {
  const deployment = useDeployment();
  const withdrawing = useConfigState.useWithdrawing();
  const token = useConfigState.useToken();

  if (!token || !deployment) {
    return null;
  }

  return token[withdrawing ? deployment.l2.id : deployment.l1.id] ?? null;
};
