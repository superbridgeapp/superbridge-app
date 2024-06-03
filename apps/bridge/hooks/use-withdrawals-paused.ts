import { Address } from "viem";
import { useReadContract } from "wagmi";

import { OptimismPortalAbi } from "@/abis/OptimismPortal";
import { isOptimism } from "@/utils/is-mainnet";

import { useDeployment } from "./use-deployment";

export const useWithdrawalsPaused = () => {
  const deployment = useDeployment();
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

  return read.data ?? false;
};
