import { useProgressRows } from "@/utils/progress-rows";

import { useTransactions } from "./use-transactions";

export const useHasPendingAction = () => {
  const { transactions } = useTransactions();
  const progressRows = useProgressRows();

  return !!transactions.find((x) => {
    const rows = progressRows(x);
    return !!rows.find((x) => x.buttonComponent);
  });
};
