import { IconAlert } from "@/components/icons";
import { optimismFaultProofsUpgrade } from "@/constants/links";
import { ModalNames } from "@/constants/modal-names";
import { useDeploymentById } from "@/hooks/deployments/use-deployment-by-id";
import { useModal } from "@/hooks/use-modal";

import { Button } from "../../ui/button";
import { Dialog, DialogContent } from "../../ui/dialog";

export const BlockProvingModal = () => {
  const modal = useModal(ModalNames.BlockProving);
  const deployment = useDeploymentById(modal.data || undefined);

  return (
    <Dialog open={modal.isOpen} onOpenChange={modal.close}>
      <DialogContent>
        <div className="flex flex-col gap-8 p-6">
          <div className="flex flex-col gap-4 pt-6">
            <div className="animate-bounce mx-auto">
              <IconAlert className="w-16 h-16" />
            </div>
            <h1 className="font-heading text-xl  text-left">
              {deployment?.l2.name} Fault Proof upgrade
            </h1>
            <div className="text-xs text-left md:text-sm prose-sm  leading-relaxed  text-muted-foreground text-pretty">
              <p>
                The {deployment?.l2.name} Fault Proof upgrade has been targeted
                for June.
              </p>
              <p>
                Please come back after the upgrade is complete to prove your
                withdrawal.
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

          <Button onClick={modal.close}>Ok</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
