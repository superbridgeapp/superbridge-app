import { formatUnits } from "viem";

import { useConfigState } from "@/state/config";

import { useAcrossQuote } from "./across/use-across-quote";
import { useSelectedToken } from "./use-selected-token";

export const useAcrossFee = () => {
  const token = useSelectedToken();
  const fastRelayFee = useAcrossQuote().data?.totalRelayFee.total;

  return fastRelayFee && token
    ? parseFloat(formatUnits(BigInt(fastRelayFee), token.decimals))
    : null;
};

export const useReceiveAmount = () => {
  const rawAmount = useConfigState.useRawAmount();
  const fast = useConfigState.useFast();
  const token = useSelectedToken();

  const fastRelayFee = useAcrossFee();

  const parsedRawAmount = parseFloat(rawAmount) || 0;
  if (!fast) {
    return parsedRawAmount;
  }

  if (!fastRelayFee || !token) {
    return null;
  }

  return parsedRawAmount - fastRelayFee;
};
