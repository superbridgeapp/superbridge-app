import { useConfigState } from "@/state/config";

import { useArbitrumDepositArgs } from "./use-arbitrum-deposit-args";
import { useOptimismDepositArgs } from "./use-optimism-deposit-args";

export const useDepositArgs = () => {
  const optimism = useOptimismDepositArgs();
  const arbitrum = useArbitrumDepositArgs();

  const withdrawing = useConfigState.useWithdrawing();

  if (withdrawing) {
    return;
  }

  return optimism || arbitrum;
};
