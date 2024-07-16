import { useConfigState } from "@/state/config";
import { isCctp } from "@/utils/is-cctp";

import { isCctpBridgeOperation } from "../cctp-args/common";
import { useArbitrumDepositArgs } from "./use-arbitrum-deposit-args";
import { useOptimismDepositArgs } from "./use-optimism-deposit-args";

export const useDepositArgs = () => {
  const withdrawing = useConfigState.useWithdrawing();
  const stateToken = useConfigState.useToken();
  const fast = useConfigState.useFast();

  const optimism = useOptimismDepositArgs();
  const arbitrum = useArbitrumDepositArgs();

  if (withdrawing || !stateToken || isCctp(stateToken) || fast) {
    return;
  }

  return optimism || arbitrum;
};
