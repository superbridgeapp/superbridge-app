import { IconAlert } from "@/components/icons";
import { optimismFaultProofsUpgrade } from "@/constants/links";
import { useDeployment } from "@/hooks/deployments/use-deployment";
import { useModal } from "@/hooks/use-modal";
import { useConfigState } from "@/state/config";

import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";

export const WithdrawalReadyToFinalizeModal = () => {
  const deployment = useDeployment();
  const modal = useModal("WithdrawalReadyToFinalize");
  const setDisplayTransactions = useConfigState.useSetDisplayTransactions();

  return (
    <Dialog open={modal.isOpen} onOpenChange={modal.close}>
      <DialogContent>
        <div className="flex flex-col gap-8 p-6">
          <div className="flex flex-col gap-4 pt-6">
            <div className="animate-bounce mx-auto">
              <IconAlert className="w-16 h-16" />
            </div>
            <h1 className="font-heading text-xl  text-left">
              Finalize your withdrawals before {deployment?.l2.name} Fault Proof
              upgrade
            </h1>
            <div className="text-xs text-left md:text-sm prose-sm  leading-relaxed  text-muted-foreground text-pretty">
              <p>
                The {deployment?.l2.name} Fault Proof upgrade has been targeted
                for June 10.
              </p>
              <p>
                We recommend you finalize your withdrawals before the upgrade is
                complete or you will need to prove again then wait a further 7
                days.
              </p>
              <p>
                Find out more at{" "}
                <a
                  href={optimismFaultProofsUpgrade}
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
          <Button
            onClick={() => {
              modal.close();
              setDisplayTransactions(true);
            }}
          >
            Ok
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
