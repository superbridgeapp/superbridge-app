import { useTheme } from "next-themes";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import BaseDog from "@/components/basedog";
import { dedicatedDeployment } from "@/config/dedicated-deployment";
import { deploymentTheme } from "@/config/theme";
import { useToggleWithdrawing } from "@/hooks/use-toggle-withdrawing";
import { useConfigState } from "@/state/config";
import { isDog } from "@/utils/is-dog";

export const BridgeHeader = () => {
  const withdrawing = useConfigState.useWithdrawing();
  const deployment = useConfigState.useDeployment();
  const stateToken = useConfigState.useToken();
  const toggleWithdrawing = useToggleWithdrawing();
  const { resolvedTheme } = useTheme();
  const { t } = useTranslation();

  const theme = deploymentTheme(deployment);

  return (
    <div>
      <div className="flex items-center justify-between px-4 md:px-6 pt-3 md:pt-6 pb-2 md:pb-8">
        {dedicatedDeployment ? (
          <>
            <div className="flex items-center space-x-2 w-full">
              <div
                className={`${theme.bgMuted} flex p-1 rounded-full transition-colors w-full`}
              >
                <div
                  role="button"
                  className={`rounded-full px-3 py-1 cursor-pointer transition-colors duration-200 flex-1 text-center ${
                    !withdrawing ? theme.accentBg : "bg-transparent"
                  } `}
                  onClick={toggleWithdrawing}
                >
                  <span
                    className={`text-xs font-medium leading-3 -translate-y-px inline-flex hover:${
                      theme.textColorMuted
                    } ${!withdrawing ? theme.accentText : "bg-transparent"}`}
                  >
                    {t("deposit")}
                  </span>
                </div>
                <div
                  role="button"
                  className={`rounded-full px-3 py-1 cursor-pointer transition-colors duration-200 flex-1 text-center ${
                    withdrawing ? theme.accentBg : "bg-transparent"
                  }`}
                  onClick={toggleWithdrawing}
                >
                  <span
                    className={`text-xs font-medium leading-3 -translate-y-px inline-flex hover:${
                      theme.textColorMuted
                    } ${withdrawing ? theme.accentText : theme.textColorMuted}`}
                  >
                    {t("withdraw")}
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div>
              {isDog(deployment, stateToken) ? (
                <div className="pointer-events-none scale-[0.88] -ml-1 md:scale-100 md:ml-0">
                  <BaseDog />
                </div>
              ) : (
                <Image
                  src={
                    resolvedTheme === "dark" ? theme.logoSrcDark : theme.logoSrc
                  }
                  width={theme.logoWidth}
                  height={theme.logoHeight}
                  alt="Direction"
                  className="pointer-events-none scale-[0.88] -ml-1 md:scale-100 md:ml-0"
                />
              )}
            </div>
            <div className="flex items-center space-x-2">
              <div
                className={`${theme.bgMuted} flex p-1 rounded-full transition-colors`}
              >
                <div
                  role="button"
                  className={`rounded-full px-3 py-1 cursor-pointer transition-colors duration-200 ${
                    !withdrawing ? theme.accentBg : "bg-transparent"
                  } `}
                  onClick={toggleWithdrawing}
                >
                  <span
                    className={`text-xs font-medium leading-3 -translate-y-px inline-flex hover:${
                      theme.textColorMuted
                    } ${!withdrawing ? theme.accentText : "bg-transparent"}`}
                  >
                    {t("deposit")}
                  </span>
                </div>
                <div
                  role="button"
                  className={`rounded-full px-3 py-1 cursor-pointer transition-colors duration-200 ${
                    withdrawing ? theme.accentBg : "bg-transparent"
                  }`}
                  onClick={toggleWithdrawing}
                >
                  <span
                    className={`text-xs font-medium leading-3 -translate-y-px inline-flex hover:${
                      theme.textColorMuted
                    } ${withdrawing ? theme.accentText : theme.textColorMuted}`}
                  >
                    {t("withdraw")}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
