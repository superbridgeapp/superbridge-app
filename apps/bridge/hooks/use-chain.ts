import { useConfigState } from "@/state/config";

export const useFromChain = () => {
  const deployment = useConfigState.useDeployment();
  const withdrawing = useConfigState.useWithdrawing();
  return withdrawing ? deployment?.l2 : deployment?.l1;
};

export const useToChain = () => {
  const deployment = useConfigState.useDeployment();
  const withdrawing = useConfigState.useWithdrawing();
  return withdrawing ? deployment?.l1 : deployment?.l2;
};
