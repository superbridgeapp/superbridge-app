import { Trans, useTranslation } from "react-i18next";

import { ModalNames } from "@/constants/modal-names";
import { useSelectedToken } from "@/hooks/tokens/use-token";
import { useFees } from "@/hooks/use-fees";
import { useConfigState } from "@/state/config";

import { IconSuperFast } from "../icons";
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

  const modals = useConfigState.useModals();
  const removeModal = useConfigState.useRemoveModal();

  const onClose = () => removeModal(ModalNames.FeeBreakdown);

  const fees = useFees();

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
                        <TokenIcon token={token} className="h-6 w-6" />
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

          <Button onClick={onClose}>{t("ok")}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
