import { waitForTransactionReceipt } from "@wagmi/core";
import { useState } from "react";
import { Address, Chain, Hex } from "viem";
import { useConfig, useWalletClient } from "wagmi";

import { useEstimateFeesPerGas } from "../gas/use-estimate-fees-per-gas";
import { useSelectedBridgeRoute } from "../routes/use-selected-bridge-route";
import { useSelectedToken } from "../tokens/use-token";
import { useTokenBalances } from "../use-balances";
import { useFromChain } from "../use-chain";
import { useAllowance } from "./use-allowance";
import { useApproveGasEstimate } from "./use-approve-gas-estimate";
import { useApproveTx } from "./use-approve-tx";

export function useApprove() {
  const route = useSelectedBridgeRoute();
  const allowance = useAllowance();
  const balances = useTokenBalances();
  const token = useSelectedToken();
  const config = useConfig();
  const [isLoading, setIsLoading] = useState(false);
  const wallet = useWalletClient();
  const from = useFromChain();
  const fees = useEstimateFeesPerGas(from?.id);

  const gasEstimate = useApproveGasEstimate();

  const tx = useApproveTx(route.data);

  return {
    write: async () => {
      if (!token?.address || !tx || !from || !wallet.data || !gasEstimate)
        return;
      setIsLoading(true);
      try {
        const hash = await wallet.data.sendTransaction({
          data: tx.data as Hex,
          to: tx.to as Address,
          chain: from as unknown as Chain,
          gas: BigInt(gasEstimate),
          ...(fees.data?.gasPrice
            ? {
                gasPrice: fees.data?.gasPrice,
              }
            : {
                maxFeePerGas: fees.data?.maxFeePerGas,
                maxPriorityFeePerGas: fees.data?.maxPriorityFeePerGas,
              }),
        });
        await waitForTransactionReceipt(config, {
          hash,
          chainId: token.chainId,
          pollingInterval: 2_000,
          timeout: 60_000,
        });
      } catch (e) {
        console.log(e);
      } finally {
        setTimeout(() => {
          allowance.refetch();
          balances.refetch();
        }, 200);
        setIsLoading(false);
      }
    },
    isLoading,
  };
}
