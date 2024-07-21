import { useTranslation } from "react-i18next";
import { isPresent } from "ts-is-present";

import { currencySymbolMap } from "@/constants/currency-symbol-map";
import { useTokenPrice } from "@/hooks/use-prices";
import { useSettingsState } from "@/state/settings";

import { useChain } from "./use-chain";
import { useInitiatingChainId } from "./use-initiating-chain-id";
import { useNativeToken } from "./use-native-token";
import { useNetworkFee } from "./use-network-fee";

export const useNetworkFeeLineItems = () => {
  const initiatingChainId = useInitiatingChainId();
  const chain = useChain(initiatingChainId);
  const currency = useSettingsState.useCurrency();
  const { t } = useTranslation();
  const nativeToken = useNativeToken();
  const networkFee = useNetworkFee();
  const nativeTokenUsdPrice = useTokenPrice(nativeToken ?? null);

  // const EASY_MODE_GWEI_THRESHOLD =
  //   EASY_MODE_GAS_FEES[deployment?.l1.id ?? 0] ?? 1;
  // const PROVE_COST =
  //   PROVE_GAS * parseUnits(EASY_MODE_GWEI_THRESHOLD.toString(), 9);
  // const FINALIZE_COST =
  //   FINALIZE_GAS * parseUnits(EASY_MODE_GWEI_THRESHOLD.toString(), 9);
  // const easyModeCost = parseFloat(formatUnits(PROVE_COST + FINALIZE_COST, 18));

  return [
    {
      name: t("fees.networkGas", {
        chain: chain?.name,
      }),
      usd: {
        raw: nativeTokenUsdPrice ? networkFee * nativeTokenUsdPrice : undefined,
        formatted: nativeTokenUsdPrice
          ? `${currencySymbolMap[currency]}${(
              networkFee * nativeTokenUsdPrice
            ).toLocaleString("en", {
              maximumFractionDigits: 4,
            })}`
          : undefined,
      },
      token: {
        token: null,
        raw: networkFee,
        formatted: `${networkFee!.toLocaleString("en", {
          maximumFractionDigits: 4,
        })} ${nativeToken?.[chain?.id ?? 0]?.symbol}`,
      },
    },
    // configurations[deployment?.name ?? ""] && withdrawing
    //   ? {
    //       name: t("fees.easyModeFee"),
    //       usd:
    //         easyMode && nativeTokenUsdPrice
    //           ? {
    //               raw: easyModeCost * nativeTokenUsdPrice,
    //               formatted: `${currencySymbolMap[currency]}${(
    //                 easyModeCost * nativeTokenUsdPrice
    //               ).toLocaleString("en")}`,
    //             }
    //           : null,
    //       token: easyMode
    //         ? {
    //             token: null,
    //             raw: easyModeCost,
    //             formatted: `${easyModeCost.toLocaleString("en", {
    //               maximumFractionDigits: 4,
    //             })} ETH`,
    //           }
    //         : null,
    //     }
    //   : null,
  ].filter(isPresent);
};
