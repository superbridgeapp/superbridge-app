import { useDeployment } from "../deployments/use-deployment";
import {
  useIsOptimismForcedWithdrawal,
  useIsOptimismWithdrawal,
} from "../use-withdrawing";

export const useBridgeDisabled = () => {
  const isWithdrawal = useIsOptimismWithdrawal();
  const isForcedWithdrawal = useIsOptimismForcedWithdrawal();
  const deployment = useDeployment();

  return (isWithdrawal || isForcedWithdrawal) && deployment?.name === "base";
};
