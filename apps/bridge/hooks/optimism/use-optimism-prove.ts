import { useState } from "react";
import { Address, Chain } from "viem";
import { useAccount, useWalletClient } from "wagmi";

import { useBridgeControllerGetProveTransaction } from "@/codegen";
import { BridgeWithdrawalDto } from "@/codegen/model";
import { usePendingTransactions } from "@/state/pending-txs";
import { useConfigState } from "@/state/config";

import { useSwitchChain } from "../use-switch-chain";
import { useFaultProofUpgradeTime } from "../use-fault-proof-upgrade-time";

export function useProveOptimism({ id, deployment }: BridgeWithdrawalDto) {
  const account = useAccount();
  const wallet = useWalletClient();
  const setProving = usePendingTransactions.useSetProving();
  const removeProving = usePendingTransactions.useRemoveProving();
  const setBlockProvingModal = useConfigState.useSetBlockProvingModal();
  const getProveTransaction = useBridgeControllerGetProveTransaction();
  const switchChain = useSwitchChain();
  const faultProofUpgradeTime = useFaultProofUpgradeTime(deployment);

  const [loading, setLoading] = useState(false);

  const onProve = async () => {
    if (faultProofUpgradeTime) {
      setBlockProvingModal(true);
      return;
    }

    if (!account.address || !wallet.data) {
      return;
    }

    if (account.chainId !== deployment.l1.id) {
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
