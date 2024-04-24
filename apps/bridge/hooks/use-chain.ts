import { useConfigState } from "@/state/config";

import { useDeployment } from "./use-deployment";

export const useFromChain = () => {
  const deployment = useDeployment();
  const withdrawing = useConfigState.useWithdrawing();
  return withdrawing ? deployment?.l2 : deployment?.l1;
};

export const useToChain = () => {
  const deployment = useDeployment();
  const withdrawing = useConfigState.useWithdrawing();
  return withdrawing ? deployment?.l1 : deployment?.l2;
};
