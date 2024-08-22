import { Trans, useTranslation } from "react-i18next";

import { useIsAcrossRoute } from "@/hooks/across/use-is-across-route";
import { useFees } from "@/hooks/use-fees";
import { useModal } from "@/hooks/use-modal";

import { IconSuperFast } from "../icons";
import { TokenIcon } from "../token-icon";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";

export const FeeBreakdownModal = () => {
  const { t } = useTranslation();

  const modal = useModal("FeeBreakdown");

  const fees = useFees();

  const isAcross = useIsAcrossRoute();

  return (
    <Dialog open={modal.isOpen} onOpenChange={modal.close}>
      <DialogContent>
        <div className="flex flex-col gap-8 p-6">
          <div className="flex flex-col gap-2 items-center text-center pt-10">
            <div className="animate-wiggle-waggle">
              <IconSuperFast className="w-16 h-auto mb-4" />
            </div>
            <h1 className="font-heading text-2xl text-pretty">
              {isAcross ? t("across.feeBreakdownTitle") : "Hyperlane fees"}
            </h1>
            <p className="text-xs md:text-sm prose-sm text-muted-foreground text-pretty text-center">
              {isAcross ? (
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
              ) : (
                "Fees paid to Hyperlane relayer for message delivery"
              )}
            </p>
          </div>

          <div className="flex flex-col rounded-lg border py-1">
            {fees.isLoading ? (
              <>Loading</>
            ) : (
              <>
                {fees.data!.fees.map((f) => {
                  return (
                    <div
                      key={f.name}
                      className="flex items-center justify-between px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <TokenIcon token={f.token.token} className="h-6 w-6" />
                        <span className="font-heading text-xs md:text-sm ">
                          {/* {t("across.acrossFee")} */}
                          {t(f.name)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {f.fiat?.formatted && (
                          <span className="text-xs md:text-sm text-muted-foreground">
                            {f.fiat.formatted}
                          </span>
                        )}
                        <span className="text-xs md:text-sm text-foreground">
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
