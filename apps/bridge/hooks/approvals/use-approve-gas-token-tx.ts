import { Address, encodeFunctionData } from "viem";

import { RouteResultDto, TransactionDto } from "@/codegen/model";
import { isArbitrum, isOptimism } from "@/utils/deployments/is-mainnet";

import { useCustomGasTokenAddress } from "../custom-gas-token/use-custom-gas-token-address";
import { useDeployment } from "../deployments/use-deployment";
import { APPROVE_ABI_WITHOUT_RETURN } from "../use-approve";
import { useFromChain } from "../use-chain";
import { useRequiredCustomGasTokenBalance } from "../use-required-custom-gas-token-balance";
import { useWeiAmount } from "../use-wei-amount";
import { useGasTokenApproveAddressForRoute } from "./use-approval-address-gas-token";

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

export function useApproveGasTokenTx(
  route: RouteResultDto | null
): TransactionDto | null {
  const deployment = useDeployment();
  const gasTokenAddress = useCustomGasTokenAddress(deployment?.id);
  const from = useFromChain();

  const gasTokenApprovalAmount = useGasTokenApprovalAmount();

  const approvalAddress = useGasTokenApproveAddressForRoute(route);
  if (!gasTokenAddress || !deployment || !approvalAddress || !from) return null;

  return {
    data: encodeFunctionData({
      abi: APPROVE_ABI_WITHOUT_RETURN,
      args: [approvalAddress, gasTokenApprovalAmount],
      functionName: "approve",
    }),
    to: gasTokenAddress as Address,
    chainId: from?.id,
  };
}
