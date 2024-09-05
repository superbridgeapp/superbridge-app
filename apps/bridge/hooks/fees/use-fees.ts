import { isPresent } from "ts-is-present";
import { Address, formatUnits, isAddressEqual, zeroAddress } from "viem";

import { RouteResultDto } from "@/codegen/model";
import { chainIcons } from "@/config/chain-icon-overrides";
import { currencySymbolMap } from "@/constants/currency-symbol-map";
import { useSelectedBridgeRoute } from "@/hooks/routes/use-selected-bridge-route";
import { useGetTokenPrice } from "@/hooks/use-prices";
import { useSettingsState } from "@/state/settings";
import { formatDecimals } from "@/utils/format-decimals";
import { isRouteQuote } from "@/utils/guards";

import { useDestinationToken, useSelectedToken } from "../tokens/use-token";
import { useFromChain } from "../use-chain";

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
  const chain = useFromChain();

  if (route.isLoading) {
    return {
      isLoading: true,
      data: null,
    };
  }

  const fees = isRouteQuote(route.data?.result)
    ? route.data.result.fees
        .map((x) => {
          if (!chain) {
            return null;
          }
          const feeToken = isAddressEqual(
            x.tokenAddress as Address,
            zeroAddress
          )
            ? {
                ...chain.nativeCurrency,
                logoURI: chainIcons[chain?.id ?? 0] ?? "",
              }
            : fromToken;

          const amount = parseFloat(
            formatUnits(BigInt(x.amount), feeToken?.decimals ?? 18)
          );

          const price = getTokenPrice(feeToken);
          const fiat = price ? amount * price : null;
          const fiatFormatted = fiat
            ? `${currencySymbolMap[currency]}${fiat.toLocaleString("en")}`
            : null;

          const tokenFormatted = `${formatDecimals(
            amount
          )} ${feeToken?.symbol}`;

          return {
            name: x.name,
            fiat:
              fiat !== null ? { formatted: fiatFormatted, amount: fiat } : null,
            token: {
              formatted: tokenFormatted,
              amount,
              token: feeToken,
            },
          };
        })
        .filter(isPresent)
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
  const totalTokenFormatted = `${formatDecimals(totalToken)} ${
    fees[0]?.token.token?.symbol
  }`;

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
