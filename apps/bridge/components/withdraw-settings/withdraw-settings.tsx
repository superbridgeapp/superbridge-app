import Image from "next/image";
import { useTranslation } from "react-i18next";

import { configurations } from "@/config/contract-addresses";
import { useToChain } from "@/hooks/use-chain";
import { useDeployment } from "@/hooks/use-deployment";
import { useFees } from "@/hooks/use-fee-line-items";
import { useIsContractAccount } from "@/hooks/use-is-contract-account";
import { useConfigState } from "@/state/config";
import { isOptimism } from "@/utils/is-mainnet";

import { Switch } from "../ui/switch";

export const WithdrawSettings = () => {
  const deployment = useDeployment();
  const easyMode = useConfigState.useEasyMode();
  const toggleEasyMode = useConfigState.useToggleEasyMode();
  const forceViaL1 = useConfigState.useForceViaL1();
  const toggleForceViaL1 = useConfigState.useToggleForceViaL1();
  const isContractAccount = useIsContractAccount();
  const { t } = useTranslation();

  const to = useToChain();
  const fees = useFees(deployment?.l2);

  return (
    <div>
      <h2 className="font-heading pb-4 border-b p-6">
        {t("settings.withdrawalSettings")}
      </h2>

      <div className="space-y-6 p-6">
        <div className="space-y-2">
          <div className="border  px-4 py-3 flex items-start rounded-lg">
            <Image
              alt="Escape Hatch"
              src="/img/icon-escape-hatch.svg"
              height={32}
              width={32}
              className="mr-2"
            />
            <div>
              <h3 className="font-heading">Escape hatch</h3>
              <p className="text-muted-foreground text-xs">
                {t("settings.escapeHatchDescription", { base: to?.name })}
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
            <div className="border  px-4 py-3 flex items-start rounded-lg">
              <Image
                alt="easy mode"
                src="/img/icon-easy-mode.svg"
                height={32}
                width={32}
                className="mr-2"
              />
              <div>
                <h3 className="font-heading">Easy mode</h3>
                <p className="text-muted-foreground text-xs">
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
          <h2 className="font-heading">{t("settings.feeBreakdown")}</h2>
          <div className="border  rounded-lg divide-y divide-zinc-100 dark:divide-zinc-800">
            {fees.map((fee) => (
              <div
                key={fee.name}
                className="flex items-center justify-between  px-4 py-2"
              >
                <span className={`text-muted-foreground text-xs `}>
                  {fee.name}
                </span>

                {fee.usd && (
                  <span
                    className={`text-muted-foreground ml-auto text-xs  mr-2`}
                  >
                    {fee.usd.formatted}
                  </span>
                )}
                <span className={`text-xs `}>
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
