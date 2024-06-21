import { useProgressRows } from "@/utils/progress-rows";

import { useTransactions } from "./use-transactions";
import { useStatusCheck } from "./use-status-check";

export const useHasPendingAction = () => {
  const { transactions } = useTransactions();
  const progressRows = useProgressRows();
  const statusCheck = useStatusCheck();

  return statusCheck
    ? 0
    : !!transactions.find((x) => {
        if (x.type === "across-bridge") {
          return false;
        }
        const rows = progressRows(x);
        return !!rows.find((x) => x.buttonComponent);
      });
};
