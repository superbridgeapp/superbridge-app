import { formatUnits } from "viem";

import { useSelectedToken } from "../use-selected-token";
import { useAcrossQuote } from "./use-across-quote";

export const useAcrossFee = () => {
  const token = useSelectedToken();

  const acrossQuote = useAcrossQuote();
  const fastRelayFee = acrossQuote.data?.totalRelayFee.total;

  if (acrossQuote.fetchStatus === "idle") {
    if (acrossQuote.data) {
      const data =
        fastRelayFee && token
          ? parseFloat(formatUnits(BigInt(fastRelayFee), token.decimals))
          : null;
      return {
        isFetching: false,
        data,
      };
    } else {
      return {
        isFetching: false,
        data: null,
      };
    }
  }

  return {
    isFetching: true,
    data: null,
  };
};
