import { useTranslation } from "react-i18next";

import { DeploymentType } from "@/codegen/model";
import { isSuperbridge } from "@/config/superbridge";
import { useDeployment } from "@/hooks/use-deployment";
import { useWithdrawalsPaused } from "@/hooks/use-withdrawals-paused";

import { BridgeBody } from "./bridge-body";
import { BridgeHeader } from "./bridge-header";
import { WithdrawalsPaused } from "./withdrawals-paused";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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

          {/* Start Fault Proof Alert */}
          <Alert>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="w-6 h-6"
            >
              <path
                d="M10.9641 8.63807C10.9641 8.13825 11.1894 7.86018 11.6575 7.86018C12.1257 7.86018 12.3615 8.13825 12.3615 8.63807C12.3615 9.1379 11.8511 13.5413 11.742 14.372C11.7315 14.467 11.7103 14.562 11.6575 14.562C11.6047 14.562 11.5836 14.4881 11.5731 14.3579C11.478 13.5378 10.9641 9.11678 10.9641 8.63455V8.63807ZM10.9641 18.2474C10.9641 17.8743 11.2739 17.5645 11.6575 17.5645C12.0412 17.5645 12.3404 17.8743 12.3404 18.2474C12.3404 18.6205 12.0306 18.9408 11.6575 18.9408C11.2844 18.9408 10.9641 18.631 10.9641 18.2474ZM2.65015 21.9996H20.6473C22.0342 21.9996 22.7029 20.9014 22.0553 19.7081L13.0092 2.99921C12.2841 1.66869 11.0486 1.66869 10.3235 2.98865L1.24571 19.6976C0.605095 20.8908 1.26683 21.9996 2.65367 21.9996H2.65015Z"
                fill="#FFFF55"
              />
              <path
                d="M9.68292 8.63813C9.68292 9.20132 10.2355 13.6258 10.3763 14.5727C10.4925 15.3822 10.9958 15.8398 11.6541 15.8398C12.358 15.8398 12.8051 15.3189 12.9212 14.5727C13.1571 13.1014 13.6358 9.20132 13.6358 8.63813C13.6358 7.58217 12.8262 6.58252 11.6541 6.58252C10.4819 6.58252 9.68292 7.59625 9.68292 8.63813ZM11.6646 20.2291C12.7417 20.2291 13.6252 19.3456 13.6252 18.2369C13.6252 17.1281 12.7417 16.2763 11.6646 16.2763C10.5875 16.2763 9.67236 17.1598 9.67236 18.2369C9.67236 19.314 10.5559 20.2291 11.6646 20.2291Z"
                fill="white"
              />
              <path
                d="M10.9641 8.63807C10.9641 8.13825 11.1894 7.86018 11.6575 7.86018C12.1257 7.86018 12.3615 8.13825 12.3615 8.63807C12.3615 9.1379 11.8511 13.5413 11.742 14.372C11.7315 14.467 11.7103 14.562 11.6575 14.562C11.6047 14.562 11.5836 14.4881 11.5731 14.3579C11.478 13.5378 10.9641 9.11678 10.9641 8.63455V8.63807ZM10.9641 18.2474C10.9641 17.8743 11.2739 17.5645 11.6575 17.5645C12.0412 17.5645 12.3404 17.8743 12.3404 18.2474C12.3404 18.6205 12.0306 18.9408 11.6575 18.9408C11.2844 18.9408 10.9641 18.631 10.9641 18.2474ZM9.68288 8.63807C9.68288 9.20125 10.2355 13.6258 10.3763 14.5726C10.4925 15.3822 10.9958 15.8398 11.654 15.8398C12.358 15.8398 12.805 15.3188 12.9212 14.5726C13.157 13.1013 13.6357 9.20125 13.6357 8.63807C13.6357 7.58211 12.8261 6.58246 11.654 6.58246C10.4819 6.58246 9.68288 7.59619 9.68288 8.63807ZM9.67232 18.2368C9.67232 19.3456 10.5558 20.2291 11.6646 20.2291C12.7733 20.2291 13.6252 19.3456 13.6252 18.2368C13.6252 17.128 12.7417 16.2762 11.6646 16.2762C10.5875 16.2762 9.67232 17.1597 9.67232 18.2368ZM2.3756 20.3171L11.4534 3.60815C11.742 3.06609 11.5907 3.06609 11.8793 3.59759L20.9254 20.3065C21.1718 20.7535 21.1929 20.7218 20.6473 20.7218H2.65015C2.10809 20.7218 2.12921 20.7535 2.37208 20.3171H2.3756ZM2.65015 21.9996H20.6473C22.0342 21.9996 22.7029 20.9014 22.0553 19.7081L13.0092 2.99921C12.2841 1.66869 11.0486 1.66869 10.3235 2.98865L1.24571 19.6976C0.605095 20.8908 1.26683 21.9996 2.65367 21.9996H2.65015Z"
                fill="black"
              />
            </svg>
            <AlertTitle>OP Mainnet Fault Proof upgrade</AlertTitle>
            <AlertDescription>
              <p>
                Withdrawals initiated after 12am UTC June 3 will need to be
                proved again after the upgrade, which will be at least 7 days
                later.
              </p>
              <p>
                <a
                  href="https://superbridge.app/support/optimism"
                  target="_blank"
                  className="hover:underline text-foreground font-bold"
                >
                  More info…
                </a>
              </p>
            </AlertDescription>
          </Alert>
          {/* End Fault Proof Alert */}

          <div
            className={`bg-card mx-auto rounded-[24px] md:rounded-[32px] shadow-sm w-full shrink-0 backdrop-blur-sm`}
          >
            <BridgeHeader />
            <BridgeBody />
          </div>

          <div className="flex gap-1">
            {deployment?.type === DeploymentType.testnet && (
              <span className="text-[10px] font-medium inline-flex items-center leading-none bg-card text-foreground font-medium rounded-full px-3 h-6">
                Testnet
              </span>
            )}
            {deployment?.conduitId && isSuperbridge && (
              <a
                href={`https://conduit.xyz/?utm_source=${
                  isSuperbridge ? "superbridge" : "rollbridge"
                }&utm_medium=affiliate&utm_campaign=poweredby`}
                target="_blank"
                className="text-[10px] font-medium flex items-center leading-none bg-card text-foreground font-medium rounded-full pl-1 pr-3 h-6"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  className="fill-muted-foreground"
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
