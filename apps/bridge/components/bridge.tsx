import { DeploymentType } from "@/codegen/model";
import { isSuperbridge } from "@/config/superbridge";
import { useDeployment } from "@/hooks/use-deployment";
import { useFaultProofUpgradeTime } from "@/hooks/use-fault-proof-upgrade-time";
import { useHasWithdrawalReadyToFinalize } from "@/hooks/use-has-withdrawal-ready-to-finalize";
import { useWithdrawalsPaused } from "@/hooks/use-withdrawals-paused";

import { PoweredByAltLayer } from "./badges/powered-by-alt-layer-badge";
import { PoweredByConduit } from "./badges/powered-by-conduit-badge";
import { TestnetBadge } from "./badges/testnet-badge";
import { FaultProofsBanner } from "./banners/fault-proofs-banner";
import { HasWithdrawalReadyToFinalizeBanner } from "./banners/has-withdrawal-ready-to-finalize-banner.ts";
import { ScheduledDeletion } from "./banners/scheduled-deletion";
import { WithdrawalsPaused } from "./banners/withdrawals-paused";
import { BridgeBody } from "./bridge-body";
import { BridgeHeader } from "./bridge-header";
import { IconAlert } from "./icons";
import { UpgradePromo } from "./upgrade-promo";

export const Bridge = () => {
  const deployment = useDeployment();
  const withdrawalsPaused = useWithdrawalsPaused();
  const faultProofUpgradeTime = useFaultProofUpgradeTime(deployment);
  const hasWithdrawalReadyToFinalize = useHasWithdrawalReadyToFinalize();

  return (
    <main
      className="flex items-start justify-center w-screen h-screen fixed inset-0 overflow-y-auto overflow-x-hidden"
      key="bridgeMain"
    >
      <div className="w-full px-2 md:px-0  md:w-[420px] aspect-[3/4] relative mb-24 mt-28 md:mt-24 2xl:mt-32">
        <div className="flex flex-col gap-2 items-center">
          {/* Todo: condition for shut down notice banner */}
          <ScheduledDeletion />
          {withdrawalsPaused && <WithdrawalsPaused />}
          {faultProofUpgradeTime && <FaultProofsBanner />}
          {hasWithdrawalReadyToFinalize && (
            <HasWithdrawalReadyToFinalizeBanner />
          )}

          <div
            className={`bg-card mx-auto rounded-[24px] md:rounded-[32px] shadow-sm w-full shrink-0 backdrop-blur-sm`}
          >
            {/* TODO: conditionaly show this or show the bridge */}
            {/* Start has  shutdown notice */}
            <div className="min-h-[480px] p-10 flex flex-col gap-2 items-center justify-center">
              <div className="animate-wiggle-waggle  drop-shadow-lg mb-4">
                <IconAlert className="h-16 w-16 shrink-0" />
              </div>
              <h1 className="text-2xl font-heading text-center max-w-[320px]">
                Parallel bridge no longer available
              </h1>
              <p className="text-center text-sm text-muted-foreground">
                Please contact the{" "}
                <a className="underline" href="#">
                  Paralell team
                </a>{" "}
                for support or more information.
              </p>
            </div>
            {/* End has  shutdown notice */}

            {/* <BridgeHeader />
            <BridgeBody />
            <div className="flex gap-2 py-1 justify-center items-center -translate-y-2">
              {deployment?.type === DeploymentType.testnet && <TestnetBadge />}
              {deployment?.provider === "conduit" && isSuperbridge && (
                <PoweredByConduit />
              )}
              {deployment?.provider === "alt-layer" && isSuperbridge && (
                <PoweredByAltLayer />
              )}
            </div> */}
          </div>

          <UpgradePromo />
        </div>
      </div>
    </main>
  );
};
