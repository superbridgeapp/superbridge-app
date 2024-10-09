import { waitForTransactionReceipt } from "@wagmi/core";
import { useState } from "react";
import { Address } from "viem";
import { useConfig, useWriteContract } from "wagmi";

import { isArbitrum, isOptimism } from "@/utils/deployments/is-mainnet";

import { useCustomGasTokenAddress } from "../custom-gas-token/use-custom-gas-token-address";
import { useDeployment } from "../deployments/use-deployment";
import { useBridgeRoutes } from "../routes/use-bridge-routes";
import { APPROVE_ABI_WITHOUT_RETURN } from "../use-approve";
import { useFromChain } from "../use-chain";
import { useRequiredCustomGasTokenBalance } from "../use-required-custom-gas-token-balance";
import { useWeiAmount } from "../use-wei-amount";
import { useApprovalAddressGasToken } from "./use-approval-address-gas-token";

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

export function useApproveGasToken(refreshAllowance: () => void) {
  const routes = useBridgeRoutes();
  const { writeContractAsync } = useWriteContract();
  const config = useConfig();
  const [isLoading, setIsLoading] = useState(false);
  const deployment = useDeployment();
  const gasTokenAddress = useCustomGasTokenAddress(deployment?.id);
  const from = useFromChain();

  const gasTokenApprovalAmount = useGasTokenApprovalAmount();

  const approvalAddress = useApprovalAddressGasToken();
  return {
    write: async () => {
      if (!gasTokenAddress || !deployment || !approvalAddress) return;
      setIsLoading(true);
      try {
        const hash = await writeContractAsync({
          abi: APPROVE_ABI_WITHOUT_RETURN,
          address: gasTokenAddress as Address,
          args: [approvalAddress, gasTokenApprovalAmount],
          functionName: "approve",
          chainId: from?.id,
        });
        await waitForTransactionReceipt(config, {
          hash,
          chainId: from?.id,
        });
        refreshAllowance();
        routes.refetch();
        setTimeout(() => {
          refreshAllowance();
          routes.refetch();
        }, 200);
      } catch {
      } finally {
        setIsLoading(false);
      }
    },
    isLoading,
  };
}
