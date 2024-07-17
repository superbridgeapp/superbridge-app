import { useStatusCheck } from "./use-status-check";
import { useTransactions } from "./use-transactions";

export const useHasPendingAction = () => {
  const { actionRequiredCount } = useTransactions();
  const statusCheck = useStatusCheck();

  return statusCheck ? false : actionRequiredCount > 0;
};
