import { useInjectedStore } from "@/state/injected";

// totally disabled
const DISABLED_DEPLOYMENTS: string[] = [];
// won't show in the grid UI
export const HIDDEN_DEPLOYMENTS: string[] = [];

const SUPERCHAIN_MAINNETS = [
  "optimism",
  "base",
  "zora",
  "pgn",
  "mode",
  "orderly",
  "lyra",
  "lumio-mainnet",
  "metal-mainnet",
];

const SUPERCHAIN_TESTNETS = [
  "op-sepolia",
  "base-sepolia",
  "zora-sepolia-0thyhxtf5e",
  "pgn-sepolia-i4td3ji6i0",
  "mode-sepolia-vtnhnpim72",
  "orderly-l2-4460-sepolia-8tc3sd7dvy",
  "metal-l2-testnet-3bbzi9kufn",
];

export const useDeployments = () => {
  // const deployments =
  //   typeof window === "undefined" || window.location.hostname === "localhost"
  //     ? useBridgeControllerGetDeployments(useDeploymentsFilters())
  //     : useBridgeControllerGetDeploymentsByDomain("abc.com");
  const deployments = useInjectedStore((store) => store.deployments);
  return {
    deployments,
    // deployments: deployments.data?.data ?? ([] as DeploymentDto[]),
    isLoading: false,
    isError: false,
  };
};
