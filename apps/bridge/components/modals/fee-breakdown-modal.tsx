import { Trans, useTranslation } from "react-i18next";

import { useIsAcrossRoute } from "@/hooks/across/use-is-across-route";
import { useFees } from "@/hooks/fees/use-fees";
import { useIsHyperlaneRoute } from "@/hooks/hyperlane/use-is-hyperlane-route";
import { useProviderName } from "@/hooks/providers/use-provider-name";
import { useSelectedBridgeRoute } from "@/hooks/routes/use-selected-bridge-route";
import { useModal } from "@/hooks/use-modal";

import { IconSimpleFees, IconSpinner } from "../icons";
import { TokenIcon } from "../token-icon";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";

export const FeeBreakdownModal = () => {
  const { t } = useTranslation();

  const modal = useModal("FeeBreakdown");

  const fees = useFees();

  const route = useSelectedBridgeRoute();

  const isAcross = useIsAcrossRoute();
  const isHyperlane = useIsHyperlaneRoute();
  const provider = useProviderName(route.data?.id ?? null);

  return (
    <Dialog open={modal.isOpen} onOpenChange={modal.close}>
      <DialogContent>
        <div className="flex flex-col gap-8 p-6">
          <div className="flex flex-col gap-2 items-center text-center pt-10">
            <IconSimpleFees className="w-16 h-auto mb-4 fill-primary drop-shadow" />

            <h1 className="font-heading text-2xl text-pretty">
              {t("feeModal.providerFees", { provider })}
            </h1>
            <p className="text-xs md:text-sm prose-sm text-muted-foreground text-pretty text-center">
              {isAcross && (
                <Trans
                  i18nKey={"feeModal.acrossFeeBreakdownDescription"}
                  components={[
                    <a
                      key="name"
                      className="underline"
                      href="https://across.to"
                      target="_blank"
                    />,
                  ]}
                />
              )}
              {isHyperlane && (
                <Trans
                  i18nKey={"feeModal.hyperlaneFeeBreakdownDescription"}
                  components={[
                    <a
                      key="name"
                      className="underline"
                      href="https://hyperlane.xyz"
                      target="_blank"
                    />,
                  ]}
                />
              )}
            </p>
          </div>

          <div className="flex flex-col rounded-lg border py-0.5 justify-center items-center divide-y">
            {fees.isLoading ? (
              <div className="p-4">
                <IconSpinner className="text-muted-foreground w-6 h-6" />
              </div>
            ) : (
              <>
                {fees.data!.fees.map((f) => {
                  return (
                    <div
                      key={f.name}
                      className="flex items-center justify-between gap-3 p-3 w-full"
                    >
                      <div className="flex items-center gap-1.5">
                        <TokenIcon token={f.token.token} className="h-5 w-5" />
                        <span className="capitalize text-xs">{t(f.name)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {f.fiat?.formatted && (
                          <span className="text-xs text-muted-foreground">
                            {f.fiat.formatted}
                          </span>
                        )}
                        <span className="text-xs text-foreground">
                          {f.token.formatted}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>

          <Button onClick={modal.close}>{t("ok")}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
