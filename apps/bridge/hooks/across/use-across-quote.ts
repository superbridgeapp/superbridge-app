import { useQuery } from "@tanstack/react-query";

import { useConfigState } from "@/state/config";

import { useAcrossParams } from "./use-across-params";

interface AcrossQuoteResult {
  capitalFeePct: "100200000000000";
  capitalFeeTotal: "100200000000000";
  relayGasFeePct: "4261829814310";
  relayGasFeeTotal: "4261829814310";
  relayFeePct: "104461829814310";
  relayFeeTotal: "104461829814310";
  lpFeePct: "0";
  timestamp: "1717001207";
  isAmountTooLow: false;
  quoteBlock: "19976800";
  spokePoolAddress: "0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5";
  totalRelayFee: {
    pct: "104461829814310";
    total: "104461829814310";
  };
  relayerCapitalFee: {
    pct: "100200000000000";
    total: "100200000000000";
  };
  relayerGasFee: {
    pct: "4261829814310";
    total: "4261829814310";
  };
  lpFee: {
    pct: "0";
    total: "0";
  };
}

export const useAcrossQuote = () => {
  const fast = useConfigState.useFast();

  const params = useAcrossParams();

  const paramsString = params ? new URLSearchParams(params).toString() : "";
  return useQuery({
    queryKey: ["across quote", paramsString],
    queryFn: () =>
      fetch(`https://app.across.to/api/suggested-fees?${paramsString}`).then(
        async (x) => (await x.json()) as AcrossQuoteResult
      ),
    enabled: fast && !!paramsString,
  });
};
