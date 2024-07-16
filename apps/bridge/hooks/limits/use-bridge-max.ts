import { useConfigState } from "@/state/config";
import { isCctp } from "@/utils/is-usdc";

import { useAcrossLimits } from "../across/use-across-limits";
import { useCctpBridgeLimit } from "../cctp/use-cctp-bridge-limit";

export const useBridgeMax = () => {
  const fast = useConfigState.useFast();
  const stateToken = useConfigState.useToken();

  const cctpMax = useCctpBridgeLimit();
  const acrossLimit = useAcrossLimits().data?.maxDepositInstant;

  if (fast) {
    if (acrossLimit) {
      return BigInt(acrossLimit);
    }
    return null;
  }

  if (isCctp(stateToken)) {
    return cctpMax ?? null;
  }

  return null;
};
