import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { match } from "ts-pattern";

import { RouteProvider } from "@/codegen/model";
import { useToChain } from "@/hooks/use-chain";
import { useFinalizationPeriod } from "@/hooks/use-finalization-period";
import { useSelectedBridgeRoute } from "@/hooks/use-selected-bridge-route";
import { useApproxTotalBridgeTime } from "@/hooks/use-transfer-time";
import { usetTransformPeriodText } from "@/hooks/use-transform-period-text";
import { useConfigState } from "@/state/config";

import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export const ConfirmationModalTermsTab = ({
  onNext,
  commonTranslationProps,
}: {
  onNext: () => void;
  commonTranslationProps: object;
}) => {
  const withdrawing = useConfigState.useWithdrawing();
  const open = useConfigState.useDisplayConfirmationModal();
  const route = useSelectedBridgeRoute();

  const [checkbox1, setCheckbox1] = useState(false);
  const [checkbox2, setCheckbox2] = useState(false);
  const [checkbox3, setCheckbox3] = useState(false);

  const totalBridgeTime = useApproxTotalBridgeTime();
  const finalizationTime = useFinalizationPeriod();
  const to = useToChain();
  const transformPeriodText = usetTransformPeriodText();

  const { t } = useTranslation();

  useEffect(() => {
    if (open) {
      setCheckbox1(false);
      setCheckbox2(false);
      setCheckbox3(false);
    }
  }, [open]);

  const checkbox1Text = match({
    isAcross: route?.id === RouteProvider.Across,
    isCctp: route?.id === RouteProvider.Cctp,
    withdrawing: (
      [
        RouteProvider.ArbitrumWithdrawal,
        RouteProvider.OptimismWithdrawal,
        RouteProvider.OptimismForcedWithdrawal,
      ] as string[]
    ).includes(route?.id ?? ""),
    family: (
      [
        RouteProvider.OptimismDeposit,
        RouteProvider.OptimismWithdrawal,
        RouteProvider.OptimismForcedWithdrawal,
      ] as string[]
    ).includes(route?.id ?? "")
      ? "optimism"
      : "arbitrum",
  })
    .with(
      { isAcross: true },
      () =>
        `I understand it will take ~${totalBridgeTime?.value} mins until my funds are on ${to?.name}`
    )
    .with({ isCctp: true }, () =>
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
      <DialogHeader className="items-center">
        <DialogTitle className="text-3xl">Accept terms</DialogTitle>
        <DialogDescription className="text-center">
          Please read and agree to the following terms before you continue
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-4 px-6">
        <div className="flex gap-3">
          <Checkbox
            id="timeframe"
            checked={checkbox1}
            onCheckedChange={(c) => setCheckbox1(c as boolean)}
            className="mt-0.5"
          />
          <label htmlFor="timeframe" className="text-xs text-muted-foreground ">
            {checkbox1Text}
          </label>
        </div>
        <div className="flex gap-3">
          <Checkbox
            id="speed"
            checked={checkbox2}
            onCheckedChange={(c) => setCheckbox2(c as boolean)}
            className="mt-0.5"
          />
          <label htmlFor="speed" className="text-xs text-muted-foreground ">
            {withdrawing
              ? t("confirmationModal.checkbox2Withdrawal")
              : t("confirmationModal.checkbox2Deposit")}
          </label>
        </div>
        <div className="flex gap-3">
          <Checkbox
            id="fees"
            checked={checkbox3}
            onCheckedChange={(c) => setCheckbox3(c as boolean)}
            className="mt-0.5"
          />
          <label htmlFor="fees" className="text-xs text-muted-foreground ">
            {t("confirmationModal.checkbox3")}
          </label>
        </div>
      </div>

      <DialogFooter>
        <Link
          href="/support"
          className="text-xs font-heading text-center hover:underline"
        >
          Need help? View the FAQs
        </Link>

        <Button
          onClick={onNext}
          className="w-full"
          disabled={!checkbox1 || !checkbox2 || !checkbox3}
        >
          Continue
        </Button>
      </DialogFooter>
    </div>
  );
};
