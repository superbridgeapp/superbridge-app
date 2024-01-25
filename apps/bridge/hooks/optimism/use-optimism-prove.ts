import { useState } from "react";
import { Address, Chain } from "viem";
import {
  useAccount,
  useChainId,
  useNetwork,
  usePublicClient,
  useWalletClient,
} from "wagmi";

import { useBridgeControllerGetProveTransactionV2 } from "@/codegen";
import { BridgeWithdrawalDto } from "@/codegen/model";
import { MessageStatus } from "@/constants";
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
  const proveTransaction = useBridgeControllerGetProveTransactionV2(id, {
    query: { enabled: status === MessageStatus.READY_TO_PROVE },
  });
  const switchChain = useSwitchChain();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onProve = async () => {
    if (!account.address || !wallet.data || !proveTransaction.data?.data) {
      return;
    }

    if (activeChain && activeChain.id !== deployment.l1.id) {
      await switchChain(deployment.l1);
    }

    try {
      setLoading(true);
      setError(null);

      const hash = await wallet.data.sendTransaction({
        to: proveTransaction.data.data.to as Address,
        data: proveTransaction.data.data.data as Address,
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
    disabled: !proveTransaction.data?.data,
  };
}
