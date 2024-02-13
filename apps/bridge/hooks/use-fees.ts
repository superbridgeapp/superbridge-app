import { useTranslation } from "react-i18next";
import { isPresent } from "ts-is-present";
import { Chain, formatUnits, parseUnits } from "viem";
import { arbitrum, arbitrumNova, goerli, sepolia } from "viem/chains";
import { mainnet, useFeeData } from "wagmi";

import { ChainDto } from "@/codegen/model";
import { configurations } from "@/config/contract-addresses";
import { currencySymbolMap } from "@/constants/currency-symbol-map";
import { FINALIZE_GAS, PROVE_GAS } from "@/constants/gas-limits";
import { useTokenPrice } from "@/hooks/use-prices";
import { useConfigState } from "@/state/config";
import { useSettingsState } from "@/state/settings";

import { useNativeToken } from "./use-native-token";

const EASY_MODE_GAS_FEES: { [chainId: number]: number | undefined } = {
  [mainnet.id]: 50,
  [arbitrum.id]: 3,
  [arbitrumNova.id]: 3,
  [goerli.id]: 1,
  [sepolia.id]: 1,
};

export const useFees = (
  from: Chain | ChainDto | undefined,
  gasEstimate: number
) => {
  const deployment = useConfigState.useDeployment();
  const withdrawing = useConfigState.useWithdrawing();
  const forceViaL1 = useConfigState.useForceViaL1();
  const easyMode = useConfigState.useEasyMode();
  const currency = useSettingsState.useCurrency();
  const { t } = useTranslation();

  const nativeToken = useNativeToken();

  const feeData = useFeeData({
    chainId: forceViaL1 && withdrawing ? deployment?.l1.id : from?.id,
  });

  let networkFee = 0;
  if (feeData.data) {
    const gwei =
      (feeData.data.gasPrice ?? feeData.data.maxFeePerGas)! *
      BigInt(gasEstimate);
    networkFee = parseFloat(formatUnits(gwei, 18));
  }

  const nativeTokenUsdPrice = useTokenPrice(nativeToken ?? null);

  const EASY_MODE_GWEI_THRESHOLD =
    EASY_MODE_GAS_FEES[deployment?.l1.id ?? 0] ?? 1;
  const PROVE_COST =
    PROVE_GAS * parseUnits(EASY_MODE_GWEI_THRESHOLD.toString(), 9);
  const FINALIZE_COST =
    FINALIZE_GAS * parseUnits(EASY_MODE_GWEI_THRESHOLD.toString(), 9);
  const easyModeCost = parseFloat(formatUnits(PROVE_COST + FINALIZE_COST, 18));

  return [
    {
      name: t("fees.networkGas", { chain: from?.name }),
      usd: {
        raw: nativeTokenUsdPrice
          ? networkFee! * nativeTokenUsdPrice
          : undefined,
        formatted: nativeTokenUsdPrice
          ? `${currencySymbolMap[currency]}${(
              networkFee! * nativeTokenUsdPrice
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
        })} ${nativeToken?.[1]?.symbol ?? nativeToken?.[57]?.symbol}`,
      },
    },
    configurations[deployment?.name ?? ""] && withdrawing
      ? {
          name: t("fees.easyModeFee"),
          usd:
            easyMode && nativeTokenUsdPrice
              ? {
                  raw: easyModeCost * nativeTokenUsdPrice,
                  formatted: `${currencySymbolMap[currency]}${(
                    easyModeCost * nativeTokenUsdPrice
                  ).toLocaleString("en")}`,
                }
              : null,
          token: easyMode
            ? {
                token: null,
                raw: easyModeCost,
                formatted: `${easyModeCost.toLocaleString("en", {
                  maximumFractionDigits: 4,
                })} ETH`,
              }
            : null,
        }
      : null,
  ].filter(isPresent);
};
