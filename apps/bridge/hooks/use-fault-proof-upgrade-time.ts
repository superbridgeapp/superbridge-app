import { useDeployment } from "./use-deployment";

export const useFaultProofUpgradeTime = () => {
  const deployment = useDeployment();

  return deployment?.name === "optimism"
    ? new Date("6/10/2024").getTime()
    : null;
};
