import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Chain } from "viem";

import { deploymentTheme } from "@/config/theme";
import { useFees } from "@/hooks/use-fees";
import { useConfigState } from "@/state/config";

export const DepositFees = ({ gasEstimate }: { gasEstimate: number }) => {
  const deployment = useConfigState.useDeployment();
  const { t } = useTranslation();

  const theme = deploymentTheme(deployment);
  const fee = useFees(deployment?.l1 as unknown as Chain, gasEstimate)[0];

  return (
    <div>
      <div className="flex items-center justify-between px-3 py-2 md:py-3">
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
          <span className={`text-xs font-medium text-foreground`}>
            {fee.usd?.formatted && (
              <span
                className={`text-muted-foreground ml-auto text-xs font-medium mr-2`}
              >
                {fee.usd?.formatted}
              </span>
            )}
            <span className={`text-xs font-medium text-foreground`}>
              {fee.token?.formatted}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
