import { useState } from "react";
import { Address, Chain } from "viem";
import { useAccount, useNetwork, useWalletClient } from "wagmi";

import { useBridgeControllerGetCctpMintTransaction } from "@/codegen";
import { CctpBridgeDto } from "@/codegen/model";
import { usePendingTransactions } from "@/state/pending-txs";

import { useSwitchChain } from "./use-switch-chain";

export function useMintCctp({ id, to }: CctpBridgeDto) {
  const account = useAccount();
  const wallet = useWalletClient();
  const setFinalising = usePendingTransactions.useSetFinalising();
  const finaliseTransaction = useBridgeControllerGetCctpMintTransaction(id, {});
  const switchChain = useSwitchChain();
  const { chain: activeChain } = useNetwork();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const write = async () => {
    if (!account.address || !wallet.data || !finaliseTransaction.data?.data) {
      return;
    }

    if (activeChain && activeChain.id !== to.id) {
      await switchChain(to);
    }

    try {
      setLoading(true);
      setError(null);

      const hash = await wallet.data.sendTransaction({
        to: finaliseTransaction.data.data.to as Address,
        data: finaliseTransaction.data.data.data as Address,
        chain: to as unknown as Chain,
      });
      setFinalising(id, hash);
    } catch (e: any) {
      console.log(e);
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  return {
    write,
    loading,
    error,
  };
}
