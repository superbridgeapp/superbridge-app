import { useState } from "react";
import { Address, Chain } from "viem";
import { useAccount, useNetwork, useWalletClient } from "wagmi";

import { useBridgeControllerGetArbitrumFinaliseTransaction } from "@/codegen";
import { ArbitrumWithdrawalDto } from "@/codegen/model";
import { ArbitrumMessageStatus } from "@/constants/arbitrum-message-status";
import { usePendingTransactions } from "@/state/pending-txs";

import { useSwitchChain } from "../use-switch-chain";

export function useFinaliseArbitrum({
  id,
  status,
  deployment,
}: ArbitrumWithdrawalDto) {
  const account = useAccount();
  const wallet = useWalletClient();
  const setFinalising = usePendingTransactions.useSetFinalising();
  const finaliseTransaction = useBridgeControllerGetArbitrumFinaliseTransaction(
    id,
    {
      query: { enabled: status === ArbitrumMessageStatus.CONFIRMED },
    }
  );
  const switchChain = useSwitchChain();
  const { chain: activeChain } = useNetwork();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onFinalise = async () => {
    if (!account.address || !wallet.data || !finaliseTransaction.data?.data) {
      return;
    }

    if (activeChain && activeChain.id !== deployment.l1.id) {
      await switchChain(deployment.l1);
    }

    try {
      setLoading(true);
      setError(null);

      const hash = await wallet.data.sendTransaction({
        to: finaliseTransaction.data.data.to as Address,
        data: finaliseTransaction.data.data.data as Address,
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
        setError(e);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    onFinalise,
    loading,
    error,
    disabled: !finaliseTransaction.data?.data,
  };
}
