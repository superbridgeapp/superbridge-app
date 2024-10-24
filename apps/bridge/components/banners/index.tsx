import { useDeployments } from "@/hooks/deployments/use-deployments";
import { useFaultProofUpgradeTime } from "@/hooks/use-fault-proof-upgrade-time";
import { useDeletedAt } from "@/hooks/use-metadata";

import { FaultProofsBanner } from "./fault-proofs-banner";
import { ScheduledDeletion } from "./scheduled-deletion";

export const Banners = () => {
  const deletedAt = useDeletedAt();

  const faultProofUpgradeTime = useFaultProofUpgradeTime(
    useDeployments().find((x) => x.name === "base")
  );

  return (
    <>
      {deletedAt && deletedAt > Date.now() && <ScheduledDeletion />}
      {faultProofUpgradeTime && <FaultProofsBanner />}
    </>
  );
};
