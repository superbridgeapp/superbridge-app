import { useState } from "react";
import { Address, Chain } from "viem";
import { useAccount, useWalletClient } from "wagmi";

import { useBridgeControllerGetProveTransaction } from "@/codegen";
import { BridgeWithdrawalDto } from "@/codegen/model";
import { usePendingTransactions } from "@/state/pending-txs";

import { useSwitchChain } from "../use-switch-chain";

export function useProveOptimism({ id, deployment }: BridgeWithdrawalDto) {
  const account = useAccount();
  const wallet = useWalletClient();
  const setProving = usePendingTransactions.useSetProving();
  const removeProving = usePendingTransactions.useRemoveProving();
  const getProveTransaction = useBridgeControllerGetProveTransaction();
  const switchChain = useSwitchChain();

  const [loading, setLoading] = useState(false);

  const onProve = async () => {
    if (!account.address || !wallet.data) {
      return;
    }

    if (account.chain && account.chain.id !== deployment.l1.id) {
      await switchChain(deployment.l1);
    }

    try {
      setLoading(true);
      const { data } = await getProveTransaction.mutateAsync({ data: { id } });
      const hash = await wallet.data.sendTransaction({
        to: data.to as Address,
        data: data.data as Address,
        chain: deployment.l1 as unknown as Chain,
      });
      if (hash) {
        // rainbow just returns null if cancelled
        setProving(id, hash);
      }
    } catch (e: any) {
      if (
        e.message.includes("rejected the request") ||
        e.message.includes("denied transaction signature")
      ) {
        // no error
      } else {
        console.log(e);
      }
      removeProving(id);
    } finally {
      setLoading(false);
    }
  };

  return {
    onProve,
    loading,
  };
}
