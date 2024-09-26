import { Trans, useTranslation } from "react-i18next";

import { IconAlert, IconFees } from "@/components/icons";
import { TokenIcon } from "@/components/token-icon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { currencySymbolMap } from "@/constants/currency-symbol-map";
import { useCancelBridge } from "@/hooks/bridge/use-cancel-bridge";
import { useDismissAlert } from "@/hooks/bridge/use-dismiss-alert";
import { useEstimateTotalNetworkFees } from "@/hooks/gas/use-total-network-fees";
import { useSelectedToken } from "@/hooks/tokens/use-token";
import { useTokenPrice } from "@/hooks/use-prices";
import { useConfigState } from "@/state/config";
import { useModalsState } from "@/state/modals";
import { useSettingsState } from "@/state/settings";
import { formatDecimals } from "@/utils/format-decimals";

export const ExpensiveGasModal = () => {
  const onProceed = useDismissAlert("gas-expensive");
  const onCancel = useCancelBridge();
  const open = useModalsState.useAlerts().includes("gas-expensive");

  const { t } = useTranslation();
  const token = useSelectedToken();

  const totalGasCosts = useEstimateTotalNetworkFees();

  const usdPrice = useTokenPrice(token);

  const rawAmount = parseFloat(useConfigState.useRawAmount()) || 0;
  const currency = useSettingsState.useCurrency();

  const tokenFiatAmount = usdPrice
    ? `${currencySymbolMap[currency]}${formatDecimals(rawAmount * usdPrice)}`
    : undefined;

  const fees = `${currencySymbolMap[currency]}${totalGasCosts.data?.toLocaleString(
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
                <span className="text-sm text-red-500">{fees}</span>
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
