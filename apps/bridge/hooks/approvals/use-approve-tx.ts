import { encodeFunctionData } from "viem";

import { RouteResultDto, TransactionDto } from "@/codegen/model";
import { isEth } from "@/utils/tokens/is-eth";

import { useSelectedToken } from "../tokens";
import { useWeiAmount } from "../use-wei-amount";
import { useApprovalAddressForRoute } from "./use-approval-address";

// Trying to approve USDT with the vanilla Wagmi ERC20 ABI
// causes problems because it doesn't return anything
export const APPROVE_ABI_WITHOUT_RETURN = [
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "spender",
        type: "address",
      },
      {
        name: "amount",
        type: "uint256",
      },
    ],
    outputs: [
      //   {
      //     name: "",
      //     type: "bool",
      //   },
    ],
  },
] as const;

export function useApproveTx(
  route: RouteResultDto | null
): TransactionDto | null {
  const weiAmount = useWeiAmount();
  const approvalAddress = useApprovalAddressForRoute(route);
  const token = useSelectedToken();

  if (!approvalAddress || !token || isEth(token)) {
    return null;
  }

  return {
    to: token.address,
    value: "0",
    chainId: token.chainId,
    data: encodeFunctionData({
      abi: APPROVE_ABI_WITHOUT_RETURN,
      functionName: "approve",
      args: [approvalAddress, weiAmount],
    }),
  };
}
