import { useState } from "react";
import { Address, Chain } from "viem";
import { useAccount, useWalletClient } from "wagmi";

import { useBridgeControllerGetCctpMintTransactionV2 } from "@/codegen";
import { CctpBridgeDto } from "@/codegen/model";
import { trackEvent } from "@/services/ga";
import { usePendingTransactions } from "@/state/pending-txs";

import { useSwitchChain } from "./use-switch-chain";

export function useMintCctp({ id, to, bridge }: CctpBridgeDto) {
  const account = useAccount();
  const wallet = useWalletClient();
  const setFinalising = usePendingTransactions.useSetFinalising();
  const removeFinalising = usePendingTransactions.useRemoveFinalising();
  const finaliseTransaction = useBridgeControllerGetCctpMintTransactionV2();
  const switchChain = useSwitchChain();

  const [loading, setLoading] = useState(false);

  const write = async () => {
    if (!account.address || !wallet.data) {
      return;
    }

    if (account.chainId !== to.id) {
      await switchChain(to);
    }

    try {
      setLoading(true);

      const data = await finaliseTransaction.mutateAsync({ data: { id } });
      const hash = await wallet.data.sendTransaction({
        to: data.data.to as Address,
        data: data.data.data as Address,
        chain: to as unknown as Chain,
      });
      if (hash) {
        trackEvent({
          event: "cctp-mint",
          network: to.name,
          burnTransactionHash: bridge.transactionHash,
        });
        // rainbow just returns null if cancelled
        setFinalising(id, hash);
      }
    } catch (e) {
      console.log(e);
      removeFinalising(id);
    } finally {
      setLoading(false);
    }
  };

  return {
    write,
    loading,
  };
}
