import { useStatusCheck } from "@/hooks/use-status-check";
import { useTransactions } from "@/hooks/use-transactions";
import { usePendingTransactions } from "@/state/pending-txs";

export const useInProgressTxCount = () => {
  const pendingTransactions = usePendingTransactions.useTransactions();
  const { inProgressCount } = useTransactions();
  const statusCheck = useStatusCheck();

  return statusCheck ? 0 : inProgressCount + pendingTransactions.length;
};
