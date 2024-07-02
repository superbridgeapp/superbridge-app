import { useState } from "react";
import { Address, Chain, Hex } from "viem";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";

import { useBridgeControllerGetFinaliseTransaction } from "@/codegen";
import { BridgeWithdrawalDto } from "@/codegen/model";
import { usePendingTransactions } from "@/state/pending-txs";

import { useSwitchChain } from "../use-switch-chain";

export function useFinaliseOptimism({ id, deployment }: BridgeWithdrawalDto) {
  const account = useAccount();
  const wallet = useWalletClient({ chainId: deployment.l1.id });
  const client = usePublicClient({ chainId: deployment.l1.id });
  const setFinalising = usePendingTransactions.useSetFinalising();
  const removeFinalising = usePendingTransactions.useRemoveFinalising();
  const getFinaliseTransaction = useBridgeControllerGetFinaliseTransaction();
  const switchChain = useSwitchChain();

  const [loading, setLoading] = useState(false);

  const onFinalise = async () => {
    if (!account.address || !wallet.data || !client) {
      return;
    }

    if (
      account.chainId !== deployment.l1.id ||
      wallet.data.chain.id !== deployment.l1.id
    ) {
      await switchChain(deployment.l1);
    }

    try {
      setLoading(true);

      const { data: result } = await getFinaliseTransaction.mutateAsync({
        data: { id },
      });

      const to = result.to as Address;
      const data = result.data as Hex;

      const chain = deployment.l1 as unknown as Chain;
      const [gas, fees] = await Promise.all([
        client.estimateGas({
          to,
          data,
        }),
        client.estimateFeesPerGas({
          chain,
        }),
      ]);

      const hash = await wallet.data.sendTransaction({
        to,
        data,
        chain: deployment.l1 as unknown as Chain,
        gas: gas + gas / BigInt("10"),
        ...(fees.gasPrice
          ? { gasPrice: fees.gasPrice }
          : {
              maxFeePerGas: fees.maxFeePerGas,
              maxPriorityFeePerGas: fees.maxPriorityFeePerGas,
            }),
      });
      if (hash) {
        // rainbow just returns null if cancelled
        setFinalising(id, hash);
      }
    } catch (e) {
      if (
        e.message.includes("rejected the request") ||
        e.message.includes("denied transaction signature")
      ) {
        // no error
      } else {
        console.log(e);
      }
      removeFinalising(id);
    } finally {
      setLoading(false);
    }
  };

  return {
    onFinalise,
    loading,
  };
}
