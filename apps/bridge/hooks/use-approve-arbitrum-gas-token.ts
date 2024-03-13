import { waitForTransactionReceipt } from "@wagmi/core";
import { useState } from "react";
import { Address, erc20Abi, maxUint256 } from "viem";
import { useConfig, useWriteContract } from "wagmi";

import { useConfigState } from "@/state/config";
import { isArbitrum } from "@/utils/is-mainnet";

import { useFromChain } from "./use-chain";
import { useDeployments } from "./use-deployments";

export const useArbitrumGasTokenForDeployment = (
  deploymentId: string | undefined
) => {
  const nativeTokens = useConfigState.useArbitrumCustomGasTokens();
  const { deployments } = useDeployments();
  const deploymentIndex = deployments.findIndex((x) => x.id === deploymentId);
  return nativeTokens[deploymentIndex];
};

export const useArbitrumGasToken = () => {
  const deployment = useConfigState.useDeployment();
  return useArbitrumGasTokenForDeployment(deployment?.id);
};

export function useApproveArbitrumGasToken() {
  // refreshAllowance: () => void,
  // refreshTx: () => void,
  // amount: bigint
  const { writeContractAsync } = useWriteContract();
  const config = useConfig();
  const [isLoading, setIsLoading] = useState(false);
  const gasToken = useArbitrumGasToken();
  const from = useFromChain();
  const deployment = useConfigState.useDeployment();

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
        // refreshAllowance();
        // refreshTx();
        // setTimeout(() => {
        //   refreshAllowance();
        //   refreshTx();
        // }, 200);
      } catch {
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    },
    isLoading,
  };
}
