import { useMemo } from "react";
import { zeroAddress } from "viem";

import { useConfigState } from "@/state/config";

import { useFromChain, useToChain } from "../use-chain";
import { useWeiAmount } from "../use-wei-amount";
import { useAcrossTokenAddress } from "./use-across-clean-address";

export const useAcrossParams = () => {
  const stateToken = useConfigState.useToken();
  const from = useFromChain();
  const to = useToChain();
  const amount = useWeiAmount();
  const recipient = useConfigState.useRecipientAddress();

  const inputToken = useAcrossTokenAddress(
    from?.id,
    stateToken?.[from?.id ?? 0]?.address
  );
  const outputToken = useAcrossTokenAddress(
    to?.id,
    stateToken?.[to?.id ?? 0]?.address
  );
  const originChainId = from?.id.toString();
  const destinationChainId = to?.id.toPrecision();

  return useMemo(() => {
    if (!inputToken || !outputToken || !originChainId || !destinationChainId) {
      return null;
    }

    return {
      inputToken,
      outputToken,
      originChainId,
      destinationChainId,
      /**
       * So we can load quotes without a connected wallet. Safe
       * because we never use the recipient from the output
       * quote data
       */
      recipient: recipient || zeroAddress,
      amount: amount.toString(),
    };
  }, [
    inputToken,
    outputToken,
    recipient,
    originChainId,
    destinationChainId,
    amount,
  ]);
};
