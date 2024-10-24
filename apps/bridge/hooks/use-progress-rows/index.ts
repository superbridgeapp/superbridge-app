import { useTxDeployment } from "@/hooks/activity/use-tx-deployment";
import { useArbitrumDepositProgressRows } from "@/hooks/use-progress-rows/arbitrum-deposit";
import { useArbitrumWithdrawalProgressRows } from "@/hooks/use-progress-rows/arbitrum-withdrawal";
import { useCctpProgressRows } from "@/hooks/use-progress-rows/cctp";
import { useOptimismDepositProgressRows } from "@/hooks/use-progress-rows/deposit";
import { useOptimismForcedWithdrawalProgressRows } from "@/hooks/use-progress-rows/forced-withdrawal";
import { useOptimismWithdrawalProgressRows } from "@/hooks/use-progress-rows/withdrawal";
import { Transaction } from "@/types/transaction";

import { isOptimismWithdrawal } from "../../utils/guards";
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
    optimismForcedWithdrawal ||
    optimismDeposit ||
    optimismWithdrawal ||
    cctp ||
    across ||
    hyperlaneProgressRows ||
    lzProgressRows
  );
};
