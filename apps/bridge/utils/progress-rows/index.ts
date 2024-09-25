import { useTxDeployment } from "@/hooks/activity/use-tx-deployment";
import { Transaction } from "@/types/transaction";
import { useArbitrumDepositProgressRows } from "@/utils/progress-rows/arbitrum-deposit";
import { useArbitrumWithdrawalProgressRows } from "@/utils/progress-rows/arbitrum-withdrawal";
import { useCctpProgressRows } from "@/utils/progress-rows/cctp";
import { useOptimismDepositProgressRows } from "@/utils/progress-rows/deposit";
import { useOptimismForcedWithdrawalProgressRows } from "@/utils/progress-rows/forced-withdrawal";
import { useOptimismWithdrawalProgressRows } from "@/utils/progress-rows/withdrawal";

import { isOptimismWithdrawal } from "../guards";
import { useAcrossProgressRows } from "./across";
import { useHyperlaneProgressRows } from "./hyperlane";
import { useLzProgressRows } from "./lz";

export const useProgressRows = (tx: Transaction | null) => {
  const deployment = useTxDeployment(tx);

  const optimismDeposit = useOptimismDepositProgressRows(tx, deployment);
  const optimismWithdrawal = useOptimismWithdrawalProgressRows(
    tx && isOptimismWithdrawal(tx) ? tx : null,
    deployment
  );
  const optimismForcedWithdrawal = useOptimismForcedWithdrawalProgressRows(
    tx,
    deployment
  );
  const arbitrumDeposit = useArbitrumDepositProgressRows(tx, deployment);
  const arbitrumWithdrawal = useArbitrumWithdrawalProgressRows(tx, deployment);
  const cctp = useCctpProgressRows(tx);
  const across = useAcrossProgressRows(tx);
  const hyperlaneProgressRows = useHyperlaneProgressRows(tx);
  const lzProgressRows = useLzProgressRows(tx);

  return (
    arbitrumDeposit ||
    arbitrumWithdrawal ||
    optimismDeposit ||
    optimismWithdrawal ||
    optimismForcedWithdrawal ||
    cctp ||
    across ||
    hyperlaneProgressRows ||
    lzProgressRows
  );
};
