import { formatUnits } from "viem";

import { currencySymbolMap } from "@/constants/currency-symbol-map";
import { useConfigState } from "@/state/config";
import { useSettingsState } from "@/state/settings";

import { useTokenPrice } from "./use-prices";

export const useFormattedAmount = (
  raw: string | undefined,
  chainId: number | undefined
) => {
  const stateToken = useConfigState.useToken();
  const currency = useSettingsState.useCurrency();
  const usdPrice = useTokenPrice(stateToken);

  const amount = parseFloat(
    formatUnits(BigInt(raw ?? "0"), stateToken?.[chainId ?? 0]?.decimals ?? 18)
  );

  const fiat = usdPrice ? amount * usdPrice : null;
  const fiatFormatted = fiat
    ? `${currencySymbolMap[currency]}${fiat.toLocaleString("en")}`
    : null;

  const tokenFormatted = `${amount.toLocaleString("en", {
    maximumFractionDigits: 4,
  })} ${stateToken?.[chainId ?? 0]?.symbol}`;

  return {
    fiat: fiat ? { formatted: fiatFormatted, amount: fiat } : null,
    token: { formatted: tokenFormatted, amount },
  };
};
