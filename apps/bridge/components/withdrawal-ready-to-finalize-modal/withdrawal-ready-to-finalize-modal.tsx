import { useTranslation } from "react-i18next";

import { useConfigState } from "@/state/config";

import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";

export const WithdrawalReadyToFinalizeModal = () => {
  const open = useConfigState.useHasWithdrawalReadyToFinalizeModal();
  const setOpen = useConfigState.useSetHasWithdrawalReadyToFinalizeModal();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <div className="flex flex-col p-6 pt-8">
          <div className="flex flex-col gap-1">
            <h1 className="font-bold text-xl tracking-tight text-pretty leading-6 mr-6">
              Finalize your withdrawals before OP Mainnet Fault Proof upgrade
            </h1>
            <p className="text-xs md:text-sm text-pretty">
              The OP Mainnet Fault Proof upgrade has been targeted for June 10.
            </p>
            <p className="text-xs md:text-sm text-pretty">
              We recommend you finalize your withdrawals before the upgrade is
              complete or you will need to prove again then wait a further 7
              days.
            </p>
            <p>Find out more at Optimism.io or check the FAQs</p>
          </div>

          <Button onClick={() => setOpen(false)}>Ok</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
