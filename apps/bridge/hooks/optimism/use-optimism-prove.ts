import { useState } from "react";
import { Address, Chain } from "viem";
import { useAccount, useNetwork, useWalletClient } from "wagmi";

import { useBridgeControllerGetProveTransaction } from "@/codegen";
import { BridgeWithdrawalDto } from "@/codegen/model";
import { usePendingTransactions } from "@/state/pending-txs";

import { useSwitchChain } from "../use-switch-chain";

export function useProveOptimism({
  id,
  status,
  deployment,
}: BridgeWithdrawalDto) {
  const account = useAccount();
  const wallet = useWalletClient();
  const { chain: activeChain } = useNetwork();
  const setProving = usePendingTransactions.useSetProving();
  const getProveTransaction = useBridgeControllerGetProveTransaction();
  const switchChain = useSwitchChain();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onProve = async () => {
    if (!account.address || !wallet.data) {
      return;
    }

    if (activeChain && activeChain.id !== deployment.l1.id) {
      await switchChain(deployment.l1);
    }

    try {
      setLoading(true);
      setError(null);
      const { data } = await getProveTransaction.mutateAsync({ data: { id } });
      const hash = await wallet.data.sendTransaction({
        to: data.to as Address,
        data: data.data as Address,
        chain: deployment.l1 as unknown as Chain,
      });
      setProving(id, hash);
    } catch (e: any) {
      if (
        e.message.includes("rejected the request") ||
        e.message.includes("denied transaction signature")
      ) {
        // no error
      } else {
        console.log(e);
        setError(e);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    onProve,
    loading,
    error,
  };
}
