import {
  useBridgeControllerFiatPrices,
  useBridgeControllerGetTokenPrices,
} from "@/codegen";
import { useSettingsState } from "@/state/settings";
import { MultiChainToken } from "@/types/token";

import { useFromChain } from "./use-chain";

export const useTokenPrice = (token: MultiChainToken | null) => {
  const prices = useBridgeControllerGetTokenPrices();
  const fiat = useBridgeControllerFiatPrices();
  const currency = useSettingsState.useCurrency();

  const fiatPriceInUsd = fiat.data?.data?.[currency] ?? null;
  let tokenPrice = null;

  const fromId = useFromChain()?.id;
  const t = token?.[fromId ?? 0];

  if (t?.name === "Ether") {
    tokenPrice = prices.data?.data?.[`coingecko:ethereum`]?.price ?? null;
  } else if (t?.coinGeckoId) {
    tokenPrice =
      prices.data?.data?.[`coingecko:${t.coinGeckoId}`]?.price ?? null;
  } else if (token?.[1]?.coinGeckoId) {
    tokenPrice =
      prices.data?.data?.[`coingecko:${token?.[1]?.coinGeckoId}`]?.price ??
      null;
  } else {
    tokenPrice =
      prices.data?.data?.[`ethereum:${token?.[1]?.address}`]?.price ?? null;
  }

  if (fiatPriceInUsd && tokenPrice) {
    return fiatPriceInUsd * tokenPrice;
  }

  return null;
};
