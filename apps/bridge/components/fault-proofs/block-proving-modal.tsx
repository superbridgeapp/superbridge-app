import { useTranslation } from "react-i18next";

import { useConfigState } from "@/state/config";

import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";

export const BlockProvingModal = () => {
  const { t } = useTranslation();
  const open = useConfigState.useBlockProvingModal();
  const setOpen = useConfigState.useSetBlockProvingModal();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <div className="flex flex-col p-6 pt-8">
          <div className="flex flex-col gap-1">
            <h1 className="font-bold text-xl tracking-tight text-pretty leading-6 mr-6">
              OP Mainnet Fault Proof upgrade
            </h1>
            <p className="text-xs md:text-sm text-pretty">
              The OP Mainnet Fault Proof upgrade has been targeted for June 10.
            </p>
            <p className="text-xs md:text-sm text-pretty">
              Please come back after the upgrade is complete to prove your
              withdrawal.
            </p>
            <p>Find out more at Optimism.io or check the FAQs</p>
          </div>

          <Button onClick={() => setOpen(false)}>Ok</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
