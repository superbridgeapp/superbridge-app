import { useState } from "react";
import { Address } from "viem";
import { useAccount, useWalletClient, useWriteContract } from "wagmi";

import { ArbRetryableTxAbi } from "@/abis/arbitrum/ArbRetryableTx";
import {
  ArbitrumDepositRetryableDto,
  ArbitrumForcedWithdrawalDto,
} from "@/codegen/model";
import { usePendingTransactions } from "@/state/pending-txs";
import { isArbitrumDeposit } from "@/utils/guards";

import { useDeploymentById } from "../use-deployment-by-id";

export function useRedeemArbitrum(
  tx: ArbitrumDepositRetryableDto | ArbitrumForcedWithdrawalDto
) {
  const account = useAccount();
  const wallet = useWalletClient();
  const { writeContractAsync } = useWriteContract();
  const setFinalising = usePendingTransactions.useSetFinalising();
  const removeFinalising = usePendingTransactions.useRemoveFinalising();

  const deployment = useDeploymentById(
    isArbitrumDeposit(tx) ? tx.deploymentId : tx.deposit.deploymentId
  );
  const l2TransactionHash = isArbitrumDeposit(tx)
    ? tx.l2TransactionHash
    : tx.deposit.l2TransactionHash;

  const [loading, setLoading] = useState(false);

  const onRedeem = async () => {
    if (!account.address || !wallet.data) {
      return;
    }

    try {
      setLoading(true);

      const hash = await writeContractAsync({
        abi: ArbRetryableTxAbi,
        functionName: "redeem",
        chainId: deployment?.l2.id,
        address: "0x000000000000000000000000000000000000006e",
        args: [l2TransactionHash as Address],
      });
      if (hash) {
        // rainbow just returns null if cancelled
        setFinalising(tx.id, hash);
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
      removeFinalising(tx.id);
    } finally {
      setLoading(false);
    }
  };

  return { write: onRedeem, loading };
}
