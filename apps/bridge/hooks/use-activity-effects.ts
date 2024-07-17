import { useEffect } from "react";

import { usePendingTransactions } from "@/state/pending-txs";
import {
  isForcedWithdrawal,
  isOptimismForcedWithdrawal,
  isOptimismWithdrawal,
  isWithdrawal,
} from "@/utils/guards";
import { getInitiatingHash } from "@/utils/initiating-tx-hash";

import { useTransactions } from "./use-transactions";

export const useActivityEffects = () => {
  const { transactions } = useTransactions();

  const removeFinalising = usePendingTransactions.useRemoveFinalising();
  const removeProving = usePendingTransactions.useRemoveProving();
  const removePending = usePendingTransactions.useRemoveTransactionByHash();

  useEffect(() => {
    console.log("Executing", transactions.length);

    transactions.forEach((tx) => {
      const hash = getInitiatingHash(tx);
      if (hash) removePending(hash);

      if (isWithdrawal(tx)) {
        if (isOptimismWithdrawal(tx)) if (tx.prove) removeProving(tx.id);
        if (tx.finalise) removeFinalising(tx.id);
      }
      if (isForcedWithdrawal(tx)) {
        if (isOptimismForcedWithdrawal(tx))
          if (tx.withdrawal?.prove) removeProving(tx.id);
        if (tx.withdrawal?.finalise) removeFinalising(tx.id);
      }
    });
  }, [transactions]);
};
