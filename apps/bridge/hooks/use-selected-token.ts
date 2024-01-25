import { useConfigState } from "@/state/config";

export const useSelectedToken = () => {
  const deployment = useConfigState.useDeployment();
  const withdrawing = useConfigState.useWithdrawing();
  const token = useConfigState.useToken();

  if (!token || !deployment) {
    return null;
  }

  return token[withdrawing ? deployment.l2.id : deployment.l1.id] ?? null;
};
