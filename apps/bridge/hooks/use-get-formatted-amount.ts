import { formatUnits } from "viem";

import { currencySymbolMap } from "@/constants/currency-symbol-map";
import { useSettingsState } from "@/state/settings";
import { MultiChainToken } from "@/types/token";
import { formatDecimals } from "@/utils/format-decimals";

import { useTokenPrice } from "./use-prices";

export const useGetFormattedAmount = (
  token: MultiChainToken | null,
  chainId: number | undefined
) => {
  const currency = useSettingsState.useCurrency();
  const usdPrice = useTokenPrice(token);

  return (raw: string | undefined) => {
    const amount = parseFloat(
      formatUnits(BigInt(raw ?? "0"), token?.[chainId ?? 0]?.decimals ?? 18)
    );

    const fiat = usdPrice ? amount * usdPrice : null;
    const fiatFormatted = fiat
      ? `${currencySymbolMap[currency]}${fiat.toLocaleString("en")}`
      : null;

    const tokenFormatted = `${formatDecimals(amount)} ${token?.[chainId ?? 0]
      ?.symbol}`;

    return {
      fiat: fiat ? { formatted: fiatFormatted, amount: fiat } : null,
      token: { formatted: tokenFormatted, amount },
    };
  };
};
