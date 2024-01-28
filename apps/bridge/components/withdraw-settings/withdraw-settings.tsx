import Image from "next/image";
import { useTranslation } from "react-i18next";

import { configurations } from "@/config/contract-addresses";
import { deploymentTheme } from "@/config/theme";
import { useFees } from "@/hooks/use-fees";
import { useIsContractAccount } from "@/hooks/use-is-contract-account";
import { useConfigState } from "@/state/config";
import { isOptimism } from "@/utils/is-mainnet";

import { Switch } from "../ui/switch";
import { SettingsModalProps } from "./types";

export const WithdrawSettings = ({
  from,
  bridgeFee,
  gasEstimate,
}: SettingsModalProps) => {
  const deployment = useConfigState.useDeployment();
  const easyMode = useConfigState.useEasyMode();
  const toggleEasyMode = useConfigState.useToggleEasyMode();
  const forceViaL1 = useConfigState.useForceViaL1();
  const toggleForceViaL1 = useConfigState.useToggleForceViaL1();
  const isContractAccount = useIsContractAccount();
  const { t } = useTranslation();

  const fees = useFees(from, bridgeFee, gasEstimate);
  const theme = deploymentTheme(deployment);

  return (
    <div>
      <h2 className="font-bold pb-4 border-b border-zinc-50 dark:border-zinc-900 p-6">
        {t("settings.withdrawalSettings")}
      </h2>

      <div className="space-y-6 p-6">
        <div className="space-y-2">
          <div className="border border-zinc-100 dark:border-zinc-800 px-4 py-3 flex items-start rounded-lg">
            <Image
              alt="Escape Hatch"
              src="/img/icon-escape-hatch.svg"
              height={32}
              width={32}
              className="mr-2"
            />
            <div>
              <h3 className="font-bold">Escape hatch</h3>
              <p className="text-zinc-400 text-xs">
                {t("settings.escapeHatchDescription")}
              </p>
            </div>
            <div className="pl-8">
              <Switch
                checked={forceViaL1}
                onCheckedChange={toggleForceViaL1}
                disabled={
                  !deployment ||
                  !isOptimism(deployment) ||
                  isContractAccount.data === true
                }
              />
            </div>
          </div>

          {configurations[deployment?.name ?? ""] && (
            <div className="border border-zinc-100 dark:border-zinc-800 px-4 py-3 flex items-start rounded-lg">
              <Image
                alt="easy mode"
                src="/img/icon-easy-mode.svg"
                height={32}
                width={32}
                className="mr-2"
              />
              <div>
                <h3 className="font-bold">Easy mode</h3>
                <p className="text-zinc-400 text-xs">
                  {t("settings.easyModeDescription")}
                </p>
              </div>
              <Switch
                checked={easyMode}
                onCheckedChange={toggleEasyMode}
                disabled={!deployment || !configurations[deployment.name]}
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h2 className="font-bold">{t("settings.feeBreakdown")}</h2>
          <div className="border border-zinc-100 dark:border-zinc-800 rounded-lg divide-y divide-zinc-100 dark:divide-zinc-800">
            {fees.map((fee) => (
              <div
                key={fee.name}
                className="flex items-center justify-between  px-4 py-2"
              >
                <span className={`${theme.textColorMuted} text-xs font-medium`}>
                  {fee.name}
                </span>

                {fee.usd && (
                  <span
                    className={`${theme.textColorMuted} ml-auto text-xs font-medium mr-2`}
                  >
                    {fee.usd.formatted}
                  </span>
                )}
                <span className={`text-xs font-medium ${theme.textColor}`}>
                  {fee.token ? fee.token.formatted : "-"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
