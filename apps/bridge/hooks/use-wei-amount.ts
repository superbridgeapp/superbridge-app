import { parseUnits } from "viem";

import { useConfigState } from "@/state/config";

import { useSelectedToken } from "./use-selected-token";

export const useWeiAmount = () => {
  const rawAmount = useConfigState.useRawAmount();
  const token = useSelectedToken();

  if (!token) {
    return BigInt(0);
  }

  const amount = isNaN(parseFloat(rawAmount)) ? "0" : rawAmount;
  try {
    return parseUnits(amount, token.decimals);
  } catch {
    return BigInt(0);
  }
};
