import { useTranslation } from "react-i18next";

import { useSelectedToken } from "@/hooks/tokens/use-token";
import { useToChain } from "@/hooks/use-chain";
import { useFiatAmount } from "@/hooks/use-fiat-amount";
import { useModal } from "@/hooks/use-modal";
import { useApproxTotalBridgeTimeText } from "@/hooks/use-transfer-time";

import { IconTime } from "../icons";
import { TokenIcon } from "../token-icon";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Skeleton } from "../ui/skeleton";

const Content = () => {
  const { t } = useTranslation();
  const to = useToChain();
  const token = useSelectedToken();

  const modal = useModal("TransferTime");

  const transferTime = useApproxTotalBridgeTimeText();

  const { fiatAmount, rawAmount } = useFiatAmount();

  return (
    <div className="flex flex-col gap-8 p-6">
      <div className="flex flex-col gap-2 items-center text-center pt-8">
        <div className="animate-wiggle-waggle">
          <IconTime className="w-16 h-auto mb-4" />
        </div>
        <h1 className="font-heading text-2xl text-pretty">
          {t("across.transferTimeTitle")}
        </h1>
        <p className="text-xs md:text-sm prose-sm text-muted-foreground text-pretty text-center">
          {t("across.transferTimeDescription")}
        </p>
      </div>

      <div className="flex flex-col rounded-lg border py-1">
        <div className="flex items-center justify-between border-b px-3 py-2">
          <div className="flex items-center gap-2">
            <TokenIcon token={token} className="h-6 w-6" />
            <span className="font-heading text-xs md:text-sm ">
              {t("expensiveGasModal.bridgeAmount")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {fiatAmount && (
              <span className="text-xs md:text-sm text-muted-foreground">
                {fiatAmount}
              </span>
            )}
            <span className="text-xs md:text-sm text-foreground">
              {rawAmount} {token?.symbol}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2">
            <IconTime className="h-6 w-6" />
            <span className="font-heading text-xs md:text-sm">
              {t("across.timeTo", { to: to?.name })}
            </span>
          </div>
          <span className="text-xs md:text-sm">
            {transferTime.isLoading ? (
              <Skeleton className="h-4 w-[88px]" />
            ) : transferTime.data ? (
              <>15 secs - {transferTime.data.slice(1)}</>
            ) : (
              "…"
            )}
          </span>
        </div>
      </div>

      <Button onClick={modal.close}>{t("ok")}</Button>
    </div>
  );
};

export const TransferTimeInfoModal = () => {
  const modal = useModal("TransferTime");

  return (
    <Dialog open={modal.isOpen} onOpenChange={modal.close}>
      <DialogContent>
        <Content />
      </DialogContent>
    </Dialog>
  );
};
