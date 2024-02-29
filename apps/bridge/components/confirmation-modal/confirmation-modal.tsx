import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { formatUnits } from "viem";
import { useFeeData, useWalletClient } from "wagmi";

import { DeploymentFamily } from "@/codegen/model";
import { Checkbox } from "@/components/ui/checkbox";
import { deploymentTheme } from "@/config/theme";
import { currencySymbolMap } from "@/constants/currency-symbol-map";
import { FINALIZE_GAS, PROVE_GAS } from "@/constants/gas-limits";
import { useFromChain, useToChain } from "@/hooks/use-chain";
import { useNativeToken } from "@/hooks/use-native-token";
import { useTokenPrice } from "@/hooks/use-prices";
import { useConfigState } from "@/state/config";
import { useSettingsState } from "@/state/settings";
import { isNativeUsdc } from "@/utils/is-usdc";

import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import {
  ApproveIcon,
  FeesIcon,
  FinalizeIcon,
  InitiateIcon,
  ProveIcon,
  ReceiveIcon,
  WaitIcon,
} from "./icons";
import { isNativeToken } from "@/utils/is-eth";
import { useApprove } from "@/hooks/use-approve";
import { useSelectedToken } from "@/hooks/use-selected-token";
import { useAllowance } from "@/hooks/use-allowance";
import { P, match } from "ts-pattern";
import { useWeiAmount } from "@/hooks/use-wei-amount";
import { useBridge } from "@/hooks/use-bridge";

function LineItem({
  text,
  icon,
  fee,
  className,
}: {
  text: string;
  icon: any;
  fee?: string | null;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "rounded-lg px-3 py-2 justify-between flex items-center",
        className
      )}
    >
      <div className="flex gap-2 items-center">
        {icon}
        <p className="text-sm font-medium">{text}</p>
      </div>
      {fee && (
        <div className="flex gap-2 items-center">
          <p className="text-xs">{fee}</p>
          <FeesIcon />
        </div>
      )}
    </div>
  );
}

export const ConfirmationModal = ({
  onConfirm,
  approve,
  allowance,
  bridge,
}: {
  onConfirm: () => void;
  approve: ReturnType<typeof useApprove>;
  allowance: ReturnType<typeof useAllowance>;
  bridge: ReturnType<typeof useBridge>;
}) => {
  const { t } = useTranslation();
  const open = useConfigState.useDisplayConfirmationModal();
  const setOpen = useConfigState.useSetDisplayConfirmationModal();
  const stateToken = useConfigState.useToken();
  const currency = useSettingsState.useCurrency();
  const from = useFromChain();
  const to = useToChain();
  const token = useSelectedToken();
  const weiAmount = useWeiAmount();
  const wallet = useWalletClient();
  const withdrawing = useConfigState.useWithdrawing();
  const rawAmount = useConfigState.useRawAmount();

  const deployment = useConfigState.useDeployment();
  const theme = deploymentTheme(deployment);

  const fromFeeData = useFeeData({ chainId: from?.id });
  const toFeeData = useFeeData({ chainId: to?.id });

  const nativeToken = useNativeToken();

  const nativeTokenPrice = useTokenPrice(nativeToken ?? null);

  const initiateCost =
    (fromFeeData.data?.gasPrice ?? BigInt(0)) * BigInt(200_000);
  const proveCost = (toFeeData.data?.gasPrice ?? BigInt(0)) * PROVE_GAS;
  const finalizeCost = (toFeeData.data?.gasPrice ?? BigInt(0)) * FINALIZE_GAS;
  const approveCost =
    (fromFeeData.data?.gasPrice ?? BigInt(0)) * BigInt(100_000);

  const [checkbox1, setCheckbox1] = useState(false);
  const [checkbox2, setCheckbox2] = useState(false);

  const fee = (n: bigint, maximumFractionDigits: number) => {
    if (!nativeTokenPrice) {
      return null;
    }

    const formattedAmount = parseFloat(formatUnits(n, 18));

    const amount = (nativeTokenPrice * formattedAmount).toLocaleString("en", {
      maximumFractionDigits,
    });

    return `${currencySymbolMap[currency]}${amount}`;
  };

  const approved =
    typeof allowance.data !== "undefined" && allowance.data >= weiAmount;

  const approveButton = match({
    approved,
    approving: approve.isLoading,
    bridge,
    withdrawing,
    isNativeToken: isNativeToken(stateToken),
  })
    .with({ isNativeToken: true }, () => null)
    .with({ approving: true }, () => ({
      onSubmit: () => {},
      buttonText: t("approving"),
      disabled: true,
    }))
    .with({ approved: false }, () => {
      // this kind of sucks for forced withdrawals, but we do approvals on the from chain for now
      if (wallet.data?.chain.id !== from?.id) {
        return {
          onSubmit: () => wallet.data?.switchChain({ id: from?.id ?? 0 }),
          buttonText: t("switchToApprove"),
          disabled: false,
        };
      }
      return {
        onSubmit: () => approve.write(),
        buttonText: t("approve"),
        disabled: false,
      };
    })
    .with({ approved: true }, () => ({
      onSubmit: () => {},
      buttonText: "Approved",
      disabled: true,
    }))
    .exhaustive();

  const initiateButton = match({
    needsApprove: !isNativeToken(stateToken) && !approved,
    bridge,
    withdrawing,
    isNativeToken: isNativeToken(stateToken),
  })
    .with({ needsApprove: true }, (d) => ({
      onSubmit: () => {},
      buttonText: d.withdrawing ? "Initiate withdrawal" : "Initiate deposit",
      disabled: true,
    }))
    .with({ bridge: { write: { isLoading: true } } }, (d) => ({
      onSubmit: () => {},
      buttonText: d.withdrawing ? t("withdrawing") : t("depositing"),
      disabled: false,
    }))
    .otherwise((d) => ({
      onSubmit: onConfirm,
      buttonText: d.withdrawing ? t("withdrawing") : t("depositing"),
      disabled: false,
    }));

  const title = match({
    isUsdc: isNativeUsdc(stateToken),
    withdrawing,
    family: deployment?.family,
  })
    .with({ isUsdc: true }, () => "USDC bridges take ~15 minutes")
    .with({ withdrawing: true }, () =>
      t("withdrawalModal.title", { rollup: deployment?.l2.name })
    )
    .with({ withdrawing: false, family: "optimism" }, () =>
      t("confirmationModal.opDepositTitle", { rollup: deployment?.l2.name })
    )
    .with({ withdrawing: false, family: "arbitrum" }, () =>
      t("confirmationModal.opDepositTitle", { rollup: deployment?.l2.name })
    )
    .otherwise(() => null);

  const description = match({
    isUsdc: isNativeUsdc(stateToken),
    withdrawing,
    family: deployment?.family,
  })
    .with(
      { isUsdc: true },
      () =>
        `USDC bridging requires two transactions to complete, one on the initiating chain (${from?.name}) and one on the destination chain (${to?.name}) 15 minutes later.`
    )
    .with({ withdrawing: true, family: "optimism" }, () =>
      t("withdrawalModal.opDescription", { base: deployment?.l1.name })
    )
    .with({ withdrawing: true, family: "arbitrum" }, () =>
      t("withdrawalModal.arbDescription", { base: deployment?.l1.name })
    )
    .with({ withdrawing: false, family: "optimism" }, () =>
      t("confirmationModal.opDepositDescription", {
        rollup: deployment?.l2.name,
      })
    )
    .with({ withdrawing: false, family: "arbitrum" }, () =>
      t("confirmationModal.opDepositDescription", {
        rollup: deployment?.l2.name,
      })
    )
    .otherwise(() => null);

  const lineItems = match({
    isUsdc: isNativeUsdc(stateToken),
    withdrawing,
    family: deployment?.family,
  })
    .with({ isUsdc: true }, () => [
      {
        text: "Initiate bridge",
        icon: InitiateIcon,
        fee: fee(initiateCost, 4),
      },
      {
        text: "Wait 15 minutes",
        icon: WaitIcon,
      },
      {
        text: `Finalize bridge on ${to?.name}`,
        icon: FinalizeIcon,
        fee: fee(finalizeCost, 4),
      },
    ])
    .with({ withdrawing: true, family: "optimism" }, () => [
      {
        text: t("withdrawalModal.initiate"),
        icon: InitiateIcon,
        fee: fee(initiateCost, 4),
      },
      { text: t("withdrawalModal.waitProve"), icon: WaitIcon },
      {
        text: t("withdrawalModal.prove", {
          base: deployment?.l1.name,
        }),
        icon: ProveIcon,
        fee: fee(proveCost, 4),
      },
      { text: t("withdrawalModal.waitFinalize"), icon: WaitIcon },
      {
        text: t("withdrawalModal.finalize", {
          base: deployment?.l1.name,
        }),
        icon: FinalizeIcon,
        fee: fee(finalizeCost, 2),
      },
    ])
    .with({ withdrawing: true, family: "arbitrum" }, () => [
      {
        text: t("withdrawalModal.initiate"),
        icon: InitiateIcon,
        fee: fee(initiateCost, 4),
      },
      { text: t("withdrawalModal.waitFinalize"), icon: WaitIcon },
      {
        text: t("withdrawalModal.finalize", {
          base: deployment?.l1.name,
        }),
        icon: FinalizeIcon,
        fee: fee(finalizeCost, 2),
      },
    ])
    .with({ withdrawing: false, family: "optimism" }, () => [
      {
        text: t("confirmationModal.initiateDeposit"),
        icon: InitiateIcon,
        fee: fee(initiateCost, 4),
      },
      { text: t("confirmationModal.waitOpDeposit"), icon: WaitIcon },
      {
        text: t("confirmationModal.receiveDeposit", { rollup: to?.name }),
        icon: ReceiveIcon,
      },
    ])
    .with({ withdrawing: false, family: "arbitrum" }, () => [
      {
        text: t("confirmationModal.initiateDeposit"),
        icon: InitiateIcon,
        fee: fee(initiateCost, 4),
      },
      { text: t("confirmationModal.waitArbDeposit"), icon: WaitIcon },
      {
        text: t("confirmationModal.receiveDeposit", { rollup: to?.name }),
        icon: ReceiveIcon,
      },
    ])
    .otherwise(() => null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <div className="flex flex-col p-6 pt-6 md:pt-8">
          <div className="flex flex-col gap-1 mr-6">
            <h1 className="font-bold text-2xl md:text-2xl tracking-tight md:leading-7 text-pretty">
              {title}
            </h1>
            <p className="text-sm text-pretty">
              {description}{" "}
              <Link
                href={
                  isNativeUsdc(stateToken)
                    ? "https://docs.rollbridge.app/what-is-bridging"
                    : "https://docs.rollbridge.app/native-usdc"
                }
                className="underline font-medium"
                target="_blank"
              >
                {t("withdrawalModal.learnMore")}
              </Link>
            </p>
          </div>

          <div className="flex flex-col gap-1 pt-4">
            <div className="justify-end flex items-center px-1">
              <span className="text-zinc-400 font-medium text-[11px]">
                {t("withdrawalModal.approxFees")}
              </span>
            </div>

            {approveButton && (
              <LineItem
                text={`Approve ${rawAmount} ${token?.symbol}`}
                icon={ApproveIcon}
                fee={fee(approveCost, 4)}
              />
            )}

            {lineItems?.map(({ text, icon, fee }) => (
              <LineItem text={text} icon={icon} fee={fee} />
            ))}
          </div>

          <div className="flex flex-col gap-2 py-4 md:py-6">
            <div className="pl-4 flex gap-2">
              <Checkbox
                id="timeframe"
                checked={checkbox1}
                onCheckedChange={(c) => setCheckbox1(c as boolean)}
              />
              <label
                htmlFor="timeframe"
                className="text-[11px] text-zinc-500 dark:text-zinc-400 tracking-tighter"
              >
                {isNativeUsdc(stateToken)
                  ? `I understand it will take ~15 minutes until my funds are claimable on ${to?.name}`
                  : t(
                      deployment?.family === DeploymentFamily.arbitrum
                        ? "withdrawalModal.arbCheckbox1"
                        : "withdrawalModal.opCheckbox1",
                      {
                        base: deployment?.l1.name,
                      }
                    )}
              </label>
            </div>
            <div className="pl-4 flex gap-2">
              <Checkbox
                id="speed"
                checked={checkbox2}
                onCheckedChange={(c) => setCheckbox2(c as boolean)}
              />
              <label
                htmlFor="speed"
                className="text-[11px] text-zinc-500 dark:text-zinc-400 tracking-tighter"
              >
                {t("withdrawalModal.checkbox2")}
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {approveButton && (
              <Button
                className={clsx(
                  "flex w-full justify-center rounded-full px-3 py-6 text-sm font-bold leading-6 text-white shadow-sm",
                  theme.accentText,
                  theme.accentBg,
                  approved && "bg-[#55FF55] text-black"
                )}
                onClick={approveButton.onSubmit}
                disabled={!checkbox1 || !checkbox2 || approveButton.disabled}
              >
                {approveButton.buttonText}
              </Button>
            )}

            <Button
              className={`flex w-full justify-center rounded-full px-3 py-6 text-sm font-bold leading-6 text-white shadow-sm ${theme.accentText} ${theme.accentBg}`}
              onClick={initiateButton.onSubmit}
              disabled={!checkbox1 || !checkbox2 || initiateButton.disabled}
            >
              {withdrawing
                ? t("withdrawalModal.initiateWithdrawal")
                : t("withdrawalModal.initiateDeposit")}
            </Button>

            {/* TODO: Create guide page and add link */}
            {/* {isSuperbridge && (
              <Link
                className={`text-center text-sm font-bold tracking-tight  hover:underline ${theme.textColor}`}
                href={"#"}
              >
                {t("withdrawalModal.viewAlternateBridges")}
              </Link>
            )} */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
