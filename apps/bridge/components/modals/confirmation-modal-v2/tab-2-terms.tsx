import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { match } from "ts-pattern";

import { RouteProvider } from "@/codegen/model";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToChain } from "@/hooks/use-chain";
import { useSelectedBridgeRoute } from "@/hooks/use-selected-bridge-route";
import { useApproxTotalBridgeTime } from "@/hooks/use-transfer-time";
import { useTransformPeriodText } from "@/hooks/use-transform-period-text";
import { useConfigState } from "@/state/config";

export const ConfirmationModalTermsTab = ({
  onNext,
  commonTranslationProps,
}: {
  onNext: () => void;
  commonTranslationProps: object;
}) => {
  const open = useConfigState.useDisplayConfirmationModal();
  const route = useSelectedBridgeRoute();

  const [checkbox1, setCheckbox1] = useState(false);
  const [checkbox2, setCheckbox2] = useState(false);
  const [checkbox3, setCheckbox3] = useState(false);

  const totalBridgeTime = useApproxTotalBridgeTime();
  const to = useToChain();
  const transformPeriodText = useTransformPeriodText();

  const { t } = useTranslation();

  useEffect(() => {
    if (open) {
      setCheckbox1(false);
      setCheckbox2(false);
      setCheckbox3(false);
    }
  }, [open]);

  const checkbox1Text = match({
    isAcross: route.data?.id === RouteProvider.Across,
    isCctp: route.data?.id === RouteProvider.Cctp,
    withdrawing: (
      [
        RouteProvider.ArbitrumWithdrawal,
        RouteProvider.OptimismWithdrawal,
        RouteProvider.OptimismForcedWithdrawal,
      ] as string[]
    ).includes(route.data?.id ?? ""),
    family: (
      [
        RouteProvider.OptimismDeposit,
        RouteProvider.OptimismWithdrawal,
        RouteProvider.OptimismForcedWithdrawal,
      ] as string[]
    ).includes(route.data?.id ?? "")
      ? "optimism"
      : "arbitrum",
  })
    .with(
      { isAcross: true },
      () =>
        `I understand it will take ~${totalBridgeTime.data?.value} mins until my funds are on ${to?.name}`
    )
    .with({ isCctp: true }, () =>
      t("confirmationModal.checkbox1Cctp", {
        mins: totalBridgeTime.data?.value,
        to: to?.name,
      })
    )
    .with({ withdrawing: true, family: "optimism" }, () =>
      transformPeriodText(
        "confirmationModal.opCheckbox1Withdrawal",
        commonTranslationProps,
        totalBridgeTime.data
      )
    )
    .with({ withdrawing: true, family: "arbitrum" }, () =>
      transformPeriodText(
        "confirmationModal.arbCheckbox1Withdrawal",
        commonTranslationProps,
        totalBridgeTime.data
      )
    )
    .with({ withdrawing: false }, () =>
      t("confirmationModal.checkbox1Deposit", {
        ...commonTranslationProps,
        mins: totalBridgeTime.data?.value,
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
            {t("confirmationModal.checkbox2")}
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
