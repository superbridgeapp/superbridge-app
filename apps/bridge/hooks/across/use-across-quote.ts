import { useQuery } from "@tanstack/react-query";

import { useConfigState } from "@/state/config";

import { useAcrossParams } from "./use-across-params";

interface AcrossQuoteResult {
  // deprecated
  capitalFeePct: "100200000000000";
  capitalFeeTotal: "100200000000000";
  relayGasFeePct: "4261829814310";
  relayGasFeeTotal: "4261829814310";
  relayFeePct: "104461829814310";
  relayFeeTotal: "104461829814310";
  lpFeePct: "0";
  /**
   * The quote timestamp that was used to compute the lpFeePct. To
   * pay the quoted LP fee, the user would need to pass this quote timestamp
   * to the protocol when sending their bridge transaction.
   */
  timestamp: "1717001207";
  /**
   * Is the input amount below the minimum transfer amount.
   */
  isAmountTooLow: false;
  quoteBlock: "19976800";
  spokePoolAddress: "0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5";
  totalRelayFee: {
    /**
     * The percentage of the transfer amount that should go to
     * the relayer as a fee in total. The value is inclusive of lpFee.pct.
     */
    pct: "104461829814310";
    /**
     * The amount of the transfer that should go to the relayer a fee
     * in total. This value is inclusive of lpFee.total.
     */
    total: "104461829814310";
  };
  relayerCapitalFee: {
    /**
     * The percentage of the transfer amount that should go the relayer
     * as a fee to cover relayer capital costs.
     */
    pct: "100200000000000";
    /**
     * The amount that should go to the relayer as a fee to cover
     * relayer capital costs.
     */
    total: "100200000000000";
  };
  relayerGasFee: {
    /**
     * The percentage of the transfer amount that should go the
     * relayer as a fee to cover relayer gas costs.
     */
    pct: "4261829814310";
    /**
     * The amount that should go to the relayer as a fee to cover
     * relayer gas costs.
     */
    total: "4261829814310";
  };
  lpFee: {
    /**
     * The percent of the amount that will go to the LPs as a fee
     * for borrowing their funds.
     */
    pct: "0";
    /**
     * The amount that will go to the LPs as a fee for borrowing
     * their funds.
     */
    total: "0";
  };
}

export const useAcrossQuote = () => {
  const fast = useConfigState.useFast();

  const params = useAcrossParams();

  const paramsString = params ? new URLSearchParams(params).toString() : "";

  return useQuery({
    queryKey: ["across quote", paramsString],
    queryFn: async () => {
      const response = await fetch(
        `https://app.across.to/api/suggested-fees?${paramsString}`
      );
      if (response.status !== 200) {
        throw new Error(await response.text());
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
      return (await response.json()) as AcrossQuoteResult;
    },
    enabled: fast && !!paramsString,
  });
};
