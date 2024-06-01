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

          {/* STACK TODO: conoslidate icons into a useful file to import */}
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
            <AlertTitle>
              Some users are experiencing issues with Etherscan.
            </AlertTitle>
            <AlertDescription>
              {/* I guess optional link */}
              <a
                href={"https://x.com/superbridgeapp"}
                target="_blank"
                className="hover:underline"
              >
                Get updates
              </a>
            </AlertDescription>
          </Alert>
          <Alert variant={"destructive"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="w-6 h-6"
            >
              <path
                d="M3.18701 13.1266C3.18701 15.7256 4.7296 17.2581 7.28829 17.2581C7.61357 17.2581 7.89861 17.5331 7.89861 17.8483V20.2427C7.89861 20.5579 8.15348 20.8128 8.47876 20.8128C8.80405 20.8128 9.05891 20.5478 9.05891 20.2326V19.2769C9.05891 18.9516 9.32383 18.6766 9.64912 18.6766C9.9744 18.6766 10.2494 18.9516 10.2494 19.2769V20.2326C10.2494 20.5478 10.5143 20.8128 10.8295 20.8128C11.1448 20.8128 11.4097 20.5478 11.4097 20.2326V19.2769C11.4097 18.9516 11.6847 18.6766 12.01 18.6766C12.3352 18.6766 12.6102 18.9516 12.6102 19.2769V20.2326C12.6102 20.5478 12.8651 20.8128 13.1904 20.8128C13.5156 20.8128 13.7705 20.5478 13.7705 20.2326V19.2769C13.7705 18.9516 14.0354 18.6766 14.3708 18.6766C14.7061 18.6766 14.961 18.9516 14.961 19.2769V20.2326C14.961 20.5478 15.2259 20.8128 15.5411 20.8128C15.8564 20.8128 16.1213 20.5478 16.1213 20.2326V17.8684C16.1213 17.523 16.4063 17.2581 16.7216 17.2581C19.1796 17.2581 20.8329 15.6753 20.8329 13.1266C20.8329 10.578 19.9409 7.96904 18.2239 6.08104C16.5807 4.25341 14.4177 3.18701 12.02 3.18701C9.62229 3.18701 7.46267 4.25341 5.81612 6.08104C4.12933 7.9288 3.20713 10.5076 3.20713 13.1266H3.18701Z"
                fill="white"
              />
              <path
                d="M13.2575 10.397C13.2575 8.92488 14.4547 7.71764 15.9269 7.71764C17.3991 7.71764 18.6063 8.91482 18.6063 10.397C18.6063 11.8793 17.4091 13.0664 15.9269 13.0664C14.4447 13.0664 13.2575 11.8592 13.2575 10.397ZM10.7928 14.2636C10.7928 13.4118 11.279 12.3555 12.0302 12.3555C12.7814 12.3555 13.2676 13.4219 13.2676 14.2636C13.2676 14.5285 13.1871 14.7498 13.0228 14.9041C12.7881 15.1388 12.4628 15.1489 12.1509 15.1489H11.9698C11.6345 15.1489 11.279 15.1489 11.0241 14.9041C10.8732 14.7532 10.7894 14.5285 10.7894 14.2636H10.7928ZM3.18712 13.1268C3.18712 15.7257 4.72971 17.2582 7.2884 17.2582C7.61368 17.2582 7.89873 17.5332 7.89873 17.8484V20.2428C7.89873 20.558 8.15359 20.8129 8.47887 20.8129C8.80416 20.8129 9.05902 20.548 9.05902 20.2327V19.277C9.05902 18.9517 9.32394 18.6767 9.64923 18.6767C9.97451 18.6767 10.2495 18.9517 10.2495 19.277V20.2327C10.2495 20.548 10.5144 20.8129 10.8296 20.8129C11.1449 20.8129 11.4098 20.548 11.4098 20.2327V19.277C11.4098 18.9517 11.6848 18.6767 12.0101 18.6767C12.3353 18.6767 12.6103 18.9517 12.6103 19.277V20.2327C12.6103 20.548 12.8652 20.8129 13.1905 20.8129C13.5158 20.8129 13.7706 20.548 13.7706 20.2327V19.277C13.7706 18.9517 14.0355 18.6767 14.3709 18.6767C14.7062 18.6767 14.9611 18.9517 14.9611 19.277V20.2327C14.9611 20.548 15.226 20.8129 15.5412 20.8129C15.8565 20.8129 16.1214 20.548 16.1214 20.2327V17.8685C16.1214 17.5231 16.4064 17.2582 16.7217 17.2582C19.1797 17.2582 20.833 15.6754 20.833 13.1268C20.833 10.5781 19.941 7.96915 18.224 6.08115C16.5808 4.25352 14.4178 3.18712 12.0201 3.18712C9.6224 3.18712 7.46278 4.25352 5.81623 6.08115C4.12944 7.92891 3.20724 10.5077 3.20724 13.1268H3.18712ZM2 13.1268C2 10.2227 2.99598 7.41248 4.90409 5.28974C6.69148 3.25755 9.23675 2 12 2C14.7632 2 17.2783 3.22736 19.0959 5.28974C21.004 7.41248 22 10.2227 22 13.1268C22 16.0309 20.3568 17.9893 17.2985 18.4252V20.2529C17.2985 21.2186 16.497 22 15.5211 22C15.0751 22 14.6593 21.839 14.3541 21.554C14.0188 21.8491 13.613 22 13.1771 22C12.7411 22 12.3052 21.839 12 21.554C11.6948 21.839 11.2689 22 10.8229 22C10.3769 22 9.9611 21.839 9.64588 21.554C9.34071 21.839 8.92488 22 8.47887 22C7.49296 22 6.70154 21.2086 6.70154 20.2327V18.4353C3.86787 18.2207 2 16.2119 2 13.1268ZM8.10999 13.0664C6.63783 13.0664 5.44064 11.8592 5.44064 10.397C5.44064 8.93494 6.63783 7.71764 8.10999 7.71764C9.58216 7.71764 10.7894 8.91482 10.7894 10.397C10.7894 11.8793 9.59222 13.0664 8.10999 13.0664Z"
                fill="black"
              />
            </svg>
            <AlertTitle>OH NO!</AlertTitle>
            <AlertDescription>
              This is a destructive variant...
            </AlertDescription>
          </Alert>

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
