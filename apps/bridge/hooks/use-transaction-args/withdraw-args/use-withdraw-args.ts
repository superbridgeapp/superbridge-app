import { useConfigState } from "@/state/config";
import { isCctp } from "@/utils/is-cctp";

import { useArbitrumWithdrawArgs } from "./use-arbitrum-withdraw-args";
import { useOptimismWithdrawArgs } from "./use-optimism-withdraw-args";

export const useWithdrawArgs = () => {
  const withdrawing = useConfigState.useWithdrawing();
  const stateToken = useConfigState.useToken();

  const optimism = useOptimismWithdrawArgs();
  const arbitrum = useArbitrumWithdrawArgs();

  if (!withdrawing || !stateToken || isCctp(stateToken)) {
    return;
  }

  return optimism || arbitrum;
};
