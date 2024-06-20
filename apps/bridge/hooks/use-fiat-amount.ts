import { currencySymbolMap } from "@/constants/currency-symbol-map";
import { useTokenPrice } from "@/hooks/use-prices";
import { useConfigState } from "@/state/config";
import { useSettingsState } from "@/state/settings";

export const useFiatAmount = () => {
  const stateToken = useConfigState.useToken();

  const usdPrice = useTokenPrice(stateToken);

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
