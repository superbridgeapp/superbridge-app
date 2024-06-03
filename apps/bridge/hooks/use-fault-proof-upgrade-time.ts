import { DeploymentDto } from "@/codegen/model";

export const useFaultProofUpgradeTime = (deployment: DeploymentDto | null) => {
  return deployment?.name === "optimism"
    ? new Date("6/10/2024").getTime()
    : null;
};
