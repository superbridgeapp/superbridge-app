import { Trans, useTranslation } from "react-i18next";

import { currencySymbolMap } from "@/constants/currency-symbol-map";
import { ModalNames } from "@/constants/modal-names";
import { useAcrossFee } from "@/hooks/across/use-across-fee";
import { useToChain } from "@/hooks/use-chain";
import { useTokenPrice } from "@/hooks/use-prices";
import { useSelectedToken } from "@/hooks/use-selected-token";
import { useConfigState } from "@/state/config";
import { useSettingsState } from "@/state/settings";

import { IconSuperFast } from "../icons";
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
    acrossFee.data && usdPrice
      ? `${currencySymbolMap[currency]}${(
          acrossFee.data * usdPrice
        ).toLocaleString("en")}`
      : undefined;
  const tokenFee = acrossFee.data
    ? `${acrossFee.data.toLocaleString("en", {
        maximumFractionDigits: 4,
      })} ${stateToken?.[to?.id ?? 0]?.symbol}`
    : "";

  return (
    <Dialog open={modals.FeeBreakdown} onOpenChange={onClose}>
      <DialogContent>
        <div className="flex flex-col gap-8 p-6">
          <div className="flex flex-col gap-2 items-center text-center pt-10">
            <div className="animate-wiggle-waggle">
              <IconSuperFast className="w-16 h-auto mb-4" />
            </div>
            <h1 className="font-heading text-2xl text-pretty">
              {t("across.feeBreakdownTitle")}
            </h1>
            <p className="text-xs md:text-sm prose-sm text-muted-foreground text-pretty text-center">
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

          <div className="flex flex-col rounded-lg border py-1">
            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center gap-2">
                <TokenIcon token={token} className="h-6 w-6" />
                <span className="font-heading text-xs md:text-sm ">
                  {t("across.acrossFee")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {fiatFee && (
                  <span className="text-xs md:text-sm text-muted-foreground">
                    {fiatFee}
                  </span>
                )}
                <span className="text-xs md:text-sm text-foreground">
                  {tokenFee ? tokenFee : "..."}
                </span>
              </div>
            </div>
          </div>

          <Button onClick={onClose}>{t("ok")}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
