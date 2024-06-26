import { useConfigState } from "@/state/config";

import { useAcrossLimits } from "../across/use-across-limits";

export const useBridgeMin = () => {
  const fast = useConfigState.useFast();
  const acrossLimit = useAcrossLimits().data?.minDeposit;

  if (fast) {
    if (acrossLimit) {
      return BigInt(acrossLimit);
    }
    return null;
  }

  return null;
};
