import { useStatusCheck } from "@/hooks/use-status-check";
import { useTransactions } from "@/hooks/use-transactions";
import { usePendingTransactions } from "@/state/pending-txs";
import {
  isCctpBridge,
  isDeposit,
  isForcedWithdrawal,
  isWithdrawal,
} from "@/utils/guards";

export const useInProgressTxCount = () => {
  const pendingTransactions = usePendingTransactions.useTransactions();
  const { transactions } = useTransactions();
  const statusCheck = useStatusCheck();

  return statusCheck
    ? 0
    : transactions.filter((x) => {
        if (isDeposit(x)) return !x.relay;
        if (isWithdrawal(x)) return !x.finalise;
        if (isForcedWithdrawal(x)) return !x.withdrawal?.finalise;
        if (isCctpBridge(x)) return !x.relay;
      }).length + pendingTransactions.length;
};
