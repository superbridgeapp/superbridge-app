import { useState } from "react";

import { DeploymentDto } from "@/codegen/model";
import { IconAlert } from "@/components/icons";
import { StatusChecks } from "@/components/status/status-checks";
import { StatusContactModal } from "@/components/status/status-contact-modal";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { optimismFaultProofsUpgrade } from "@/constants/links";
import { useDeploymentStatusChecks } from "@/hooks/status/use-deployment-status-checks";
import { useFaultProofUpgradeTime } from "@/hooks/use-fault-proof-upgrade-time";
import { isOptimism } from "@/utils/deployments/is-mainnet";
import { getPeriod } from "@/utils/get-period";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

export const StatusModal = ({
  deployment,
  onClose,
}: {
  deployment: DeploymentDto | null;
  onClose: () => void;
}) => {
  const [contactModal, setContactModal] = useState(false);
  const statusChecks = useDeploymentStatusChecks(deployment);

  const faultProofUpgradeTime = useFaultProofUpgradeTime(deployment);

  const settlementChain = deployment?.l1.name;
  const rollupChain = deployment?.l2.name;

  const finalizationPeriod = getPeriod(
    deployment && isOptimism(deployment)
      ? deployment.proveDuration! + deployment.finalizeDuration
      : (deployment?.finalizeDuration ?? 0)
  );

  return (
    <Dialog open={!!deployment} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="pt-12 flex flex-col gap-4 items-center justify-center">
          <img
            src={deployment?.theme?.theme.imageNetwork}
            alt={rollupChain}
            className="w-16 h-16 rounded-full"
          />

          <DialogTitle className="tracking-tight font-heading text-center text-2xl">
            {rollupChain} Status
          </DialogTitle>
        </DialogHeader>
        <div>
          {faultProofUpgradeTime && <FaultProofAlert deployment={deployment} />}

          <StatusContactModal
            open={contactModal}
            setOpen={setContactModal}
            finalizationPeriod={finalizationPeriod}
            settlementChain={settlementChain}
            rollupChain={rollupChain}
          />

          <StatusChecks deployment={deployment} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

const FaultProofAlert = ({
  deployment,
}: {
  deployment: DeploymentDto | null;
}) => {
  return (
    <Alert size={"lg"}>
      <IconAlert className="w-6 h-6" />
      <AlertTitle>{deployment?.l2.name} Fault Proof upgrade</AlertTitle>
      <AlertDescription>
        <p>
          The {deployment?.l2.name} Fault Proof upgrade has been targeted for
          June. What does that mean for you?
        </p>
        <h3 className="text-foreground font-heading">
          I want to make a withdrawal
        </h3>
        <p>You should wait until the upgrade is complete.</p>
        <h3 className="text-foreground font-heading">
          Why should I wait until the upgrade is complete?
        </h3>
        <p>
          The upgrade will essentially wipe the status of existing prove
          operations. Any proves done now would need to be resubmitted after the
          upgrade.
        </p>
        <h3 className="text-foreground font-heading">
          I have a withdrawal in progress
        </h3>
        <p>
          If you can finalize your withdrawal before the upgrade is complete we
          highly recommend you do that.
        </p>
        <h3 className="text-foreground font-heading">
          What if I don't finalize withdrawals in progress?
        </h3>
        <p>
          You will need to prove again, wait, and then finalize after the
          upgrade is complete.
        </p>
        <p>
          <a
            href={optimismFaultProofsUpgrade}
            target="_blank"
            className="underline text-foreground font-heading"
          >
            For more info please visit optimism.io
          </a>
        </p>
      </AlertDescription>
    </Alert>
  );
};
