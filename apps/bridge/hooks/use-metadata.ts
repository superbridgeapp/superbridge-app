import { isSuperbridge } from "@/config/superbridge";

import { useDeployment } from "./use-deployment";

export const useMetadata = () => {
  const deployment = useDeployment();

  if (isSuperbridge) {
    return {
      title: "Superbridge",
      description: "Bridge ETH and ERC20 tokens into and out of the Superchain",
    };
  }

  return {
    title: `${deployment?.l2.name} Bridge`,
    description: `Bridge ETH and ERC20 tokens into and out of ${deployment?.l2.name}`,
  };
};
