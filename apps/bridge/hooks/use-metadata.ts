import { DeploymentDto } from "@/codegen/model";
import { isSuperbridge } from "@/config/app";

import { useDeployment } from "./use-deployment";

export const getMetadata = (deployment: DeploymentDto | null) => {
  if (isSuperbridge) {
    return {
      title: "Superbridge",
      description: "Bridge ETH and ERC20 tokens into and out of the Superchain",
      icon: "https://superbridge.app/img/superbridge-icon.png",
    };
  }

  return {
    title: `${deployment?.l2.name} Bridge`,
    description: `Bridge ${deployment?.l2.nativeCurrency.symbol} and ERC20 tokens into and out of ${deployment?.l2.name}`,
    icon:
      deployment?.theme?.theme.imageLogo ??
      "https://superbridge.app/img/superbridge-icon.png",
  };
};

export const useMetadata = () => {
  const deployment = useDeployment();
  return getMetadata(deployment);
};
