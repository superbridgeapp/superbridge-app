import { formatUnits } from "viem";

import { RouteResultDto } from "@/codegen/model";
import { currencySymbolMap } from "@/constants/currency-symbol-map";
import { useSelectedBridgeRoute } from "@/hooks/routes/use-selected-bridge-route";
import { useGetTokenPrice } from "@/hooks/use-prices";
import { useSettingsState } from "@/state/settings";
import { isRouteQuote } from "@/utils/guards";

import { useDestinationToken, useSelectedToken } from "./tokens/use-token";

export const useFees = () => {
  const route = useSelectedBridgeRoute();

  return useFeesForRoute(route);
};

export const useFeesForRoute = (route: {
  isLoading: boolean;
  data: RouteResultDto | null;
}) => {
  const fromToken = useSelectedToken();
  const toToken = useDestinationToken();
  const currency = useSettingsState.useCurrency();
  const getTokenPrice = useGetTokenPrice();

  if (route.isLoading) {
    return {
      isLoading: true,
      data: null,
    };
  }

  const fees = isRouteQuote(route.data?.result)
    ? route.data.result.fees.map((x) => {
        const amount = parseFloat(
          formatUnits(BigInt(x.amount), fromToken?.decimals ?? 18)
        );

        const price = getTokenPrice({ address: x.tokenAddress });
        const fiat = price ? amount * price : null;
        const fiatFormatted = fiat
          ? `${currencySymbolMap[currency]}${fiat.toLocaleString("en")}`
          : null;

        const tokenFormatted = `${amount.toLocaleString("en", {
          maximumFractionDigits: 4,
        })} ${toToken?.symbol}`;

        return {
          name: x.name,
          fiat: fiat ? { formatted: fiatFormatted, amount: fiat } : null,
          token: { formatted: tokenFormatted, amount },
        };
      })
    : [];

  const feeAccumulator = (acc: number | null, f: (typeof fees)[number]) => {
    if (typeof acc === "number") {
      if (f.fiat) return f.fiat.amount + acc;
      else return null;
    }
    return null;
  };
  const totalFiat = fees.reduce(feeAccumulator, 0);

  const totalFiatFormatted =
    totalFiat !== null
      ? `${currencySymbolMap[currency]}${totalFiat.toLocaleString("en")}`
      : null;

  const totalToken = fees.reduce((acc, f) => f.token.amount + acc, 0);
  const totalTokenFormatted = `${totalToken.toLocaleString("en", {
    maximumFractionDigits: 4,
  })} ${toToken?.symbol}`;

  return {
    isLoading: false,
    data: {
      fees,
      totals: {
        fiat: totalFiat,
        fiatFormatted: totalFiatFormatted,
        token: totalToken,
        tokenFormatted: totalTokenFormatted,
      },
    },
  };
};
