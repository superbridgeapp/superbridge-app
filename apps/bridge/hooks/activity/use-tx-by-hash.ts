import { usePendingTransactions } from "@/state/pending-txs";

import { useTransactions } from "../use-transactions";

export const useLatestSubmittedTx = () => {
  const { transactions } = useTransactions();
  const pendingTransactions = usePendingTransactions.useTransactions();

  return pendingTransactions[0] ?? transactions[0] ?? null;
};
