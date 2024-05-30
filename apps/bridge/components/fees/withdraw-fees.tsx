import clsx from "clsx";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Chain } from "viem";

import { configurations } from "@/config/contract-addresses";
import { currencySymbolMap } from "@/constants/currency-symbol-map";
import { useDeployment } from "@/hooks/use-deployment";
import { useFees } from "@/hooks/use-fees";
import { useConfigState } from "@/state/config";
import { useSettingsState } from "@/state/settings";
import { isOptimism } from "@/utils/is-mainnet";

export const WithdrawFees = ({
  gasEstimate,
  openSettings,
}: {
  gasEstimate: number;
  openSettings: () => void;
}) => {
  const deployment = useDeployment();
  const forceViaL1 = useConfigState.useForceViaL1();
  const easyMode = useConfigState.useEasyMode();
  const fees = useFees(deployment?.l2 as unknown as Chain, gasEstimate);
  const { t } = useTranslation();
  const currency = useSettingsState.useCurrency();

  const forceIsEnabled = !!deployment && isOptimism(deployment);
  const easyModeEnabled = !!configurations[deployment?.name ?? ""];

  return (
    <div className="cursor-pointer" onClick={() => openSettings()}>
      <div className="flex justify-between items-center px-3 py-2 md:py-3">
        <div className="flex items-center gap-2">
          <Image
            alt="fees icon"
            src="/img/fees.svg"
            className="h-4 w-4"
            height={16}
            width={16}
          />
          <span className={`text-xs font-medium`}>{t("fees.fees")}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium text-foreground ml-auto`}>
            {currencySymbolMap[currency]}
            {fees
              .reduce((accum, fee) => (fee.usd?.raw ?? 0) + accum, 0)
              .toLocaleString("en", { maximumFractionDigits: 2 })}
          </span>
          <Image
            alt="fees icon"
            src={"/img/caret-down.svg"}
            className="h-4 w-4"
            height={16}
            width={16}
          />
        </div>
      </div>

      {(forceIsEnabled || easyModeEnabled) && (
        <div className="flex gap-2 justify-end items-center mb-3 px-3">
          {forceIsEnabled && (
            <div
              className={clsx(
                forceViaL1 ? "bg-green-400" : "bg-muted",
                "rounded-full flex flex-shrink items-center max-w-fit gap-1 font-medium pl-2 pr-3 py-1 transition-all hover:scale-105"
              )}
              role="button"
            >
              <Image
                alt="Escape Hatch"
                src={"/img/icon-escape-hatch.svg"}
                height={24}
                width={24}
              />
              <span
                className={clsx(
                  "text-[11px] md:text-xs",
                  forceViaL1 ? "text-white" : "text-zinc-400"
                )}
              >
                Escape Hatch
              </span>
              <span
                className={clsx(
                  "text-[10px] leading-4 mt-0.5 uppercase",
                  forceViaL1
                    ? "text-white/60"
                    : "text-zinc-900/30 dark:text-white/30 uppercase"
                )}
              >
                {forceViaL1 ? t("on") : t("off")}
              </span>
            </div>
          )}

          {easyMode && (
            <div
              className={clsx(
                easyMode ? "bg-green-400" : "bg-muted",
                "rounded-full flex flex-shrink items-center max-w-fit gap-1 font-medium pl-2 pr-3 py-1 transition-all hover:scale-105"
              )}
              role="button"
            >
              <Image
                alt="easy mode"
                src={"/img/icon-easy-mode.svg"}
                height={24}
                width={24}
              />
              <span
                className={clsx(
                  "text-[11px] md:text-xs",
                  easyMode ? "text-foreground" : "text-zinc-400"
                )}
              >
                Easy mode
              </span>
              <span
                className={clsx(
                  "text-[10px] uppercase",
                  easyMode
                    ? "text-white/60"
                    : "text-zinc-900/30 dark:text-white/30 uppercase"
                )}
              >
                {easyMode ? t("on") : t("off")}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
