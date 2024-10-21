import { Address, Hex, encodeFunctionData } from "viem";

import { RouteResultDto } from "@/codegen/model";

import { useCustomGasTokenAddress } from "../custom-gas-token/use-custom-gas-token-address";
import { useDeployment } from "../deployments/use-deployment";
import { APPROVE_ABI_WITHOUT_RETURN } from "../use-approve";
import { useFromChain } from "../use-chain";
import { useRequiredCustomGasTokenBalance } from "../use-required-custom-gas-token-balance";
import { useGasTokenApproveAddressForRoute } from "./use-approval-address-gas-token";

export function useApproveGasTokenTx(
  route: RouteResultDto | null
): { chainId: number; data: Hex; to: Address; value?: string } | null {
  const deployment = useDeployment();
  const gasTokenAddress = useCustomGasTokenAddress(deployment?.id);
  const from = useFromChain();
  const gasTokenApprovalAmount = useRequiredCustomGasTokenBalance();
  const approvalAddress = useGasTokenApproveAddressForRoute(route);

  if (!gasTokenAddress || !approvalAddress || !from || !gasTokenApprovalAmount)
    return null;

  return {
    data: encodeFunctionData({
      abi: APPROVE_ABI_WITHOUT_RETURN,
      args: [approvalAddress, gasTokenApprovalAmount],
      functionName: "approve",
    }),
    to: gasTokenAddress,
    chainId: from.id,
  };
}
