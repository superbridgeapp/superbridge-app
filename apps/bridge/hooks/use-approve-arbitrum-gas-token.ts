import { waitForTransactionReceipt } from "@wagmi/core";
import { useState } from "react";
import { Address, erc20Abi, maxUint256 } from "viem";
import { useConfig, useWriteContract } from "wagmi";

import { useConfigState } from "@/state/config";
import { getArbitrumNativeTokenForDeployment } from "@/utils/get-arbitrum-native-token";
import { isArbitrum } from "@/utils/is-mainnet";

import { useFromChain } from "./use-chain";
import { useDeployment } from "./use-deployment";
import { useDeployments } from "./use-deployments";

export const useArbitrumGasTokenForDeployment = (
  deploymentId: string | undefined
) => {
  const { deployments } = useDeployments();
  const deploymentIndex = deployments.findIndex((x) => x.id === deploymentId);
  const deployment = deployments[deploymentIndex];
  if (!deployment) {
    return null;
  }
  return getArbitrumNativeTokenForDeployment(deployment);
};

export const useArbitrumGasToken = () => {
  const deployment = useDeployment();
  return useArbitrumGasTokenForDeployment(deployment?.id);
};

export function useApproveArbitrumGasToken(
  refreshAllowance: () => void,
  refreshTx: () => void
) {
  const { writeContractAsync } = useWriteContract();
  const config = useConfig();
  const [isLoading, setIsLoading] = useState(false);
  const gasToken = useArbitrumGasToken();
  const from = useFromChain();
  const deployment = useDeployment();

  return {
    write: async () => {
      const baseGasToken = gasToken?.[from?.id ?? 0];
      if (!baseGasToken || !deployment || !isArbitrum(deployment)) return;
      setIsLoading(true);
      try {
        const hash = await writeContractAsync({
          abi: erc20Abi,
          address: baseGasToken.address,
          args: [deployment.contractAddresses.inbox as Address, maxUint256],
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
