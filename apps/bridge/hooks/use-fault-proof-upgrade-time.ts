import { DeploymentDto } from "@/codegen/model";

export const useFaultProofUpgradeTime = (deployment: DeploymentDto | null) => {
  return deployment?.name === "base-sepolia"
    ? new Date("2024/7/23").getTime()
    : null;
};
