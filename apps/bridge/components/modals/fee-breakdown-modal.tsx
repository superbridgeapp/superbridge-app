import { Trans, useTranslation } from "react-i18next";

import { ModalNames } from "@/constants/modals";
import { useToChain } from "@/hooks/use-chain";
import { useSelectedToken } from "@/hooks/use-selected-token";
import { useConfigState } from "@/state/config";
import { currencySymbolMap } from "@/constants/currency-symbol-map";
import { useTokenPrice } from "@/hooks/use-prices";
import { useAcrossFee } from "@/hooks/use-receive-amount";
import { useSettingsState } from "@/state/settings";

import { TokenIcon } from "../token-icon";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";

export const FeeBreakdownModal = () => {
  const { t } = useTranslation();
  const token = useSelectedToken();

  const modals = useConfigState.useModals();
  const removeModal = useConfigState.useRemoveModal();
  const stateToken = useConfigState.useToken();
  const currency = useSettingsState.useCurrency();

  const to = useToChain();
  const usdPrice = useTokenPrice(stateToken);
  const acrossFee = useAcrossFee();

  const onClose = () => removeModal(ModalNames.FeeBreakdown);

  const fiatFee =
    acrossFee && usdPrice
      ? `${currencySymbolMap[currency]}${(acrossFee * usdPrice).toLocaleString(
          "en"
        )}`
      : undefined;
  const tokenFee = acrossFee
    ? `${acrossFee.toLocaleString("en", {
        maximumFractionDigits: 4,
      })} ${stateToken?.[to?.id ?? 0]?.symbol}`
    : "";

  return (
    <Dialog open={modals.FeeBreakdown} onOpenChange={onClose}>
      <DialogContent>
        <div className="flex flex-col gap-8 p-6">
          <div className="flex flex-col gap-2 items-center text-center pt-10">
            <div className="animate-bounce">Image</div>
            <h1 className="font-heading text-2xl  text-pretty">
              {t("across.feeBreakdownTitle")}
            </h1>
            <p className="text-xs md:text-sm prose-sm font-heading text-muted-foreground text-pretty text-center">
              <Trans
                i18nKey={"across.feeBreakdownDescription"}
                components={[
                  <a
                    key="name"
                    className="underline"
                    href="https://across.to"
                    target="_blank"
                  />,
                ]}
              />
            </p>
          </div>

          <div className="flex flex-col rounded-lg border">
            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center gap-2">
                <TokenIcon token={token} className="h-6 w-6" />
                <span className="font-heading text-sm ">
                  {t("across.acrossFee")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {fiatFee && (
                  <span className="text-sm text-muted-foreground">
                    {fiatFee}
                  </span>
                )}
                <span className="text-sm text-foreground">{tokenFee}</span>
              </div>
            </div>
          </div>

          <Button onClick={onClose}>{t("ok")}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
