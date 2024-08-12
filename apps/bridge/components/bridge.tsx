import { useDeployment } from "@/hooks/deployments/use-deployment";

import { Banners } from "./banners";
import { BridgeBadges } from "./bridge-badges";
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
      <div className="w-full px-2 md:px-0  md:w-[468px] relative mb-24 mt-28 md:mt-24 2xl:mt-32">
        <div className="flex flex-col gap-2 items-center">
          <Banners />
          <div>
            {deployment?.deletedAt &&
            new Date(deployment.deletedAt) < new Date() ? (
              <div
                className={`bg-card mx-auto rounded-[24px] md:rounded-[32px] shadow-sm w-full shrink-0 backdrop-blur-sm`}
              >
                <BridgeDeleted />
              </div>
            ) : (
              <>
                {/* TODO: maybe need a isWidget flag here to alter layout accordingly*/}
                <BridgeHeader />
                <div
                  className={`bg-card mx-auto rounded-t-[24px] rounded-b-[32px] shadow-sm w-full shrink-0 backdrop-blur-sm`}
                >
                  <BridgeBody />
                  <BridgeBadges />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
