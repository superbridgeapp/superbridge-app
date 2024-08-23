import { useCallback } from "react";

import {
  useBridgeControllerFiatPrices,
  useBridgeControllerGetTokenPrices,
} from "@/codegen";
import { useSettingsState } from "@/state/settings";

export const useGetTokenPrice = () => {
  const prices = useBridgeControllerGetTokenPrices();
  const fiat = useBridgeControllerFiatPrices();
  const currency = useSettingsState.useCurrency();

  return useCallback(
    (
      t: {
        coinGeckoId?: string;
        address?: string;
        name?: string;
      } | null
    ) => {
      const fiatPriceInUsd = fiat.data?.data?.[currency] ?? null;
      let tokenPrice = null;

      if (t?.name === "Ether") {
        // @ts-expect-error
        tokenPrice = prices.data?.data?.[`coingecko:ethereum`]?.price ?? null;
      } else if (t?.coinGeckoId) {
        tokenPrice =
          // @ts-expect-error
          prices.data?.data?.[`coingecko:${t.coinGeckoId}`]?.price ?? null;
        // } else if (token?.[1]?.coinGeckoId) {
        //   tokenPrice =
        //     prices.data?.data?.[`coingecko:${token?.[1]?.coinGeckoId}`]?.price ??
        //     null;
      } else {
        tokenPrice =
          // @ts-expect-error
          prices.data?.data?.[`ethereum:${t?.address}`]?.price ?? null;
      }

      if (fiatPriceInUsd && tokenPrice) {
        // @ts-expect-error
        return fiatPriceInUsd * tokenPrice;
      }

      return null;
    },
    [prices.data?.data, fiat.data?.data, currency]
  );
};

export const useTokenPrice = (
  t: {
    coinGeckoId?: string;
    address?: string;
    name: string;
  } | null
) => {
  const getTokenPrice = useGetTokenPrice();
  return getTokenPrice(t);
};
