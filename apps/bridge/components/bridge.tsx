import { DeploymentType } from "@/codegen/model";
import { isSuperbridge } from "@/config/app";
import { useDeployment } from "@/hooks/use-deployment";

import { PoweredByAltLayer } from "./badges/powered-by-alt-layer-badge";
import { PoweredByConduit } from "./badges/powered-by-conduit-badge";
import { TestnetBadge } from "./badges/testnet-badge";
import { Banners } from "./banners";
import { BridgeBody } from "./bridge-body";
import { BridgeDeleted } from "./bridge-deleted";
import { BridgeHeader } from "./bridge-header";

export const Bridge = () => {
  const deployment = useDeployment();

  return (
    <main
      className="flex items-start justify-center w-screen h-screen fixed inset-0 overflow-y-auto overflow-x-hidden"
      key="bridgeMain"
    >
      <div className="w-full px-2 md:px-0  md:w-[420px] aspect-[3/4] relative mb-24 mt-28 md:mt-24 2xl:mt-32">
        <div className="flex flex-col gap-2 items-center">
          <Banners />
          <div
            className={`bg-card mx-auto rounded-[24px] md:rounded-[32px] shadow-sm w-full shrink-0 backdrop-blur-sm`}
          >
            {deployment?.deletedAt &&
            new Date(deployment.deletedAt) < new Date() ? (
              <BridgeDeleted />
            ) : (
              <>
                <BridgeHeader />
                <BridgeBody />

                {(deployment?.type === DeploymentType.testnet ||
                  (deployment?.provider === "conduit" && isSuperbridge) ||
                  (deployment?.provider === "alt-layer" && isSuperbridge)) && (
                  <div className="flex gap-2 py-1 justify-center items-center -translate-y-2">
                    {deployment?.type === DeploymentType.testnet && (
                      <TestnetBadge />
                    )}
                    {deployment?.provider === "conduit" && isSuperbridge && (
                      <PoweredByConduit />
                    )}
                    {deployment?.provider === "alt-layer" && isSuperbridge && (
                      <PoweredByAltLayer />
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
