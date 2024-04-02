import {
  useBridgeControllerGetDeployments,
  useBridgeControllerGetDeploymentsByDomain,
} from "@/codegen";
import {
  BridgeControllerGetDeploymentsParams,
  DeploymentDto,
  DeploymentType,
} from "@/codegen/model";
import { dedicatedDeployment } from "@/config/dedicated-deployment";
import { useConfigState } from "@/state/config";

// totally disabled
const DISABLED_DEPLOYMENTS: string[] = [];
// won't show in the grid UI
export const HIDDEN_DEPLOYMENTS: string[] = [];

const useDeploymentsFilters = (): BridgeControllerGetDeploymentsParams => {
  if (typeof window === "undefined") {
    return {};
  }

  if (dedicatedDeployment?.name) {
    return { names: [dedicatedDeployment.name] };
  }

  if (window.location.hostname.includes("localhost")) {
    return {
      // change this to see more things locally
      names: [
        "op-sepolia",
        "base-sepolia",
        "zora-sepolia-0thyhxtf5e",
        "pgn-sepolia-i4td3ji6i0",
        "mode-sepolia-vtnhnpim72",
        "orderly-l2-4460-sepolia-8tc3sd7dvy",
      ],
    };
  }

  if (window.location.hostname === "superbridge.app") {
    return {
      names: ["optimism", "base", "zora", "pgn", "mode", "orderly", "lyra"],
    };
  }

  if (window.location.hostname === "testnets.superbridge.app") {
    return {
      names: [
        "op-sepolia",
        "base-sepolia",
        "zora-sepolia-0thyhxtf5e",
        "pgn-sepolia-i4td3ji6i0",
        "mode-sepolia-vtnhnpim72",
        "orderly-l2-4460-sepolia-8tc3sd7dvy",
      ],
    };
  }

  if (window.location.hostname === "app.rollbridge.app") {
    return { type: DeploymentType.mainnet };
  }

  // these need to go last so they don't clash with devnets. or testnets. subdomains
  const [id] = window.location.hostname.split(".");

  // [id].devnets.superbridge|rollbridge.app
  if (
    window.location.hostname.includes("devnets.superbridge.app") ||
    window.location.hostname.includes("devnets.rollbridge.app")
  ) {
    return {
      type: DeploymentType.devnet,
      names: [id],
    };
  }

  // [id].testnets.superbridge|rollbridge.app
  if (
    window.location.hostname.includes("testnets.superbridge.app") ||
    window.location.hostname.includes("testnets.rollbridge.app")
  ) {
    return {
      type: DeploymentType.testnet,
      names: [id],
    };
  }

  return {};
};

export const useDeployments = () => {
  // const deployments =
  //   typeof window === "undefined" || window.location.hostname === "localhost"
  //     ? useBridgeControllerGetDeployments(useDeploymentsFilters())
  //     : useBridgeControllerGetDeploymentsByDomain("abc.com");

  const deployments = useConfigState.useDeployments();
  // console.log(deployments.data?.data);
  return {
    deployments,
    // deployments: deployments.data?.data ?? ([] as DeploymentDto[]),
    isLoading: false,
    isError: false,
  };
};
