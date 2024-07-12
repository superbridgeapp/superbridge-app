import { useTranslation } from "react-i18next";

import { DeploymentType } from "@/codegen/model";
import { isSuperbridge } from "@/config/superbridge";
import { useDeployment } from "@/hooks/use-deployment";
import { useFaultProofUpgradeTime } from "@/hooks/use-fault-proof-upgrade-time";
import { useHasWithdrawalReadyToFinalize } from "@/hooks/use-has-withdrawal-ready-to-finalize";
import { useWithdrawalsPaused } from "@/hooks/use-withdrawals-paused";

import { FaultProofsBanner } from "./banners/fault-proofs-banner";
import { HasWithdrawalReadyToFinalizeBanner } from "./banners/has-withdrawal-ready-to-finalize-banner.ts";
import { WithdrawalsPaused } from "./banners/withdrawals-paused";
import { BridgeBody } from "./bridge-body";
import { BridgeHeader } from "./bridge-header";
import { UpgradePromo } from "./upgrade-promo";

export const Bridge = () => {
  const deployment = useDeployment();
  const { t } = useTranslation();
  const withdrawalsPaused = useWithdrawalsPaused();
  const faultProofUpgradeTime = useFaultProofUpgradeTime(deployment);
  const hasWithdrawalReadyToFinalize = useHasWithdrawalReadyToFinalize();
  // todo: Get proper variable
  const altlayerId = false;

  return (
    <main
      className="flex items-start justify-center w-screen h-screen fixed inset-0 overflow-y-auto overflow-x-hidden"
      key="bridgeMain"
    >
      <div className="w-full px-2 md:px-0  md:w-[420px] aspect-[3/4] relative mb-24 mt-28 md:mt-24 2xl:mt-32">
        <div className="flex flex-col gap-2 items-center">
          {withdrawalsPaused && <WithdrawalsPaused />}
          {faultProofUpgradeTime && <FaultProofsBanner />}
          {hasWithdrawalReadyToFinalize && (
            <HasWithdrawalReadyToFinalizeBanner />
          )}

          <div
            className={`bg-card mx-auto rounded-[24px] md:rounded-[32px] shadow-sm w-full shrink-0 backdrop-blur-sm`}
          >
            <BridgeHeader />
            <BridgeBody />
            <div className="flex gap-2 py-1 justify-center items-center -translate-y-2">
              {deployment?.type === DeploymentType.testnet && (
                <span className="text-[9px] inline-flex items-center leading-none bg-muted text-foreground tracking-tighter rounded-full px-3 h-5">
                  Testnet
                </span>
              )}
              {deployment?.conduitId && isSuperbridge && (
                <a
                  href={`https://conduit.xyz/?utm_source=superbridge&utm_medium=affiliate&utm_campaign=poweredby`}
                  target="_blank"
                  className="text-[9px] tracking-tighter flex gap-1 items-center leading-none text-muted-foreground"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="73"
                    height="81"
                    viewBox="0 0 73 81"
                    fill="none"
                    className="fill-muted-foreground w-3 h-3"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M60.7269 40.4952C62.6351 40.656 64.534 41.2327 66.3019 42.2632C72.7047 46.0021 74.9029 54.2789 71.2034 60.75C67.5039 67.2211 59.3144 69.4427 52.9116 65.7037C51.1437 64.6733 49.6985 63.2979 48.6088 61.7096C49.4272 63.4585 49.8903 65.406 49.8903 67.4669C49.8903 74.9402 43.8943 81 36.5 81C29.1056 81 23.1097 74.9402 23.1097 67.4669C23.1097 65.406 23.5727 63.4585 24.3912 61.7096C23.2968 63.2979 21.8563 64.6733 20.0884 65.7037C13.6855 69.4427 5.49609 67.2211 1.7966 60.75C-1.90293 54.2742 0.295282 45.9973 6.69808 42.2632C8.466 41.2327 10.3649 40.656 12.2731 40.4952C10.3649 40.3346 8.466 39.7673 6.69808 38.7368C0.295282 34.9979 -1.90293 26.7211 1.7966 20.25C5.49609 13.7789 13.6855 11.5573 20.0884 15.2963C21.8516 16.3267 23.2921 17.7069 24.3819 19.2952C23.568 17.5463 23.1097 15.594 23.1097 13.5331C23.1097 6.05981 29.1056 0 36.5 0C43.8943 0 49.8903 6.05981 49.8903 13.5331C49.8903 15.594 49.4319 17.5463 48.6181 19.2952C49.7079 17.7069 51.1437 16.3267 52.9116 15.2963C59.3144 11.5573 67.5039 13.7789 71.2034 20.25C74.9029 26.7211 72.7047 34.9979 66.3019 38.7368C64.534 39.7673 62.6351 40.3346 60.7269 40.4952ZM47.2992 59.313C45.695 55.5267 45.8166 51.0552 48.0101 47.2169C50.2036 43.3787 53.9733 41.0388 58.0189 40.5472L36.5047 40.5L47.2197 21.6444C44.7783 24.9391 40.8824 27.0709 36.5 27.0709C32.1176 27.0709 28.2217 24.9391 25.7803 21.6444L36.4953 40.5L14.9811 40.5472C19.022 41.0342 22.7964 43.3787 24.9899 47.2169C27.1834 51.0552 27.3003 55.5267 25.7008 59.313L36.5 40.5094L47.2992 59.313Z"
                    />
                  </svg>

                  <span>{t("poweredByConduit")}</span>
                </a>
              )}
              {/* TODO Proper condition here */}
              {/* TODO: Get unique link so AltLayer can track */}
              {altlayerId && isSuperbridge && (
                <a
                  href={`https://www.altlayer.io/`}
                  target="_blank"
                  className="text-[9px] tracking-tighter flex gap-1 items-center leading-none text-muted-foreground"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="fill-muted-foreground w-3 h-3"
                  >
                    <g clip-path="url(#clip0_54_30)">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M0.130989 4.9353C-0.0436632 5.07502 -0.043663 5.34065 0.130989 5.48038L1.03681 6.20503C1.16505 6.30762 1.34746 6.30693 1.47492 6.20337L6.64181 2.00527C6.72338 1.939 6.77074 1.8395 6.77074 1.73439V0.349677C6.77074 0.05702 6.43222 -0.105684 6.20369 0.0771368L0.130989 4.9353ZM1.69122 9.16859C1.56375 9.27215 1.38133 9.27281 1.25309 9.17026L0.420771 8.50437C0.246965 8.36532 0.245965 8.10132 0.418712 7.96095L6.20163 3.26233C6.42972 3.07701 6.77074 3.23932 6.77074 3.53321V4.87533C6.77074 4.98043 6.72338 5.07993 6.64181 5.14621L1.69122 9.16859ZM0.634998 10.9261C0.462251 11.0665 0.463251 11.3306 0.637057 11.4695L6.20369 15.9228C6.43222 16.1057 6.77074 15.943 6.77074 15.6503V13.5844V10.7922V6.67414C6.77074 6.38025 6.42972 6.21794 6.20163 6.40326L0.634998 10.9261ZM7.46881 15.534C7.46881 15.845 7.84473 16.0007 8.06459 15.7808L15.5985 8.24677C15.7348 8.11048 15.7348 7.88953 15.5985 7.75324L8.06459 0.219389C7.84473 -0.000481107 7.46881 0.155242 7.46881 0.466185V15.534Z"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_54_30">
                        <rect width="16" height="16" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  {/* Todo: Get translations */}
                  <span>Powered by AltLayer</span>
                </a>
              )}
            </div>
          </div>

          <UpgradePromo />
        </div>
      </div>
    </main>
  );
};
