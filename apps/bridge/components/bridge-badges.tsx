import { isPresent } from "ts-is-present";

import { useIsSpecialApp } from "@/hooks/apps/use-is-special-app";
import { useDeployments } from "@/hooks/deployments/use-deployments";

import { PoweredByAlchemy } from "./badges/powered-by-alchemy";
import { PoweredByAltLayer } from "./badges/powered-by-alt-layer-badge";
import { PoweredByConduit } from "./badges/powered-by-conduit-badge";

export const BridgeBadges = () => {
  const deployments = useDeployments();
  const isSpecialApp = useIsSpecialApp();

  const poweredByConduit =
    !isSpecialApp &&
    deployments.length === 1 &&
    deployments[0]?.provider === "conduit" ? (
      <PoweredByConduit />
    ) : null;

  const poweredByAltLayer =
    !isSpecialApp &&
    deployments.length === 1 &&
    deployments[0]?.provider === "alt-layer" ? (
      <PoweredByAltLayer />
    ) : null;

  const poweredByAlchemy =
    !isSpecialApp &&
    deployments.length === 1 &&
    deployments[0]?.name === "shape-testnet" ? (
      <PoweredByAlchemy />
    ) : null;

  const badges = [poweredByConduit, poweredByAltLayer, poweredByAlchemy].filter(
    isPresent
  );

  if (!badges.length) {
    return null;
  }
  return (
    <div className="flex gap-2 py-1 justify-center items-center -translate-y-2">
      {badges}
    </div>
  );
};
