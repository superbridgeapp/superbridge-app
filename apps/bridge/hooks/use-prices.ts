import { useSettingsState } from "@/state/settings";
import { MultiChainToken } from "@/types/token";
import { useInjectedStore } from "@/state/injected";

import { useFromChain } from "./use-chain";

export const useTokenPrice = (token: MultiChainToken | null) => {
  const fiat = useInjectedStore((s) => s.fiatPrices);
  const prices = useInjectedStore((s) => s.prices);
  const currency = useSettingsState.useCurrency();

  const fiatPriceInUsd = fiat[currency] ?? null;
  let tokenPrice = null;

  const fromId = useFromChain()?.id;
  const t = token?.[fromId ?? 0];

  if (t?.coinGeckoId) {
    tokenPrice = prices[`coingecko:${t.coinGeckoId}`]?.price ?? null;
  } else if (token?.[1]?.coinGeckoId) {
    tokenPrice = prices[`coingecko:${token?.[1]?.coinGeckoId}`]?.price ?? null;
  } else {
    tokenPrice = prices[`ethereum:${token?.[1]?.address}`]?.price ?? null;
  }

  if (fiatPriceInUsd && tokenPrice) {
    return fiatPriceInUsd * tokenPrice;
  }

  return null;
};
