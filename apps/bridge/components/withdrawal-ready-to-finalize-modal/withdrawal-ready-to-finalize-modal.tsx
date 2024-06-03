import { useTranslation } from "react-i18next";

import { useConfigState } from "@/state/config";

import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { IconAlert } from "@/components/icons";

export const WithdrawalReadyToFinalizeModal = () => {
  const open = useConfigState.useHasWithdrawalReadyToFinalizeModal();
  const setOpen = useConfigState.useSetHasWithdrawalReadyToFinalizeModal();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <div className="flex flex-col gap-8 p-6">
          <div className="flex flex-col gap-4 pt-6">
            <div className="animate-bounce mx-auto">
              <IconAlert className="w-16 h-16" />
            </div>
            <h1 className="font-bold text-xl tracking-tighter text-left">
              Finalize your withdrawals before OP Mainnet Fault Proof upgrade
            </h1>
            <div className="text-xs text-left md:text-sm prose-sm tracking-tight leading-relaxed font-medium text-muted-foreground text-pretty">
              <p>
                The OP Mainnet Fault Proof upgrade has been targeted for June
                10.
              </p>
              <p>
                We recommend you finalize your withdrawals before the upgrade is
                complete or you will need to prove again then wait a further 7
                days.
              </p>
              <p>
                Find out more at{" "}
                <a
                  href="https://optimism.io"
                  target="_blank"
                  className="text-foreground underline"
                >
                  optimism.io
                </a>{" "}
                or check the{" "}
                <a
                  href="https://superbridge.app/support/optimism"
                  target="_blank"
                  className="text-foreground underline"
                >
                  FAQs
                </a>
                .
              </p>
            </div>
          </div>
          <Button onClick={() => setOpen(false)}>Ok</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
