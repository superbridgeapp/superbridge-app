import { useTranslation } from "react-i18next";

import { DeploymentType } from "@/codegen/model";
import { isSuperbridge } from "@/config/superbridge";
import { useDeployment } from "@/hooks/use-deployment";
import { useWithdrawalsPaused } from "@/hooks/use-withdrawals-paused";

import { BridgeBody } from "./bridge-body";
import { BridgeHeader } from "./bridge-header";
import { WithdrawalsPaused } from "./withdrawals-paused";

export const Bridge = () => {
  const deployment = useDeployment();
  const { t } = useTranslation();
  const withdrawalsPaused = useWithdrawalsPaused();

  return (
    <main
      className="flex items-start justify-center w-screen h-screen fixed inset-0 overflow-y-auto overflow-x-hidden"
      key="bridgeMain"
    >
      <div className="w-full px-2 md:px-0  md:w-[420px] aspect-[3/4] relative mb-24 mt-16 md:mt-24 2xl:mt-32">
        <div className="flex flex-col gap-2 md:gap-2 items-center">
          {withdrawalsPaused && <WithdrawalsPaused />}

          <div
            className={`bg-card mx-auto rounded-[24px] md:rounded-[32px] shadow-sm w-full shrink-0 backdrop-blur-sm`}
          >
            <BridgeHeader />
            <BridgeBody />
          </div>

          <div className="flex gap-1">
            {deployment?.type === DeploymentType.testnet && (
              <span className="text-[10px] font-medium inline-flex items-center leading-none bg-black/30 text-white font-medium rounded-full px-3 h-6">
                Testnet
              </span>
            )}
            {deployment?.conduitId && isSuperbridge && (
              <a
                href={`https://conduit.xyz/?utm_source=${
                  isSuperbridge ? "superbridge" : "rollbridge"
                }&utm_medium=affiliate&utm_campaign=poweredby`}
                target="_blank"
                className="text-[10px] font-medium flex items-center leading-none bg-black/30 text-white font-medium rounded-full pl-1 pr-3 h-6"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  className="fill-white"
                  viewBox="0 0 32 32"
                >
                  <g opacity="0.8">
                    <path
                      d="M20.437 19.254l2.321-4.282h-2.23l-2.321 4.282h2.23z"
                      opacity="0.4"
                    ></path>
                    <path
                      d="M13.031 19.481l1.335 2.462 1.038 1.915 1.115-2.057-2.373-4.376-1.115 2.056z"
                      opacity="0.7"
                    ></path>
                    <path d="M16.75 21.659H24l-2.279-4.205-1.13 2.084-2.692-.002-1.245-2.254h-2.276l2.372 4.377z"></path>
                    <path
                      d="M16.75 21.943L15.635 24h7.25L24 21.943h-7.25z"
                      opacity="0.4"
                    ></path>
                    <path
                      d="M18.16 14.83l-1.276 2.31 1.09 1.974 2.323-4.284-3.625-6.687-2.28 4.204h2.396l1.372 2.484z"
                      opacity="0.7"
                    ></path>
                    <path d="M22.759 14.688L19.133 8h-2.23l3.627 6.688h2.229zM17.772 14.688l-1.136-2.057h-4.78l1.116 2.057h4.8z"></path>
                    <path
                      d="M11.625 12.773L8 19.46l1.114 2.055 3.625-6.688-1.114-2.055z"
                      opacity="0.7"
                    ></path>
                    <path
                      d="M14.07 16.998h2.584l1.118-2.026h-4.8L9.346 21.66h4.557l-1.18-2.177 1.346-2.484z"
                      opacity="0.4"
                    ></path>
                  </g>
                </svg>

                <span>{t("poweredByConduit")}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
