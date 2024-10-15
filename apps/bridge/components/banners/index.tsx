import { useDeployment } from "@/hooks/deployments/use-deployment";
import { useFaultProofUpgradeTime } from "@/hooks/use-fault-proof-upgrade-time";
import { useHasWithdrawalReadyToFinalize } from "@/hooks/use-has-withdrawal-ready-to-finalize";
import { useDeletedAt } from "@/hooks/use-metadata";

import { FaultProofsBanner } from "./fault-proofs-banner";
import { HasWithdrawalReadyToFinalizeBanner } from "./has-withdrawal-ready-to-finalize-banner.ts";
import { ScheduledDeletion } from "./scheduled-deletion";

export const Banners = () => {
  const deployment = useDeployment();
  const deletedAt = useDeletedAt();
  // const withdrawalsPaused = useBridgePaused();
  const faultProofUpgradeTime = useFaultProofUpgradeTime(deployment);
  const hasWithdrawalReadyToFinalize = useHasWithdrawalReadyToFinalize();

  return (
    <>
      {deletedAt && deletedAt > Date.now() && <ScheduledDeletion />}
      {/* TODO: think about withdrawals paused banner */}
      {/* {withdrawalsPaused && <WithdrawalsPaused />} */}
      {faultProofUpgradeTime && <FaultProofsBanner />}
      {hasWithdrawalReadyToFinalize && <HasWithdrawalReadyToFinalizeBanner />}
    </>
  );
};
