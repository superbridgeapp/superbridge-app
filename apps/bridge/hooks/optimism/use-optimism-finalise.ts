import { useState } from "react";
import { Address, Chain } from "viem";
import { useAccount, useWalletClient } from "wagmi";

import { useBridgeControllerGetFinaliseTransaction } from "@/codegen";
import { BridgeWithdrawalDto } from "@/codegen/model";
import { usePendingTransactions } from "@/state/pending-txs";

import { useSwitchChain } from "../use-switch-chain";

export function useFinaliseOptimism({ id, deployment }: BridgeWithdrawalDto) {
  const account = useAccount();
  const wallet = useWalletClient();
  const setFinalising = usePendingTransactions.useSetFinalising();
  const removeFinalising = usePendingTransactions.useRemoveFinalising();

  const getFinaliseTransaction = useBridgeControllerGetFinaliseTransaction();

  const switchChain = useSwitchChain();

  const [loading, setLoading] = useState(false);

  const onFinalise = async () => {
    if (!account.address || !wallet.data) {
      return;
    }

    if (account.chain && account.chain.id !== deployment.l1.id) {
      await switchChain(deployment.l1);
    }

    try {
      setLoading(true);

      const { data } = await getFinaliseTransaction.mutateAsync({
        data: { id },
      });
      const hash = await wallet.data.sendTransaction({
        to: data.to as Address,
        data: data.data as Address,
        chain: deployment.l1 as unknown as Chain,
      });
      setFinalising(id, hash);
    } catch (e: any) {
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
