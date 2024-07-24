import { waitForTransactionReceipt } from "@wagmi/core";
import { useState } from "react";
import { useConfig, useWriteContract } from "wagmi";

import { getNativeTokenForDeployment } from "@/utils/get-native-token";
import { isArbitrum, isOptimism } from "@/utils/is-mainnet";

import { useApprovalAddressGasToken } from "./use-approval-address-gas-token";
import { APPROVE_ABI_WITHOUT_RETURN } from "./use-approve";
import { useFromChain } from "./use-chain";
import { useDeployment } from "./use-deployment";
import { useDeploymentById } from "./use-deployment-by-id";
import { useRequiredCustomGasTokenBalance } from "./use-required-custom-gas-token-balance";
import { useWeiAmount } from "./use-wei-amount";

export const useGasTokenForDeployment = (deploymentId: string | undefined) => {
  const deployment = useDeploymentById(deploymentId ?? "");
  if (!deployment) {
    return null;
  }
  return getNativeTokenForDeployment(deployment);
};

export const useGasToken = () => {
  const deployment = useDeployment();
  return useGasTokenForDeployment(deployment?.id);
};

const useGasTokenApprovalAmount = () => {
  const deployment = useDeployment();
  const weiAmount = useWeiAmount();
  const requiredGasTokenBalance = useRequiredCustomGasTokenBalance();

  if (deployment && isOptimism(deployment)) {
    return weiAmount;
  }

  if (deployment && isArbitrum(deployment)) {
    return requiredGasTokenBalance;
  }

  return null;
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

  const gasTokenApprovalAmount = useGasTokenApprovalAmount();

  const approvalAddress = useApprovalAddressGasToken();
  return {
    write: async () => {
      const baseGasToken = gasToken?.[from?.id ?? 0];
      if (!baseGasToken || !deployment || !approvalAddress) return;
      setIsLoading(true);
      try {
        const hash = await writeContractAsync({
          abi: APPROVE_ABI_WITHOUT_RETURN,
          address: baseGasToken.address,
          args: [approvalAddress, gasTokenApprovalAmount],
          functionName: "approve",
          chainId: from?.id,
        });
        await waitForTransactionReceipt(config, {
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
      } finally {
        setIsLoading(false);
      }
    },
    isLoading,
  };
}
