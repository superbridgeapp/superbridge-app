import { DeploymentDto } from "@/codegen/model";
import { isSuperbridge } from "@/config/superbridge";
import { MultiChainToken } from "@/types/token";

export const isDog = (
  deployment: DeploymentDto | null,
  token: MultiChainToken | null
) => {
  return (
    token?.[1]?.name === "The Doge NFT" &&
    deployment?.name === "base" &&
    isSuperbridge
  );
};
