import { useDeployment } from "@/hooks/use-deployment";
import { useFaultProofUpgradeTime } from "@/hooks/use-fault-proof-upgrade-time";
import { useHasWithdrawalReadyToFinalize } from "@/hooks/use-has-withdrawal-ready-to-finalize";

import { FaultProofsBanner } from "./fault-proofs-banner";
import { HasWithdrawalReadyToFinalizeBanner } from "./has-withdrawal-ready-to-finalize-banner.ts";
import { ScheduledDeletion } from "./scheduled-deletion";

export const Banners = () => {
  const deployment = useDeployment();
  // const withdrawalsPaused = useBridgePaused();
  const faultProofUpgradeTime = useFaultProofUpgradeTime(deployment);
  const hasWithdrawalReadyToFinalize = useHasWithdrawalReadyToFinalize();

  return (
    <>
      {deployment?.deletedAt && new Date(deployment.deletedAt) > new Date() && (
        <ScheduledDeletion />
      )}
      {/* TODO: think about withdrawals paused banner */}
      {/* {withdrawalsPaused && <WithdrawalsPaused />} */}
      {faultProofUpgradeTime && <FaultProofsBanner />}
      {hasWithdrawalReadyToFinalize && <HasWithdrawalReadyToFinalizeBanner />}
    </>
  );
};
