import { waitForTransactionReceipt } from "@wagmi/core";
import { useState } from "react";
import { Address, erc20Abi, maxUint256 } from "viem";
import { useConfig, useWriteContract } from "wagmi";

import { getNativeTokenForDeployment } from "@/utils/get-native-token";
import { isArbitrum } from "@/utils/is-mainnet";

import { useFromChain } from "./use-chain";
import { useDeployment } from "./use-deployment";
import { useDeployments } from "./use-deployments";

export const useGasTokenForDeployment = (deploymentId: string | undefined) => {
  const { deployments } = useDeployments();
  const deploymentIndex = deployments.findIndex((x) => x.id === deploymentId);
  const deployment = deployments[deploymentIndex];
  if (!deployment) {
    return null;
  }
  return getNativeTokenForDeployment(deployment);
};

export const useGasToken = () => {
  const deployment = useDeployment();
  return useGasTokenForDeployment(deployment?.id);
};

export function useApproveGasToken(
  refreshAllowance: () => void,
  refreshTx: () => void
) {
  const { writeContractAsync } = useWriteContract();
  const config = useConfig();
  const [isLoading, setIsLoading] = useState(false);
  const gasToken = useGasToken();
  const from = useFromChain();
  const deployment = useDeployment();

  return {
    write: async () => {
      const baseGasToken = gasToken?.[from?.id ?? 0];
      if (!baseGasToken || !deployment) return;
      setIsLoading(true);
      try {
        const hash = await writeContractAsync({
          abi: erc20Abi,
          address: baseGasToken.address,
          args: [
            isArbitrum(deployment)
              ? (deployment.contractAddresses.inbox as Address)
              : (deployment.contractAddresses.optimismPortal as Address),
            maxUint256,
          ],
          functionName: "approve",
          chainId: from?.id,
        });
        const receipt = await waitForTransactionReceipt(config, {
          hash,
          chainId: from?.id,
        });
        refreshAllowance();
        refreshTx();
        setTimeout(() => {
          refreshAllowance();
          refreshTx();
        }, 200);
      } catch {
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    },
    isLoading,
  };
}
