import { UseQueryResult } from "@tanstack/react-query";
import clsx from "clsx";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Chain, useAccount } from "wagmi";

import { deploymentTheme } from "@/config/theme";
import { useFees } from "@/hooks/use-fees";
import { useConfigState } from "@/state/config";
import { Theme } from "@/types/theme";
import { currencySymbolMap } from "@/constants/currency-symbol-map";
import { useSettingsState } from "@/state/settings";
import { configurations } from "@/config/contract-addresses";

export const WithdrawFees = ({
  bridgeFee,
  gasEstimate,
  openSettings,
}: {
  bridgeFee: UseQueryResult<bigint, Error>;
  gasEstimate: number;
  openSettings: () => void;
}) => {
  const deployment = useConfigState.useDeployment();
  const forceViaL1 = useConfigState.useForceViaL1();
  const easyMode = useConfigState.useEasyMode();
  const theme = deploymentTheme(deployment);
  const fees = useFees(
    deployment?.l2 as unknown as Chain,
    bridgeFee,
    gasEstimate
  );
  const { t } = useTranslation();
  const currency = useSettingsState.useCurrency();

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
          <span className={`text-xs font-medium ${theme.textColor} ml-auto`}>
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

      <div className="flex gap-2 justify-end items-center mb-3 px-3">
        <div
          className={clsx(
            forceViaL1 ? "bg-green-400" : theme.bgMuted,
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
              "text-[10px] leading-4 mt-0.5",
              forceViaL1
                ? "text-white/60"
                : "text-zinc-900/30 dark:text-white/30 uppercase"
            )}
          >
            {forceViaL1 ? t("on") : t("off")}
          </span>
        </div>

        {configurations[deployment?.name ?? ""] && (
          <div
            className={clsx(
              easyMode ? "bg-green-400" : theme.bgMuted,
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
                easyMode ? "text-white" : "text-zinc-400"
              )}
            >
              Easy mode
            </span>
            <span
              className={clsx(
                "text-[10px]",
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
    </div>
  );
};

const RecipientAddress = ({
  openAddressDialog,
  theme,
}: {
  openAddressDialog: () => void;
  theme: Theme;
}) => {
  const recipientName = useConfigState.useRecipientName();
  const recipientAddress = useConfigState.useRecipientAddress();
  const account = useAccount();
  const { t } = useTranslation();

  return (
    <div>
      <div
        className="flex items-center justify-between px-3 py-2"
        onClick={!account.address ? () => {} : openAddressDialog}
      >
        <div className="flex justify-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 14 14"
            className="fill-zinc-900 dark:fill-zinc-50 w-4 h-4"
          >
            <path d="M7 2.866c.193 0 .382.06.531.202l3.7 3.268c.179.16.341.372.341.664 0 .292-.159.501-.341.664l-3.7 3.268a.773.773 0 01-.531.202.806.806 0 01-.531-1.408l2.171-1.92H3.231a.806.806 0 01-.804-.803c0-.441.362-.803.804-.803h5.41L6.468 4.28A.806.806 0 017 2.872v-.006z"></path>
          </svg>
          <span className={`text-xs font-medium`}>{t("toAddress")}</span>
        </div>

        {!account.address ? (
          <span
            className={clsx(
              "text-xs font-medium text-white",
              theme.textColorMuted
            )}
          >
            …
          </span>
        ) : !recipientAddress ? (
          <div className="flex justify-center gap-1 pl-2 pr-1 py-1 rounded-full cursor-pointer hover:scale-105 transition-all bg-zinc-950">
            <span className="text-xs font-medium text-white">Add address</span>
            <Image
              alt="Address icon"
              src={"/img/address-add.svg"}
              height={14}
              width={14}
            />
          </div>
        ) : (
          <div
            className={clsx(
              `flex justify-center gap-1 pl-2 pr-1 py-1 rounded-full cursor-pointer hover:scale-105 transition-all`,
              "bg-green-100 dark:bg-green-950"
            )}
          >
            <span className={clsx(`text-xs font-medium `, "text-green-500")}>
              {recipientName
                ? recipientName
                : `${recipientAddress.slice(0, 4)}...${recipientAddress.slice(
                    recipientAddress.length - 4
                  )}`}
            </span>
            <Image
              alt="Address icon"
              src={"/img/address-ok.svg"}
              height={14}
              width={14}
            />
          </div>
        )}
      </div>
    </div>
  );
};
