import { Address, useContractRead } from "wagmi";

import { OptimismPortalAbi } from "@/abis/OptimismPortal";
import { useConfigState } from "@/state/config";
import { isOptimism } from "@/utils/is-mainnet";

export const useWithdrawalsPaused = () => {
  const deployment = useConfigState.useDeployment();
  const read = useContractRead({
    abi: OptimismPortalAbi,
    functionName: "paused",
    address:
      !!deployment && isOptimism(deployment)
        ? (deployment.contractAddresses.optimismPortal as Address)
        : "0x",
    enabled: !!deployment && isOptimism(deployment),
    chainId: deployment?.l1.id,
  });

  return read.data;
};
