import { usePendingTransactions } from "@/state/pending-txs";
import {
  isArbitrumDeposit,
  isArbitrumForcedWithdrawal,
  isArbitrumWithdrawal,
  isOptimismForcedWithdrawal,
  isOptimismWithdrawal,
} from "@/utils/guards";
import { arbitrumWithdrawalProgressRows } from "@/utils/progress-rows/arbitrum-withdrawal";
import {
  arbitrumForcedWithdrawalProgressRows,
  optimismForcedWithdrawalProgressRows,
} from "@/utils/progress-rows/forced-withdrawal";
import { withdrawalProgressRows } from "@/utils/progress-rows/withdrawal";

import { useTransactions } from "./use-transactions";
import { arbitrumDepositProgressRows } from "@/utils/progress-rows/arbitrum-deposit";

export const useHasPendingAction = () => {
  const { transactions } = useTransactions();
  const pendingFinalises = usePendingTransactions.usePendingFinalises();
  const pendingProves = usePendingTransactions.usePendingProves();

  return !!transactions.find((x) => {
    if (isOptimismWithdrawal(x)) {
      const pendingActions = withdrawalProgressRows(
        x,
        pendingProves,
        pendingFinalises
      );
      if (pendingActions.find((x) => !!x.buttonComponent)) return true;
    }
    if (isOptimismForcedWithdrawal(x)) {
      const pendingActions = optimismForcedWithdrawalProgressRows(
        x,
        pendingProves,
        pendingFinalises
      );
      if (pendingActions.find((x) => !!x.buttonComponent)) return true;
    }
    if (isArbitrumWithdrawal(x)) {
      const pendingActions = arbitrumWithdrawalProgressRows(
        x,
        pendingFinalises
      );
      if (pendingActions.find((x) => !!x.buttonComponent)) return true;
    }
    if (isArbitrumForcedWithdrawal(x)) {
      const pendingActions = arbitrumForcedWithdrawalProgressRows(
        x,
        pendingFinalises
      );
      if (pendingActions.find((x) => !!x.buttonComponent)) return true;
    }
    if (isArbitrumDeposit(x)) {
      const pendingActions = arbitrumDepositProgressRows(x);
      if (pendingActions.find((x) => !!x.buttonComponent)) return true;
    }
    return false;
  });
};
