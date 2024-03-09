import { waitForTransactionReceipt } from "@wagmi/core";
import { useState } from "react";
import { Address, erc20Abi, maxUint256 } from "viem";
import { useConfig, useWriteContract } from "wagmi";

import { useConfigState } from "@/state/config";
import { Token } from "@/types/token";

import { useArbitrumNativeTokens } from "./arbitrum/use-arbitrum-native-tokens";
import { useFromChain } from "./use-chain";
import { useDeployments } from "./use-deployments";
import { isArbitrum } from "@/utils/is-mainnet";

export const useArbitrumGasToken = () => {
  const nativeTokens = useArbitrumNativeTokens();
  const { deployments } = useDeployments();
  const deployment = useConfigState.useDeployment();

  const deploymentIndex = deployments.findIndex((x) => x.id === deployment?.id);

  return nativeTokens[deploymentIndex];
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
