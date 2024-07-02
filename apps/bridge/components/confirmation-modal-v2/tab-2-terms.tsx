import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { match } from "ts-pattern";

import { useToChain } from "@/hooks/use-chain";
import { useDeployment } from "@/hooks/use-deployment";
import {
  useFinalizationPeriod,
  useTotalBridgeTime,
} from "@/hooks/use-finalization-period";
import { usetTransformPeriodText } from "@/hooks/use-transform-period-text";
import { useConfigState } from "@/state/config";
import { isNativeUsdc } from "@/utils/is-usdc";

import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";

export const ConfirmationModalTermsTab = ({
  onNext,
  commonTranslationProps,
}: {
  onNext: () => void;
  commonTranslationProps: object;
}) => {
  const deployment = useDeployment();
  const stateToken = useConfigState.useToken();
  const fast = useConfigState.useFast();
  const withdrawing = useConfigState.useWithdrawing();

  const [checkbox1, setCheckbox1] = useState(false);
  const [checkbox2, setCheckbox2] = useState(false);
  const [checkbox3, setCheckbox3] = useState(false);

  const totalBridgeTime = useTotalBridgeTime(deployment);
  const finalizationTime = useFinalizationPeriod();
  const to = useToChain();
  const transformPeriodText = usetTransformPeriodText();

  const { t } = useTranslation();

  useEffect(() => {
    setCheckbox1(false);
    setCheckbox2(false);
    setCheckbox3(false);
  }, [open]);

  const checkbox1Text = match({
    fast,
    isUsdc: isNativeUsdc(stateToken),
    withdrawing,
    family: deployment?.family,
  })
    .with(
      { fast: true },
      () =>
        `I understand it will take ~${totalBridgeTime?.value} mins until my funds are on ${to?.name}`
    )
    .with({ isUsdc: true }, () =>
      t("confirmationModal.checkbox1Cctp", {
        mins: totalBridgeTime?.value,
        to: to?.name,
      })
    )
    .with({ withdrawing: true, family: "optimism" }, () =>
      transformPeriodText(
        "confirmationModal.opCheckbox1Withdrawal",
        commonTranslationProps,
        finalizationTime
      )
    )
    .with({ withdrawing: true, family: "arbitrum" }, () =>
      transformPeriodText(
        "confirmationModal.arbCheckbox1Withdrawal",
        commonTranslationProps,
        totalBridgeTime
      )
    )
    .with({ withdrawing: false }, () =>
      t("confirmationModal.checkbox1Deposit", {
        ...commonTranslationProps,
        mins: totalBridgeTime?.value,
      })
    )
    .otherwise(() => null);

  return (
    <div>
      <div>
        <h1>Accept terms</h1>
        <p>Please read and agree to the following terms before you continue</p>
      </div>

      <div className="flex flex-col gap-2 py-4">
        <div className="pl-4 flex gap-2">
          <Checkbox
            id="timeframe"
            checked={checkbox1}
            onCheckedChange={(c) => setCheckbox1(c as boolean)}
          />
          <label
            htmlFor="timeframe"
            className="text-[11px] text-muted-foreground "
          >
            {checkbox1Text}
          </label>
        </div>
        <div className="pl-4 flex gap-2">
          <Checkbox
            id="speed"
            checked={checkbox2}
            onCheckedChange={(c) => setCheckbox2(c as boolean)}
          />
          <label htmlFor="speed" className="text-[11px] text-muted-foreground ">
            {withdrawing
              ? t("confirmationModal.checkbox2Withdrawal")
              : t("confirmationModal.checkbox2Deposit")}
          </label>
        </div>
        <div className="pl-4 flex gap-2">
          <Checkbox
            id="fees"
            checked={checkbox3}
            onCheckedChange={(c) => setCheckbox3(c as boolean)}
          />
          <label htmlFor="fees" className="text-[11px] text-muted-foreground ">
            {t("confirmationModal.checkbox3")}
          </label>
        </div>
      </div>

      <Button
        onClick={onNext}
        disabled={!checkbox1 || !checkbox2 || !checkbox3}
      >
        Continue
      </Button>
    </div>
  );
};
