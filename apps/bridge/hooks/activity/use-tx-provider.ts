import { RouteProvider } from "@/codegen/model";
import { Transaction } from "@/types/transaction";
import {
  isAcrossBridge,
  isArbitrumDeposit,
  isArbitrumWithdrawal,
  isOptimismDeposit,
  isOptimismForcedWithdrawal,
  isOptimismWithdrawal,
} from "@/utils/guards";

export const useTxProvider = (tx: Transaction | undefined | null) => {
  if (!tx) return null;
  if (isArbitrumDeposit(tx)) return RouteProvider.ArbitrumDeposit;
  if (isArbitrumWithdrawal(tx)) return RouteProvider.ArbitrumWithdrawal;
  if (isOptimismDeposit(tx)) return RouteProvider.OptimismDeposit;
  if (isOptimismWithdrawal(tx)) return RouteProvider.OptimismWithdrawal;
  if (isOptimismForcedWithdrawal(tx))
    return RouteProvider.OptimismForcedWithdrawal;
  if (isAcrossBridge(tx)) return RouteProvider.Across;
  return RouteProvider.Hyperlane;
};
