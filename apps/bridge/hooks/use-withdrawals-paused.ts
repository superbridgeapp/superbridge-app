import { useReadContract } from "wagmi";

import { OptimismPortalAbi } from "@/abis/OptimismPortal";
import { useConfigState } from "@/state/config";
import { isOptimism } from "@/utils/is-mainnet";
import { Address } from "viem";

export const useWithdrawalsPaused = () => {
  const deployment = useConfigState.useDeployment();
  const read = useReadContract({
    abi: OptimismPortalAbi,
    functionName: "paused",
    address:
      !!deployment && isOptimism(deployment)
        ? (deployment.contractAddresses.optimismPortal as Address)
        : "0x",
    query: {
      enabled: !!deployment && isOptimism(deployment),
    },
    chainId: deployment?.l1.id,
  });

  return read.data;
};
