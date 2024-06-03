import { useTheme } from "next-themes";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import { useDeployment } from "@/hooks/use-deployment";
import { useDeployments } from "@/hooks/use-deployments";
import { useToggleWithdrawing } from "@/hooks/use-toggle-withdrawing";
import { useConfigState } from "@/state/config";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const BridgeHeader = () => {
  const withdrawing = useConfigState.useWithdrawing();
  const deployment = useDeployment();
  const toggleWithdrawing = useToggleWithdrawing();
  const { resolvedTheme } = useTheme();
  const { t } = useTranslation();

  const { deployments } = useDeployments();

  return (
    <>
      <div className="flex items-center justify-between px-4 md:px-6 pt-3 md:pt-6 pb-2 md:pb-4">
        {deployments.length === 1 ? (
          <>
            <div className="flex items-center space-x-2 w-full">
              <div
                className={`bg-muted flex p-1 rounded-full transition-colors w-full`}
              >
                <div
                  role="button"
                  className={`rounded-full px-3 py-1 cursor-pointer transition-colors duration-200 flex-1 text-center ${
                    !withdrawing ? "bg-primary" : "bg-transparent"
                  } `}
                  onClick={toggleWithdrawing}
                >
                  <span
                    className={`text-xs font-medium leading-3 -translate-y-px inline-flex ${
                      !withdrawing
                        ? "text-primary-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {t("deposit")}
                  </span>
                </div>
                <div
                  role="button"
                  className={`rounded-full px-3 py-1 cursor-pointer transition-colors duration-200 flex-1 text-center ${
                    withdrawing ? "bg-primary" : "bg-transparent"
                  }`}
                  onClick={toggleWithdrawing}
                >
                  <span
                    className={`text-xs font-medium leading-3 -translate-y-px inline-flex  ${
                      withdrawing
                        ? "text-primary-foreground"
                        : "text-muted-foreground"
                    }`}
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
              <Image
                src={
                  resolvedTheme === "dark"
                    ? deployment?.theme?.theme.imageSuperbridgeLogoDark ?? ""
                    : deployment?.theme?.theme.imageSuperbridgeLogo ?? ""
                }
                width={0}
                height={0}
                sizes="100vw"
                alt="network icon"
                className="pointer-events-none scale-[0.88] -ml-1 md:scale-100 md:ml-0 h-8 w-auto max-w-40"
              />
            </div>
            <div className="flex items-center space-x-2">
              <div
                className={`bg-muted flex p-1 rounded-full transition-colors`}
              >
                <div
                  role="button"
                  className={`rounded-full px-3 py-1 cursor-pointer transition-colors duration-200 ${
                    !withdrawing ? "bg-primary" : "bg-transparent"
                  } `}
                  onClick={toggleWithdrawing}
                >
                  <span
                    className={`text-xs font-medium leading-3 -translate-y-px inline-flex  ${
                      !withdrawing
                        ? "text-primary-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {t("deposit")}
                  </span>
                </div>
                <div
                  role="button"
                  className={`rounded-full px-3 py-1 cursor-pointer transition-colors duration-200 ${
                    withdrawing ? "bg-primary" : "bg-transparent"
                  }`}
                  onClick={toggleWithdrawing}
                >
                  <span
                    className={`text-xs font-medium leading-3 -translate-y-px inline-flex  ${
                      withdrawing
                        ? "text-primary-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {t("withdraw")}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
