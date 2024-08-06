import { BridgeConfigDto, DeploymentType } from "@/codegen/model";

import { isSuperbridge } from "../is-superbridge";

export const parseSuperbridgeTestnets = (
  { fromChainId, toChainId }: { fromChainId: number; toChainId: number },
  {
    dto,
    host,
    url,
  }: {
    dto: BridgeConfigDto | null;
    host: string;
    url: string;
  }
): boolean => {
  if (!isSuperbridge(host)) {
    return false;
  }

  return (
    dto?.deployments.find(
      (x) =>
        (x.l1.id === fromChainId && x.l2.id === toChainId) ||
        (x.l1.id === toChainId && x.l2.id === fromChainId)
    )?.type === DeploymentType.testnet
  );
};
