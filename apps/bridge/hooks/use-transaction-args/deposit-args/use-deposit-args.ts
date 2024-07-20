import { useIsWithdrawal } from "@/hooks/use-withdrawing";
import { useConfigState } from "@/state/config";
import { isCctp } from "@/utils/is-cctp";

import { useArbitrumDepositArgs } from "./use-arbitrum-deposit-args";
import { useOptimismDepositArgs } from "./use-optimism-deposit-args";

export const useDepositArgs = () => {
  const withdrawing = useIsWithdrawal();
  const stateToken = useConfigState.useToken();

  const optimism = useOptimismDepositArgs();
  const arbitrum = useArbitrumDepositArgs();

  if (withdrawing || !stateToken || isCctp(stateToken)) {
    return;
  }

  return optimism || arbitrum;
};
