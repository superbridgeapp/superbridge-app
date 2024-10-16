import { waitForTransactionReceipt } from "@wagmi/core";
import { useState } from "react";
import { Address } from "viem";
import { useConfig, useWriteContract } from "wagmi";

import { useAllowance } from "./approvals/use-allowance";
import { useApprovalAddress } from "./approvals/use-approval-address";
import { useBridgeRoutes } from "./routes/use-bridge-routes";
import { useSelectedToken } from "./tokens/use-token";
import { useEthBalance } from "./use-balances";
import { useWeiAmount } from "./use-wei-amount";

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
];

export function useApprove() {
  const routes = useBridgeRoutes();
  const allowance = useAllowance();
  const token = useSelectedToken();
  const weiAmount = useWeiAmount();
  const approvalAddress = useApprovalAddress();
  const { writeContractAsync } = useWriteContract();
  const config = useConfig();
  const ethBalance = useEthBalance();
  const [isLoading, setIsLoading] = useState(false);

  return {
    write: async () => {
      if (!token?.address) return;
      setIsLoading(true);
      try {
        const hash = await writeContractAsync({
          abi: APPROVE_ABI_WITHOUT_RETURN,
          address: token.address as Address,
          args: [approvalAddress, weiAmount],
          functionName: "approve",
          chainId: token?.chainId,
        });
        await waitForTransactionReceipt(config, {
          hash,
          chainId: token.chainId,
          pollingInterval: 5_000,
          timeout: 60_000,
        });
      } catch (e) {
        console.log(e);
      } finally {
        setTimeout(() => {
          routes.refetch();
          allowance.refetch();
          ethBalance.refetch();
        }, 200);
        setIsLoading(false);
      }
    },
    isLoading,
  };
}
