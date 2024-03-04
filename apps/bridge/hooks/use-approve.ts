import { useEffect } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

import { Token } from "@/types/token";

// Trying to approve USDT with the vanilla Wagmi ERC20 ABI
// causes problems because it doesn't return anything
const APPROVE_ABI_WITHOUT_RETURN = [
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

export function useApprove(
  token: Token | null,
  contract: string | undefined,
  refreshAllowance: () => void,
  refreshTx: () => void,
  amount: bigint
) {
  const { writeContract, data: hash, isLoading: writing } = useWriteContract();
  const { isFetching: waiting, data: receipt } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (receipt) {
      refreshAllowance();
      refreshTx();
      setTimeout(() => {
        refreshAllowance();
        refreshTx();
      }, 200);
    }
  }, [receipt]);

  return {
    write: () => {
      if (!token?.address) return;
      return writeContract({
        abi: APPROVE_ABI_WITHOUT_RETURN,
        address: token?.address,
        args: [contract, amount],
        functionName: "approve",
        chainId: token?.chainId,
      });
    },
    isLoading: writing || waiting,
  };
}
