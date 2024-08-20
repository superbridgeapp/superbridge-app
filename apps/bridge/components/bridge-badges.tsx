import { isPresent } from "ts-is-present";

import { DeploymentType } from "@/codegen/model";
import { useIsSuperbridge } from "@/hooks/apps/use-is-superbridge";
import { useDeployments } from "@/hooks/deployments/use-deployments";
import { useInjectedStore } from "@/state/injected";

import { PoweredByAlchemy } from "./badges/powered-by-alchemy";
import { PoweredByAltLayer } from "./badges/powered-by-alt-layer-badge";
import { PoweredByConduit } from "./badges/powered-by-conduit-badge";
import { TestnetBadge } from "./badges/testnet-badge";

export const BridgeBadges = () => {
  const deployments = useDeployments();
  const superbridgeTestnets = useInjectedStore((s) => s.superbridgeTestnets);
  const isSuperbridge = useIsSuperbridge();

  const testnetBadge =
    (isSuperbridge && superbridgeTestnets) ||
    (deployments.length === 1 &&
      deployments[0]?.type === DeploymentType.testnet) ? (
      <TestnetBadge />
    ) : null;

  const poweredByConduit =
    deployments.length === 1 && deployments[0]?.provider === "conduit" ? (
      <PoweredByConduit />
    ) : null;

  const poweredByAltLayer =
    deployments.length === 1 && deployments[0]?.provider === "alt-layer" ? (
      <PoweredByAltLayer />
    ) : null;

  const poweredByAlchemy =
    deployments.length === 1 && deployments[0]?.name === "shape-testnet" ? (
      <PoweredByAlchemy />
    ) : null;

  const badges = [
    testnetBadge,
    poweredByConduit,
    poweredByAltLayer,
    poweredByAlchemy,
  ].filter(isPresent);

  if (!badges.length) {
    return null;
  }
  return (
    <div className="flex gap-2 py-1 justify-center items-center -translate-y-2">
      {badges}
    </div>
  );
};
