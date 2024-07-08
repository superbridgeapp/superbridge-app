import { useState } from "react";
import { Address, Chain, Hex } from "viem";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";

import { useBridgeControllerGetProveTransaction } from "@/codegen";
import { BridgeWithdrawalDto } from "@/codegen/model";
import { trackEvent } from "@/services/ga";
import { useConfigState } from "@/state/config";
import { usePendingTransactions } from "@/state/pending-txs";

import { useFaultProofUpgradeTime } from "../use-fault-proof-upgrade-time";
import { useSwitchChain } from "../use-switch-chain";

export function useProveOptimism({
  id,
  deployment,
  withdrawal,
}: BridgeWithdrawalDto) {
  const account = useAccount();
  const wallet = useWalletClient({ chainId: deployment.l1.id });
  const client = usePublicClient({ chainId: deployment.l1.id });
  const setProving = usePendingTransactions.useSetProving();
  const removeProving = usePendingTransactions.useRemoveProving();
  const setBlockProvingModal = useConfigState.useSetBlockProvingModal();
  const getProveTransaction = useBridgeControllerGetProveTransaction();
  const switchChain = useSwitchChain();
  const faultProofUpgradeTime = useFaultProofUpgradeTime(deployment);

  const [loading, setLoading] = useState(false);

  const onProve = async () => {
    if (faultProofUpgradeTime) {
      setBlockProvingModal(deployment);
      return;
    }

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

      const { data: result } = await getProveTransaction.mutateAsync({
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
        chain,
        gas: gas + gas / BigInt("10"),
        ...(fees.gasPrice
          ? { gasPrice: fees.gasPrice }
          : {
              maxFeePerGas: fees.maxFeePerGas,
              maxPriorityFeePerGas: fees.maxPriorityFeePerGas,
            }),
      });
      if (hash) {
        trackEvent({
          event: "prove-withdrawal",
          network: chain.name,
          withdrawalTransactionHash: withdrawal.transactionHash,
        });
        // rainbow just returns null if cancelled
        setProving(id, hash);
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
