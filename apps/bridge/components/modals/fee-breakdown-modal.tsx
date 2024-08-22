import { Trans, useTranslation } from "react-i18next";

import { useSelectedToken } from "@/hooks/tokens/use-token";
import { useFees } from "@/hooks/use-fees";
import { useModal } from "@/hooks/use-modal";

import { IconFees, IconSimpleFees, IconSpinner, IconSuperFast } from "../icons";
import { TokenIcon } from "../token-icon";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";

/**
 * This is Across specific atm because no other routes
 * have fees
 */
export const FeeBreakdownModal = () => {
  const { t } = useTranslation();
  const token = useSelectedToken();

  const modal = useModal("FeeBreakdown");

  const fees = useFees();

  return (
    <Dialog open={modal.isOpen} onOpenChange={modal.close}>
      <DialogContent>
        <div className="flex flex-col gap-8 p-6">
          <div className="flex flex-col gap-2 items-center text-center pt-10">
            <div className="animate-wiggle-waggle">
              <IconSimpleFees className="w-16 h-auto mb-4 fill-primary drop-shadow" />
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
                      className="flex items-center justify-between p-3 w-full"
                    >
                      <div className="flex items-center gap-2">
                        <TokenIcon token={token} className="h-6 w-6" />
                        <span className="capitalize text-xs md:text-sm ">
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
