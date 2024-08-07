import { formatUnits } from "viem";

import { BridgeableTokenDto } from "@/codegen/model";
import { currencySymbolMap } from "@/constants/currency-symbol-map";
import { useSettingsState } from "@/state/settings";
import { formatDecimals } from "@/utils/format-decimals";

import { useTokenPrice } from "./use-prices";

export const useGetFormattedAmount = (token: BridgeableTokenDto | null) => {
  const currency = useSettingsState.useCurrency();
  const usdPrice = useTokenPrice(token);

  return (raw: string | undefined) => {
    const amount = parseFloat(
      formatUnits(BigInt(raw ?? "0"), token?.decimals ?? 18)
    );

    const fiat = usdPrice ? amount * usdPrice : null;
    const fiatFormatted = fiat
      ? `${currencySymbolMap[currency]}${fiat.toLocaleString("en")}`
      : null;

    const tokenFormatted = `${formatDecimals(amount)} ${token?.symbol}`;

    return {
      fiat: fiat ? { formatted: fiatFormatted, amount: fiat } : null,
      token: { formatted: tokenFormatted, amount },
    };
  };
};
