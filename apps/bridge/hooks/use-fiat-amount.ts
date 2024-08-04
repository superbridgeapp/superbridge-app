import { currencySymbolMap } from "@/constants/currency-symbol-map";
import { useTokenPrice } from "@/hooks/use-prices";
import { useConfigState } from "@/state/config";
import { useSettingsState } from "@/state/settings";

import { useSelectedToken } from "./tokens/use-token";

export const useFiatAmount = () => {
  const token = useSelectedToken();
  const usdPrice = useTokenPrice(token);

  const rawAmount = parseFloat(useConfigState.useRawAmount()) || 0;
  const currency = useSettingsState.useCurrency();

  const fiatAmount = usdPrice
    ? `${currencySymbolMap[currency]}${(rawAmount * usdPrice).toLocaleString(
        "en"
      )}`
    : undefined;

  return {
    rawAmount,
    fiatAmount,
  };
};
