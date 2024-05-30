import { useConfigState } from "@/state/config";

import { useArbitrumWithdrawArgs } from "./use-arbitrum-withdraw-args";
import { useOptimismWithdrawArgs } from "./use-optimism-withdraw-args";
import { isCctpBridgeOperation } from "../cctp-args/common";

export const useWithdrawArgs = () => {
  const withdrawing = useConfigState.useWithdrawing();
  const stateToken = useConfigState.useToken();

  const optimism = useOptimismWithdrawArgs();
  const arbitrum = useArbitrumWithdrawArgs();

  if (!withdrawing || !stateToken || isCctpBridgeOperation(stateToken)) {
    return;
  }

  return optimism || arbitrum;
};
