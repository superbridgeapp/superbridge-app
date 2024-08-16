import { useTranslation } from "react-i18next";

import { useFromChain } from "@/hooks/use-chain";
import { useModal } from "@/hooks/use-modal";

import { IconGas } from "../icons";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";

export const GasInfoModal = () => {
  const { t } = useTranslation();
  const from = useFromChain();

  const modal = useModal("GasInfo");

  return (
    <Dialog open={modal.isOpen} onOpenChange={modal.close}>
      <DialogContent>
        <div className="flex flex-col gap-8 p-6">
          <div className="flex flex-col gap-2 items-center text-center pt-10">
            <div className="animate-wiggle-waggle">
              <IconGas className="w-16 h-auto mb-4" />
            </div>
            <h1 className="font-heading text-2xl text-pretty">{"Gas fees"}</h1>
            <p className="text-xs md:text-sm prose-sm text-muted-foreground text-pretty text-center">
              With blockchains you need to pay a fee to submit transactions.
              Transactions submitted to {from?.name} require a small amount of{" "}
              {from?.nativeCurrency.symbol} to ensure they're confirmed by the
              network.
            </p>
          </div>

          <Button onClick={modal.close}>{t("ok")}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};