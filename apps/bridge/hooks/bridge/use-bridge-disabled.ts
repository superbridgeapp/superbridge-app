import { useDeployment } from "../deployments/use-deployment";
import { useIsArbitrumDeposit } from "../use-withdrawing";

export const useBridgeDisabled = () => {
  const isArbitrumDeposit = useIsArbitrumDeposit();
  const deployment = useDeployment();

  return isArbitrumDeposit && deployment?.name === "parallel";
};
