import { formatUnits } from "viem";

import { RouteResponseDto } from "@/codegen/model";
import { currencySymbolMap } from "@/constants/currency-symbol-map";
import { useTokenPrice } from "@/hooks/use-prices";
import { useSelectedBridgeRoute } from "@/hooks/use-selected-bridge-route";
import { useSettingsState } from "@/state/settings";
import { isRouteQuote } from "@/utils/guards";

import { useDestinationToken, useSelectedToken } from "./tokens/use-token";

export const useFees = () => {
  const route = useSelectedBridgeRoute();

  return useFeesForRoute(route);
};

export const useFeesForRoute = (route: {
  isLoading: boolean;
  data: RouteResponseDto | null;
}) => {
  const fromToken = useSelectedToken();
  const toToken = useDestinationToken();
  const currency = useSettingsState.useCurrency();
  const usdPrice = useTokenPrice(fromToken);

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

        const fiat = usdPrice ? amount * usdPrice : null;
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

  const totalFiat = usdPrice
    ? fees.reduce((acc, f) => (f.fiat?.amount ?? 0) + acc, 0)
    : null;
  const totalFiatFormatted =
    usdPrice && totalFiat !== null
      ? `${currencySymbolMap[currency]}${(totalFiat * usdPrice).toLocaleString(
          "en"
        )}`
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
