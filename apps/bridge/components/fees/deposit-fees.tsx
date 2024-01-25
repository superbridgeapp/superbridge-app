import { UseQueryResult } from "@tanstack/react-query";
import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Chain } from "wagmi";

import { deploymentTheme } from "@/config/theme";
import { currencySymbolMap } from "@/constants/currency-symbol-map";
import { useFees } from "@/hooks/use-fees";
import { useConfigState } from "@/state/config";
import { useSettingsState } from "@/state/settings";

export const DepositFees = ({
  bridgeFee,
  gasEstimate,
}: {
  bridgeFee: UseQueryResult<bigint, Error>;
  gasEstimate: number;
}) => {
  const [expanded, setExpanded] = useState(false);
  const deployment = useConfigState.useDeployment();
  const { t } = useTranslation();
  const currency = useSettingsState.useCurrency();

  const theme = deploymentTheme(deployment);
  const fees = useFees(
    deployment?.l1 as unknown as Chain,
    bridgeFee,
    gasEstimate
  );

  return (
    <div>
      <div
        className="flex items-center cursor-pointer justify-between px-3 py-2 md:py-3"
        onClick={() => setExpanded((e) => !e)}
      >
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
          <span className={`text-xs font-medium ${theme.textColor}`}>
            {currencySymbolMap[currency]}
            {fees
              .reduce((accum, fee) => (fee.usd?.raw ?? 0) + accum, 0)
              .toLocaleString("en", { maximumFractionDigits: 2 })}
          </span>
          <Image
            alt="fees icon"
            src={expanded ? "/img/caret-up.svg" : "/img/caret-down.svg"}
            className="h-4 w-4 fill-black"
            height={12}
            width={12}
          />
        </div>
      </div>

      {expanded && (
        <>
          {fees.map((fee, index) => (
            <div
              key={fee.name}
              className={clsx("px-3 py-1", index === fees.length - 1 && "pb-3")}
            >
              <div className="flex items-center justify-between">
                <span className={`${theme.textColorMuted} text-xs font-medium`}>
                  {fee.name}
                </span>

                {fee.usd?.formatted && (
                  <span
                    className={`${theme.textColorMuted} ml-auto text-xs font-medium mr-2`}
                  >
                    {fee.usd?.formatted}
                  </span>
                )}
                <span className={`text-xs font-medium ${theme.textColor}`}>
                  {fee.token?.formatted}
                </span>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};
