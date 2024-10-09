import { waitForTransactionReceipt } from "@wagmi/core";
import { useState } from "react";
import { Address } from "viem";
import { useConfig, useWalletClient, useWriteContract } from "wagmi";

import { useBridgeRoutes } from "../routes/use-bridge-routes";
import { useSelectedToken } from "../tokens/use-token";
import { useWeiAmount } from "../use-wei-amount";
import { useAllowance } from "./use-allowance";
import { useApprovalAddress } from "./use-approval-address";

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
  const [isLoading, setIsLoading] = useState(false);
  const wallet = useWalletClient();

  return {
    write: async () => {
      if (!token?.address) return;
      setIsLoading(true);
      try {
        await wallet.data?.sendTransaction();
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
        allowance.refetch();
        routes.refetch();
        setTimeout(() => {
          allowance.refetch();
          routes.refetch();
        }, 200);
        setIsLoading(false);
      }
    },
    isLoading,
  };
}
