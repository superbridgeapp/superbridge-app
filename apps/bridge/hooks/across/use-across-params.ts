import { useMemo } from "react";

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
    if (
      !inputToken ||
      !outputToken ||
      !recipient ||
      !originChainId ||
      !destinationChainId
    ) {
      return null;
    }

    return {
      inputToken,
      outputToken,
      originChainId,
      destinationChainId,
      recipient,
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
