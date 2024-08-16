import { Trans, useTranslation } from "react-i18next";
import { formatUnits } from "viem";
import { useEstimateFeesPerGas } from "wagmi";

import { IconAlert, IconFees } from "@/components/icons";
import { TokenIcon } from "@/components/token-icon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { currencySymbolMap } from "@/constants/currency-symbol-map";
import { FINALIZE_GAS, PROVE_GAS } from "@/constants/gas-limits";
import { useBridge } from "@/hooks/bridge/use-bridge";
import { useCancelBridge } from "@/hooks/bridge/use-cancel-bridge";
import { useDismissAlert } from "@/hooks/bridge/use-dismiss-alert";
import { useDeployment } from "@/hooks/deployments/use-deployment";
import { useSelectedToken } from "@/hooks/tokens/use-token";
import { useFromChain, useToChain } from "@/hooks/use-chain";
import { useNativeToken, useToNativeToken } from "@/hooks/use-native-token";
import { useTokenPrice } from "@/hooks/use-prices";
import { useIsWithdrawal } from "@/hooks/use-withdrawing";
import { useConfigState } from "@/state/config";
import { useModalsState } from "@/state/modals";
import { useSettingsState } from "@/state/settings";
import { isOptimism } from "@/utils/deployments/is-mainnet";

export const useEstimateTotalFeesInFiat = () => {
  const from = useFromChain();
  const to = useToChain();
  const withdrawing = useIsWithdrawal();
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
    token: fromNativeToken,
    price: fromNativeTokenPrice,
    gasPrice: fromGasPrice,
  };
  const toGas = {
    token: toNativeToken,
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

export const ExpensiveGasModal = () => {
  const onProceed = useDismissAlert("GasExpensive");
  const onCancel = useCancelBridge();
  const open = useModalsState.useAlerts().includes("GasExpensive");

  const { t } = useTranslation();
  const token = useSelectedToken();

  const totalBridgeFees = useEstimateTotalFeesInFiat();

  const usdPrice = useTokenPrice(token);

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
              <IconAlert />
            </div>
            <h1 className="font-heading text-2xl  text-pretty">
              {t("expensiveGasModal.title")}
            </h1>
            <p className="text-xs md:text-sm prose-sm  text-muted-foreground text-pretty text-center ">
              <Trans
                i18nKey={"expensiveGasModal.notBestOption"}
                components={[
                  <a
                    target="_blank"
                    key="link"
                    className="hover:underline text-foreground"
                    href="https://superbridge.app/alternative-bridges"
                  />,
                ]}
              />
            </p>
          </div>

          <div className="flex flex-col rounded-lg border">
            <div className="flex items-center justify-between border-b px-3 py-2">
              <div className="flex items-center gap-2">
                <TokenIcon token={token} className="h-6 w-6" />
                <span className="font-heading text-sm ">
                  {t("expensiveGasModal.bridgeAmount")}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-muted-foreground">
                  {tokenFiatAmount}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center gap-2">
                <IconFees className="h-6 w-6" />
                <span className="font-heading text-sm ">
                  {t("expensiveGasModal.networkFees")}
                </span>
              </div>
              <div className="flex items-center">
                <span className=" text-sm  text-red-500">{fees}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button onClick={onCancel}>{t("expensiveGasModal.goBack")}</Button>

            <Button variant={"secondary"} onClick={onProceed}>
              <span>{t("expensiveGasModal.proceedAnyway")}</span>
              <IconAlert className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
