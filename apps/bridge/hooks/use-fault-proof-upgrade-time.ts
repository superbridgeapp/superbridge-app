import { DeploymentDto } from "@/codegen/model";

export const useFaultProofUpgradeTime = (
  deployment: DeploymentDto | null | undefined
) => {
  return deployment?.name === "base" ? new Date("10/30/2024").getTime() : null;
};
