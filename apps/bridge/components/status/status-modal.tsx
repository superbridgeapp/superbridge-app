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

import { Dialog, DialogContent } from "../ui/dialog";

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

  if (!deployment) {
    return <div>Not Found</div>;
  }

  const settlementChain = deployment.l1.name;
  const rollupChain = deployment.l2.name;

  const finalizationPeriod = getPeriod(
    isOptimism(deployment)
      ? deployment.proveDuration! + deployment.finalizeDuration
      : deployment.finalizeDuration
  );

  return (
    <Dialog open={!!deployment} onOpenChange={onClose}>
      <DialogContent>
        <section className="max-w-3xl mx-auto p-8">
          <header className="flex flex-col items-center py-16 gap-4">
            <img
              src={deployment?.theme?.theme.imageNetwork}
              alt={rollupChain}
              className="w-24 h-24 rounded-full"
            />
            <h1 className="font-heading text-6xl  text-center">
              {rollupChain} Status
            </h1>

            {faultProofUpgradeTime && (
              <FaultProofAlert deployment={deployment} />
            )}
          </header>

          <StatusContactModal
            open={contactModal}
            setOpen={setContactModal}
            finalizationPeriod={finalizationPeriod}
            settlementChain={settlementChain}
            rollupChain={rollupChain}
          />

          <StatusChecks deployment={deployment} />
        </section>
      </DialogContent>
    </Dialog>
  );
};

const FaultProofAlert = ({ deployment }: { deployment: DeploymentDto }) => {
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
