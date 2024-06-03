import { Trans, useTranslation } from "react-i18next";
import { formatUnits } from "viem";
import { useEstimateFeesPerGas } from "wagmi";

import { currencySymbolMap } from "@/constants/currency-symbol-map";
import { FINALIZE_GAS, PROVE_GAS } from "@/constants/gas-limits";
import { useBridge } from "@/hooks/use-bridge";
import { useFromChain, useToChain } from "@/hooks/use-chain";
import { useDeployment } from "@/hooks/use-deployment";
import { useNativeToken, useToNativeToken } from "@/hooks/use-native-token";
import { useTokenPrice } from "@/hooks/use-prices";
import { useSelectedToken } from "@/hooks/use-selected-token";
import { useConfigState } from "@/state/config";
import { useSettingsState } from "@/state/settings";
import { isOptimism } from "@/utils/is-mainnet";

import { TokenIcon } from "../../token-icon";
import { Button } from "../../ui/button";
import { Dialog, DialogContent } from "../../ui/dialog";
import { Alert, FeesIcon } from "./icons";
import { AlertProps } from "../types";

export const useEstimateTotalFeesInFiat = () => {
  const from = useFromChain();
  const to = useToChain();
  const withdrawing = useConfigState.useWithdrawing();
  const escapeHatch = useConfigState.useForceViaL1();

  const deployment = useDeployment();

  const fromFeeData = useEstimateFeesPerGas({ chainId: from?.id });
  const toFeeData = useEstimateFeesPerGas({ chainId: to?.id });

  const fromNativeToken = useNativeToken();
  const toNativeToken = useToNativeToken();

  const fromNativeTokenPrice = useTokenPrice(fromNativeToken ?? null);
  const toNativeTokenPrice = useTokenPrice(toNativeToken ?? null);

  const fromGasPrice =
    fromFeeData.data?.gasPrice ?? fromFeeData.data?.maxFeePerGas ?? BigInt(0);
  const toGasPrice =
    toFeeData.data?.gasPrice ?? toFeeData.data?.maxFeePerGas ?? BigInt(0);

  const fromGas = {
    token: fromNativeToken?.[from?.id ?? 0],
    price: fromNativeTokenPrice,
    gasPrice: fromGasPrice,
  };
  const toGas = {
    token: toNativeToken?.[to?.id ?? 0],
    price: toNativeTokenPrice,
    gasPrice: toGasPrice,
  };

  const { gas } = useBridge();
  const initiateCost = {
    gasToken: withdrawing && escapeHatch ? toGas : fromGas,
    gasLimit: gas ?? BigInt(0),
  };
  const proveCost = { gasToken: toGas, gasLimit: PROVE_GAS };
  const finalizeCost = {
    gasToken: toGas,
    gasLimit: FINALIZE_GAS,
  };

  const costs = [];
  if (fromNativeTokenPrice && toNativeTokenPrice) {
    costs.push(initiateCost);

    if (withdrawing) {
      if (deployment && isOptimism(deployment)) {
        costs.push(proveCost);
      }
      costs.push(finalizeCost);
    }
  }

  return costs.reduce((accum, { gasLimit, gasToken }) => {
    if (!gasToken.price) return accum;

    const nativeTokenAmount = gasLimit * gasToken.gasPrice;
    const formattedAmount = parseFloat(
      formatUnits(nativeTokenAmount, gasToken.token?.decimals ?? 18)
    );
    return gasToken.price * formattedAmount + accum;
  }, 0);
};

export const ExpensiveGasModal = ({
  onProceed,
  open,
  onCancel,
}: AlertProps) => {
  const { t } = useTranslation();
  const stateToken = useConfigState.useToken();
  const token = useSelectedToken();
  const totalBridgeFees = useEstimateTotalFeesInFiat();

  const usdPrice = useTokenPrice(stateToken);

  const rawAmount = parseFloat(useConfigState.useRawAmount()) || 0;
  const currency = useSettingsState.useCurrency();

  const tokenFiatAmount = usdPrice
    ? `${currencySymbolMap[currency]}${(rawAmount * usdPrice).toLocaleString(
        "en"
      )}`
    : undefined;

  const fees = `${currencySymbolMap[currency]}${totalBridgeFees.toLocaleString(
    "en"
  )} `;

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent>
        <div className="flex flex-col gap-8 p-6">
          <div className="flex flex-col gap-2 items-center text-center pt-10">
            <div className="animate-bounce">
              <Alert />
            </div>
            <h1 className="font-bold text-2xl tracking-tight text-pretty">
              {t("expensiveGasModal.title")}
            </h1>
            <p className="text-xs md:text-sm prose-sm font-bold text-muted-foreground text-pretty text-center">
              <Trans
                i18nKey={"expensiveGasModal.notBestOption"}
                components={[
                  <a
                    target="_blank"
                    key="link"
                    className="underline"
                    href="https://superbridge.app/alternative-bridges"
                  />,
                ]}
              />
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <TokenIcon token={token} className="h-4 w-4" />
                <div>Bridge amount</div>
              </div>
              <div className="flex items-center">
                <div>{tokenFiatAmount}</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FeesIcon />
                <div>Network costs</div>
              </div>
              <div className="flex items-center">
                <div>{fees}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button onClick={onCancel}>{t("expensiveGasModal.goBack")}</Button>

            <Button variant={"secondary"} onClick={onProceed}>
              <span>{t("expensiveGasModal.proceedAnyway")}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="ml-2 w-4 h-4"
              >
                <g clip-path="url(#clip0_19201_1331)">
                  <path
                    d="M7.48321 5.47569C7.48321 5.10034 7.65238 4.89152 8.00394 4.89152C8.35551 4.89152 8.53261 5.10034 8.53261 5.47569C8.53261 5.85104 8.14933 9.15783 8.06738 9.78166C8.05945 9.85303 8.04359 9.9244 8.00394 9.9244C7.96429 9.9244 7.94843 9.86889 7.9405 9.77108C7.86914 9.15519 7.48321 5.83518 7.48321 5.47305V5.47569ZM7.48321 12.6919C7.48321 12.4118 7.71582 12.1791 8.00394 12.1791C8.29207 12.1791 8.51675 12.4118 8.51675 12.6919C8.51675 12.9721 8.28414 13.2127 8.00394 13.2127C7.72375 13.2127 7.48321 12.9801 7.48321 12.6919ZM1.2397 15.5097H14.755C15.7964 15.5097 16.2987 14.685 15.8123 13.7889L9.01898 1.2411C8.47446 0.241923 7.54665 0.241923 7.00213 1.23317L0.185012 13.781C-0.296072 14.6771 0.200872 15.5097 1.24234 15.5097H1.2397Z"
                    fill="#FFFF55"
                  />
                  <path
                    d="M6.52111 5.47534C6.52111 5.89827 6.93611 9.22092 7.04185 9.93197C7.12908 10.5399 7.50707 10.8836 8.00137 10.8836C8.53004 10.8836 8.86574 10.4924 8.95297 9.93197C9.13007 8.82706 9.48956 5.89827 9.48956 5.47534C9.48956 4.68234 8.8816 3.93164 8.00137 3.93164C7.12115 3.93164 6.52111 4.69292 6.52111 5.47534ZM8.0093 14.1798C8.81816 14.1798 9.48163 13.5163 9.48163 12.6837C9.48163 11.851 8.81816 11.2113 8.0093 11.2113C7.20045 11.2113 6.51318 11.8748 6.51318 12.6837C6.51318 13.4925 7.17666 14.1798 8.0093 14.1798Z"
                    fill="white"
                  />
                  <path
                    d="M7.48321 5.47569C7.48321 5.10034 7.65238 4.89152 8.00394 4.89152C8.35551 4.89152 8.53261 5.10034 8.53261 5.47569C8.53261 5.85104 8.14933 9.15783 8.06738 9.78166C8.05945 9.85303 8.04359 9.9244 8.00394 9.9244C7.96429 9.9244 7.94843 9.86889 7.9405 9.77108C7.86914 9.15519 7.48321 5.83518 7.48321 5.47305V5.47569ZM7.48321 12.6919C7.48321 12.4118 7.71582 12.1791 8.00394 12.1791C8.29207 12.1791 8.51675 12.4118 8.51675 12.6919C8.51675 12.9721 8.28414 13.2127 8.00394 13.2127C7.72375 13.2127 7.48321 12.9801 7.48321 12.6919ZM6.52104 5.47569C6.52104 5.89862 6.93604 9.22127 7.04178 9.93233C7.12901 10.5403 7.507 10.8839 8.0013 10.8839C8.52996 10.8839 8.86567 10.4927 8.9529 9.93233C9.13 8.82742 9.48949 5.89862 9.48949 5.47569C9.48949 4.6827 8.88153 3.93199 8.0013 3.93199C7.12108 3.93199 6.52104 4.69327 6.52104 5.47569ZM6.51311 12.684C6.51311 13.5167 7.17659 14.1801 8.00923 14.1801C8.84188 14.1801 9.48156 13.5167 9.48156 12.684C9.48156 11.8514 8.81809 11.2117 8.00923 11.2117C7.20038 11.2117 6.51311 11.8752 6.51311 12.684ZM1.03352 14.2462L7.85063 1.69839C8.06738 1.29132 7.95372 1.29132 8.17047 1.69046L14.9638 14.2383C15.1488 14.574 15.1647 14.5502 14.755 14.5502H1.2397C0.832625 14.5502 0.848484 14.574 1.03087 14.2462H1.03352ZM1.2397 15.5097H14.755C15.7964 15.5097 16.2987 14.685 15.8123 13.7889L9.01898 1.2411C8.47446 0.241923 7.54665 0.241923 7.00213 1.23317L0.185012 13.781C-0.296072 14.6771 0.200872 15.5097 1.24234 15.5097H1.2397Z"
                    fill="black"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_19201_1331">
                    <rect
                      width="16"
                      height="15.0193"
                      fill="white"
                      transform="translate(0 0.490234)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
