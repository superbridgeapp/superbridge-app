import { waitForTransactionReceipt } from "@wagmi/core";
import { useState } from "react";
import { useConfig, useWriteContract } from "wagmi";

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
  const { writeContractAsync } = useWriteContract();
  const config = useConfig();
  const [isLoading, setIsLoading] = useState(false);

  return {
    write: async () => {
      if (!token?.address) return;
      setIsLoading(true);
      try {
        const hash = await writeContractAsync({
          abi: APPROVE_ABI_WITHOUT_RETURN,
          address: token?.address,
          args: [contract, amount],
          functionName: "approve",
          chainId: token?.chainId,
        });
        const receipt = await waitForTransactionReceipt(config, {
          hash,
          chainId: token.chainId,
        });
        refreshAllowance();
        refreshTx();
        setTimeout(() => {
          refreshAllowance();
          refreshTx();
        }, 200);
      } catch {
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    },
    isLoading,
  };
}
