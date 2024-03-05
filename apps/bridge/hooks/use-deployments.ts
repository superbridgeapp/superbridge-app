import { useMemo } from "react";

import { useBridgeControllerAdminGetDeployments } from "@/codegen";
import { DeploymentType } from "@/codegen/model";
import { dedicatedDeployment } from "@/config/dedicated-deployment";

// totally disabled
const DISABLED_DEPLOYMENTS: string[] = [];
// won't show in the grid UI
export const HIDDEN_DEPLOYMENTS: string[] = [];

export const useDeployments = () => {
  const deployments = useBridgeControllerAdminGetDeployments();

  const data = useMemo(() => {
    return (
      deployments.data?.data.filter((d) => {
        return [
          "optimism",
          "base",
          "zora",
          "pgn",
          "mode",
          "orderly",
          "lyra",
        ].includes(d.name);
        if (DISABLED_DEPLOYMENTS.includes(d.name)) {
          return false;
        }

        if (dedicatedDeployment) {
          return d.name === dedicatedDeployment.name;
        }

        if (window.location.hostname === "localhost") {
          return true;
        }

        if (window.location.hostname.includes("vercel.app")) {
          return true;
        }

        // superchain mainnets
        if (window.location.hostname === "superbridge.app") {
          return [
            "optimism",
            "base",
            "zora",
            "pgn",
            "mode",
            "orderly",
            "lyra",
          ].includes(d.name);
        }

        // superchain testnets
        if (window.location.hostname === "testnets.superbridge.app") {
          return [
            "op-sepolia",
            "base-sepolia",
            "zora-sepolia-0thyhxtf5e",
            "pgn-sepolia-i4td3ji6i0",
            "mode-sepolia-vtnhnpim72",
            "orderly-l2-4460-sepolia-8tc3sd7dvy",
          ].includes(d.name);
        }

        // main site shows all mainnet deployments
        if (window.location.hostname === "app.rollbridge.app") {
          return d.type === DeploymentType.mainnet;
        }

        // these need to go last so they don't clash with devnets. or testnets. subdomains

        // [id].devnets.superbridge|rollbridge.app
        if (
          window.location.hostname.includes("devnets.superbridge.app") ||
          window.location.hostname.includes("devnets.rollbridge.app")
        ) {
          const [id] = window.location.hostname.split(".");
          return (
            d.type === DeploymentType.devnet &&
            (d.conduitId === id || d.name === id)
          );
        }

        // [id].testnets.superbridge|rollbridge.app
        if (
          window.location.hostname.includes("testnets.superbridge.app") ||
          window.location.hostname.includes("testnets.rollbridge.app")
        ) {
          const [id] = window.location.hostname.split(".");
          return (
            d.type === DeploymentType.testnet &&
            (d.conduitId === id || d.name === id)
          );
        }

        return false;
      }) ?? []
    );
  }, [deployments.data?.data]);

  return {
    deployments: data,
    isLoading: deployments.isLoading,
    isError: deployments.isError,
  };
};
