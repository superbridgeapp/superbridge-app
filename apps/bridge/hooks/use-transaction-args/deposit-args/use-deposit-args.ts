import { useConfigState } from "@/state/config";

import { useCctpArgs } from "../cctp-args/use-cctp-bridge-args";
import { useArbitrumDepositArgs } from "./use-arbitrum-deposit-args";
import { useOptimismDepositArgs } from "./use-optimism-deposit-args";

export const useDepositArgs = () => {
  const optimism = useOptimismDepositArgs();
  const arbitrum = useArbitrumDepositArgs();
  const cctp = useCctpArgs();

  const withdrawing = useConfigState.useWithdrawing();

  if (withdrawing) {
    return;
  }

  return optimism || arbitrum || cctp;
};
