import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { match } from "ts-pattern";

import { DeploymentFamily, RouteProvider } from "@/codegen/model";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { optimismRoutes, withdrawalRoutes } from "@/constants/routes";
import { useSelectedBridgeRoute } from "@/hooks/routes/use-selected-bridge-route";
import { useToChain } from "@/hooks/use-chain";
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
    isHyperlane: route.data?.id === RouteProvider.Hyperlane,
    withdrawing: route.data?.id && withdrawalRoutes.includes(route.data.id),
    family:
      route.data?.id && optimismRoutes.includes(route.data.id)
        ? DeploymentFamily.optimism
        : DeploymentFamily.arbitrum,
  })
    .with({ isAcross: true }, { isHyperlane: true }, () =>
      t("confirmationModal.checkbox1Bridge", {
        mins: totalBridgeTime.data?.value,
        to: to?.name,
      })
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
        <DialogTitle className="text-3xl">
          {t("confirmationModal.acceptTerms")}
        </DialogTitle>
        <DialogDescription className="text-center">
          {t("confirmationModal.agreeToTerms")}
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-4 px-8 py-2">
        <div className="flex gap-2 items-start">
          <Checkbox
            id="timeframe"
            checked={checkbox1}
            onCheckedChange={(c) => setCheckbox1(c as boolean)}
            className="mt-0.5"
          />
          <label htmlFor="timeframe" className="text-xs text-foreground ">
            {checkbox1Text}
          </label>
        </div>
        <div className="flex gap-2  items-start">
          <Checkbox
            id="speed"
            checked={checkbox2}
            onCheckedChange={(c) => setCheckbox2(c as boolean)}
            className="mt-0.5"
          />
          <label htmlFor="speed" className="text-xs text-foreground ">
            {t("confirmationModal.checkbox2")}
          </label>
        </div>
        <div className="flex gap-2 items-start">
          <Checkbox
            id="fees"
            checked={checkbox3}
            onCheckedChange={(c) => setCheckbox3(c as boolean)}
            className="mt-0.5"
          />
          <label htmlFor="fees" className="text-xs text-foreground ">
            {t("confirmationModal.checkbox3")}
          </label>
        </div>
      </div>

      <DialogFooter>
        {/* <Link
          href="https://help.superbridge.app"
          target="_blank"
          className="text-xs font-heading text-center hover:underline"
        >
          {t("general.needHelp")}
        </Link> */}

        <Button
          onClick={onNext}
          className="w-full"
          disabled={!checkbox1 || !checkbox2 || !checkbox3}
        >
          {t("buttons.continue")}
        </Button>
      </DialogFooter>
    </div>
  );
};
