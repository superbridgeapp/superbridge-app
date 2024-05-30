import { useConfigState } from "@/state/config";

import { useArbitrumDepositArgs } from "./use-arbitrum-deposit-args";
import { useOptimismDepositArgs } from "./use-optimism-deposit-args";
import { isCctpBridgeOperation } from "../cctp-args/common";

export const useDepositArgs = () => {
  const withdrawing = useConfigState.useWithdrawing();
  const stateToken = useConfigState.useToken();

  const optimism = useOptimismDepositArgs();
  const arbitrum = useArbitrumDepositArgs();

  if (withdrawing || !stateToken || isCctpBridgeOperation(stateToken)) {
    return;
  }

  return optimism || arbitrum;
};
