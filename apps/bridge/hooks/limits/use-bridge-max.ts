import { useConfigState } from "@/state/config";
import { useAcrossLimits } from "../across/use-across-limits";
import { useCctpBridgeLimit } from "../cctp/use-cctp-bridge-limit";
import { isNativeUsdc } from "@/utils/is-usdc";

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

  if (isNativeUsdc(stateToken)) {
    return cctpMax ?? null;
  }

  return null;
};
