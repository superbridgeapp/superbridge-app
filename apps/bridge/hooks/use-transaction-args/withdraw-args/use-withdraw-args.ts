import { useConfigState } from "@/state/config";
import { useArbitrumWithdrawArgs } from "./use-arbitrum-withdraw-args";
import { useOptimismWithdrawArgs } from "./use-optimism-withdraw-args";

export const useWithdrawArgs = () => {
  const withdrawing = useConfigState.useWithdrawing();

  const optimism = useOptimismWithdrawArgs();
  const arbitrum = useArbitrumWithdrawArgs();

  if (!withdrawing) {
    return;
  }

  return optimism || arbitrum;
};
