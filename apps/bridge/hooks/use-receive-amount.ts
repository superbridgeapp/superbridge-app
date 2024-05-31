import { useConfigState } from "@/state/config";

import { useAcrossQuote } from "./across/use-across-quote";
import { useWeiAmount } from "./use-wei-amount";
import { useSelectedToken } from "./use-selected-token";
import { formatUnits } from "viem";

export const useReceiveAmount = () => {
  const rawAmount = useConfigState.useRawAmount();
  const weiAmount = useWeiAmount();
  const fast = useConfigState.useFast();
  const token = useSelectedToken();

  const fastRelayFee = useAcrossQuote().data?.totalRelayFee.total;

  const parsedRawAmount = parseFloat(rawAmount) || 0;
  if (!fast) {
    return parsedRawAmount;
  }

  if (!fastRelayFee || !token) {
    return null;
  }

  return parseFloat(
    formatUnits(weiAmount - BigInt(fastRelayFee), token.decimals)
  );
};
