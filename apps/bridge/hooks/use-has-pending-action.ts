import { useProgressRows } from "@/utils/progress-rows";

import { useStatusCheck } from "./use-status-check";
import { useTransactions } from "./use-transactions";

export const useHasPendingAction = () => {
  const { transactions } = useTransactions();
  const progressRows = useProgressRows();
  const statusCheck = useStatusCheck();

  return statusCheck
    ? 0
    : !!transactions.find((x) => {
        const rows = progressRows(x);
        return !!rows.find((x) => x.buttonComponent);
      });
};
