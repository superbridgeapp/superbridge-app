import { useTranslation } from "react-i18next";

import { useIsCctpRoute } from "@/hooks/cctp/use-is-cctp-route";
import { useFromChain } from "@/hooks/use-chain";
import { useModal } from "@/hooks/use-modal";
import {
  useIsArbitrumWithdrawal,
  useIsOptimismWithdrawal,
} from "@/hooks/use-withdrawing";

import { IconGas } from "../icons";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";

export const GasInfoModal = () => {
  const { t } = useTranslation();
  const from = useFromChain();

  const modal = useModal("GasInfo");

  const isOptimismWithdrawal = useIsOptimismWithdrawal();
  const isArbitrumWithdrawal = useIsArbitrumWithdrawal();
  const isCctp = useIsCctpRoute();

  const description = isOptimismWithdrawal
    ? "Withdrawals from OP Stack rollups require two extra transactions to prove & finalize the withdrawal on the settlement chain."
    : isArbitrumWithdrawal
    ? "Withdrawals from Arbitrum Nitro rollups require an extra transaction to finalize on the settlement chain."
    : isCctp
    ? "Native USDC bridges via CCTP require an extra transaction on the destination chain."
    : null;

  return (
    <Dialog open={modal.isOpen} onOpenChange={modal.close}>
      <DialogContent>
        <div className="flex flex-col gap-8 p-6">
          <div className="flex flex-col gap-2 items-center text-center pt-10">
            <div className="animate-wiggle-waggle">
              <IconGas className="w-16 h-auto mb-4" />
            </div>
            <h1 className="font-heading text-2xl text-pretty">
              {t("gasInfoModal.title")}
            </h1>
            <p className="text-xs md:text-sm prose-sm text-muted-foreground text-pretty text-center">
              {t("gasInfoModal.description", {
                from: from?.name,
                symbol: from?.nativeCurrency.symbol,
              })}
            </p>
          </div>

          <p className="text-xs md:text-sm prose-sm text-muted-foreground text-pretty text-center">
            {description}
          </p>

          <Button onClick={modal.close}>{t("ok")}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
