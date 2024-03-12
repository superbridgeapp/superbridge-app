import clsx from "clsx";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { match } from "ts-pattern";
import { formatUnits } from "viem";
import { useAccount, useEstimateFeesPerGas, useWalletClient } from "wagmi";

import { Checkbox } from "@/components/ui/checkbox";
import { deploymentTheme } from "@/config/theme";
import { currencySymbolMap } from "@/constants/currency-symbol-map";
import { FINALIZE_GAS, PROVE_GAS } from "@/constants/gas-limits";
import { useAllowance } from "@/hooks/use-allowance";
import { useApprove } from "@/hooks/use-approve";
import { useBridge } from "@/hooks/use-bridge";
import { useFromChain, useToChain } from "@/hooks/use-chain";
import {
  Period,
  addPeriods,
  useDepositTime,
  useFinalizationPeriod,
  useProvePeriod,
  useTotalBridgeTime,
} from "@/hooks/use-finalization-period";
import { useNativeToken } from "@/hooks/use-native-token";
import { useTokenPrice } from "@/hooks/use-prices";
import { useSelectedToken } from "@/hooks/use-selected-token";
import { useWeiAmount } from "@/hooks/use-wei-amount";
import { useConfigState } from "@/state/config";
import { useSettingsState } from "@/state/settings";
import { isNativeToken } from "@/utils/is-eth";
import { isNativeUsdc } from "@/utils/is-usdc";

import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import {
  ApproveIcon,
  EscapeHatchIcon,
  FeesIcon,
  FinalizeIcon,
  InitiateIcon,
  ProveIcon,
  ReceiveIcon,
  WaitIcon,
} from "./icons";
import { useAllowanceArbitrumGasToken } from "@/hooks/use-allowance-arbitrum-gas-token";
import {
  useApproveArbitrumGasToken,
  useArbitrumGasToken,
} from "@/hooks/use-approve-arbitrum-gas-token";
import { useSwitchChain } from "@/hooks/use-switch-chain";

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
        "py-2 px-3  justify-between flex items-center",
        className
      )}
    >
      <div className="flex gap-2 items-center">
        {icon}
        <p className="text-xs font-medium">{text}</p>
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
  const account = useAccount();
  const withdrawing = useConfigState.useWithdrawing();
  const escapeHatch = useConfigState.useForceViaL1();

  const arbitrumGasToken = useArbitrumGasToken();
  const arbitrumGasTokenAllowance = useAllowanceArbitrumGasToken();
  const deployment = useConfigState.useDeployment();
  const theme = deploymentTheme(deployment);
  const approveArbitrumGasToken = useApproveArbitrumGasToken();

  const finalizationTime = useFinalizationPeriod(deployment);
  const proveTime = useProvePeriod(deployment);
  const depositTime = useDepositTime(deployment);
  const totalBridgeTime = useTotalBridgeTime(deployment);

  const fromFeeData = useEstimateFeesPerGas({ chainId: from?.id });
  const toFeeData = useEstimateFeesPerGas({ chainId: to?.id });

  const nativeToken = useNativeToken();
  const switchChain = useSwitchChain();

  const nativeTokenPrice = useTokenPrice(nativeToken ?? null);

  const fromGasPrice =
    fromFeeData.data?.gasPrice ?? fromFeeData.data?.maxFeePerGas ?? BigInt(0);
  const toGasPrice =
    toFeeData.data?.gasPrice ?? toFeeData.data?.maxFeePerGas ?? BigInt(0);
  const initiateCost =
    (withdrawing && escapeHatch ? toGasPrice : fromGasPrice) * BigInt(200_000);
  const proveCost = toGasPrice * PROVE_GAS;
  const finalizeCost = toGasPrice * FINALIZE_GAS;
  const approveCost = fromGasPrice * BigInt(100_000);

  const [checkbox1, setCheckbox1] = useState(false);
  const [checkbox2, setCheckbox2] = useState(false);
  const [checkbox3, setCheckbox3] = useState(false);

  const transformPeriodText = (str: string, args: any, period: Period) => {
    const value =
      period?.period === "mins"
        ? t(`${str}Minutes`, {
            ...args,
            count: period.value,
          }).toString()
        : period?.period === "hours"
        ? t(`${str}Hours`, {
            ...args,
            count: period.value,
          }).toString()
        : t(`${str}Days`, {
            ...args,
            count: period?.value,
          }).toString();
    return value ?? "";
  };

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

  useEffect(() => {
    setCheckbox1(false);
    setCheckbox2(false);
    setCheckbox3(false);
  }, [open]);

  const approved =
    typeof allowance.data !== "undefined" && allowance.data >= weiAmount;
  const approvedArbitrumGasToken =
    typeof arbitrumGasTokenAllowance.data !== "undefined" &&
    arbitrumGasTokenAllowance.data >= 1;

  const approveArbitrumGasTokenButton = match({
    approved: approvedArbitrumGasToken,
    approving: approveArbitrumGasToken.isLoading,
  })
    .with({ approving: true }, () => ({
      onSubmit: () => {},
      buttonText: "Approving gas token", // t("approving"),
      disabled: true,
    }))
    .with({ approved: false }, () => {
      // this kind of sucks for forced withdrawals, but we do approvals on the from chain for now
      if (from && account.chainId !== from.id) {
        return {
          onSubmit: () => switchChain(from),
          buttonText: "Switch to approve gas token", // t("switchToApprove"),
          disabled: false,
        };
      }
      return {
        onSubmit: () => approveArbitrumGasToken.write(),
        buttonText: "Approve gas token", // t("approve"),
        disabled: false,
      };
    })
    .with({ approved: true }, () => ({
      onSubmit: () => {},
      buttonText: "Approved gas token", // t("confirmationModal.approved"),
      disabled: true,
    }))
    .exhaustive();

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
      if (from && account.chainId !== from?.id) {
        return {
          onSubmit: () => switchChain(from),
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
      buttonText: t("confirmationModal.approved"),
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
      buttonText: d.withdrawing
        ? t("confirmationModal.initiateWithdrawal")
        : t("confirmationModal.initiateDeposit"),
      disabled: true,
    }))
    .with({ bridge: { write: { isLoading: true } } }, (d) => ({
      onSubmit: () => {},
      buttonText: d.withdrawing ? t("withdrawing") : t("depositing"),
      disabled: false,
    }))
    .otherwise((d) => ({
      onSubmit: onConfirm,
      buttonText: d.withdrawing
        ? t("confirmationModal.initiateWithdrawal")
        : t("confirmationModal.initiateDeposit"),
      disabled: false,
    }));

  const common = {
    from: from?.name,
    to: to?.name,
    base: deployment?.l1.name,
    rollup: deployment?.l2.name,
    symbol: token?.symbol,
  };

  const title = match({
    isUsdc: isNativeUsdc(stateToken),
    withdrawing,
    escapeHatch,
    family: deployment?.family,
  })
    .with({ isUsdc: true, withdrawing: true, escapeHatch: true }, () =>
      t("confirmationModal.cctpWithdrawalTitleEscapeHatch", {
        mins: totalBridgeTime?.value,
        symbol: token?.symbol,
      })
    )
    .with({ isUsdc: true, withdrawing: true }, () =>
      t("confirmationModal.cctpWithdrawalTitle", {
        mins: totalBridgeTime?.value,
        symbol: token?.symbol,
      })
    )
    .with({ isUsdc: true, withdrawing: false }, () =>
      t("confirmationModal.cctpDepositTitle", {
        mins: totalBridgeTime?.value,
        symbol: token?.symbol,
      })
    )
    .with({ withdrawing: true, escapeHatch: true }, () =>
      transformPeriodText(
        "confirmationModal.withdrawalTitleEscapeHatch",
        common,
        totalBridgeTime
      )
    )
    .with({ withdrawing: true }, () =>
      transformPeriodText(
        "confirmationModal.withdrawalTitle",
        common,
        totalBridgeTime
      )
    )
    .with({ withdrawing: false }, () =>
      t("confirmationModal.depositTitle", {
        ...common,
        mins: totalBridgeTime?.value,
      })
    )
    .otherwise(() => "");

  const description = match({
    isUsdc: isNativeUsdc(stateToken),
    withdrawing,
    escapeHatch,
    family: deployment?.family,
    isEth: isNativeToken(stateToken),
  })
    .with({ isUsdc: true, withdrawing: true, escapeHatch: true }, () =>
      t("confirmationModal.cctpDescriptionEscapeHatch", common)
    )
    .with({ isUsdc: true }, () =>
      t("confirmationModal.cctpDescription", common)
    )
    .with(
      { withdrawing: true, family: "optimism", isEth: true, escapeHatch: true },
      () => t("confirmationModal.opDescriptionEscapeHatch", common)
    )
    .with({ withdrawing: true, family: "optimism", isEth: true }, () =>
      t("confirmationModal.opDescription", common)
    )
    .with(
      {
        withdrawing: true,
        family: "optimism",
        escapeHatch: true,
        isEth: false,
      },
      () => t("confirmationModal.opDescriptionTokenEscapeHatch", common)
    )
    .with({ withdrawing: true, family: "optimism", isEth: false }, () =>
      t("confirmationModal.opDescriptionToken", common)
    )
    .with({ withdrawing: true, family: "arbitrum", isEth: false }, () =>
      t("confirmationModal.arbDescriptionToken", common)
    )
    .with({ withdrawing: true, family: "arbitrum", isEth: true }, () =>
      t("confirmationModal.arbDescription", common)
    )
    .with({ withdrawing: false }, () => "")
    .otherwise(() => null);

  const checkbox1Text = match({
    isUsdc: isNativeUsdc(stateToken),
    withdrawing,
    family: deployment?.family,
  })
    .with({ isUsdc: true }, () =>
      t("confirmationModal.checkbox1Cctp", {
        mins: totalBridgeTime?.value,
        to: to?.name,
      })
    )
    .with({ withdrawing: true, family: "optimism" }, () =>
      transformPeriodText(
        "confirmationModal.opCheckbox1Withdrawal",
        common,
        totalBridgeTime
      )
    )
    .with({ withdrawing: true, family: "arbitrum" }, () =>
      transformPeriodText(
        "confirmationModal.arbCheckbox1Withdrawal",
        common,
        totalBridgeTime
      )
    )
    .with({ withdrawing: false }, () =>
      t("confirmationModal.checkbox1Deposit", {
        ...common,
        mins: totalBridgeTime?.value,
      })
    )
    .otherwise(() => null);

  const lineItems = match({
    isUsdc: isNativeUsdc(stateToken),
    withdrawing,
    family: deployment?.family,
    escapeHatch,
  })
    .with({ isUsdc: true, escapeHatch: true }, () => [
      {
        text: t("confirmationModal.initiateBridgeEscapeHatch", common),
        icon: InitiateIcon,
        fee: fee(initiateCost, 4),
      },
      {
        text: transformPeriodText(
          "confirmationModal.wait",
          {},
          totalBridgeTime
        ),
        icon: WaitIcon,
      },
      {
        text: t("confirmationModal.finalize", common),
        icon: FinalizeIcon,
        fee: fee(finalizeCost, 4),
      },
    ])
    .with({ isUsdc: true }, () => [
      {
        text: t("confirmationModal.initiateBridge"),
        icon: InitiateIcon,
        fee: fee(initiateCost, 4),
      },
      {
        text: transformPeriodText(
          "confirmationModal.wait",
          {},
          totalBridgeTime
        ),
        icon: WaitIcon,
      },
      {
        text: t("confirmationModal.finalize", common),
        icon: FinalizeIcon,
        fee: fee(finalizeCost, 4),
      },
    ])
    .with({ withdrawing: true, family: "optimism", escapeHatch: true }, () => [
      {
        text: t("confirmationModal.initiateBridgeEscapeHatch", common),
        icon: EscapeHatchIcon,
        fee: fee(initiateCost, 4),
      },
      {
        text: transformPeriodText(
          "confirmationModal.wait",
          {},
          addPeriods(depositTime, proveTime)
        ),
        icon: WaitIcon,
      },
      {
        text: t("confirmationModal.prove", common),
        icon: ProveIcon,
        fee: fee(proveCost, 4),
      },
      {
        text: transformPeriodText(
          "confirmationModal.wait",
          {},
          finalizationTime
        ),
        icon: WaitIcon,
      },
      {
        text: t("confirmationModal.finalize", common),
        icon: FinalizeIcon,
        fee: fee(finalizeCost, 2),
      },
    ])
    .with({ withdrawing: true, family: "optimism" }, () => [
      {
        text: t("confirmationModal.initiateWithdrawal"),
        icon: InitiateIcon,
        fee: fee(initiateCost, 4),
      },
      {
        text: transformPeriodText("confirmationModal.wait", {}, proveTime),
        icon: WaitIcon,
      },
      {
        text: t("confirmationModal.prove", common),
        icon: ProveIcon,
        fee: fee(proveCost, 4),
      },
      {
        text: transformPeriodText(
          "confirmationModal.wait",
          {},
          finalizationTime
        ),
        icon: WaitIcon,
      },
      {
        text: t("confirmationModal.finalize", common),
        icon: FinalizeIcon,
        fee: fee(finalizeCost, 2),
      },
    ])

    .with({ withdrawing: true, family: "arbitrum" }, () => [
      {
        text: t("confirmationModal.initiateWithdrawal"),
        icon: InitiateIcon,
        fee: fee(initiateCost, 4),
      },
      {
        text: transformPeriodText(
          "confirmationModal.wait",
          {},
          finalizationTime
        ),
        icon: WaitIcon,
      },
      {
        text: t("confirmationModal.finalize", common),
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
      {
        text: t("confirmationModal.waitMinutes", {
          count: totalBridgeTime?.value,
        }),
        icon: WaitIcon,
      },
      {
        text: t("confirmationModal.receiveDeposit", common),
        icon: ReceiveIcon,
      },
    ])
    .with({ withdrawing: false, family: "arbitrum" }, () => [
      {
        text: t("confirmationModal.initiateDeposit"),
        icon: InitiateIcon,
        fee: fee(initiateCost, 4),
      },
      {
        text: t("confirmationModal.waitMinutes", {
          count: totalBridgeTime?.value,
        }),
        icon: WaitIcon,
      },
      {
        text: t("confirmationModal.receiveDeposit", common),
        icon: ReceiveIcon,
      },
    ])
    .otherwise(() => null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <div className="flex flex-col p-6 pt-8">
          <div className="flex flex-col gap-1">
            <h1 className="font-bold text-xl tracking-tighter text-pretty leading-6 mr-6">
              {title}
            </h1>
            <p className="text-xs md:text-sm text-pretty">
              {description}{" "}
              <Link
                href={
                  isNativeUsdc(stateToken)
                    ? "https://docs.rollbridge.app/native-usdc"
                    : "https://docs.rollbridge.app/what-is-bridging"
                }
                className="underline font-medium"
                target="_blank"
              >
                {t("confirmationModal.learnMore")}
              </Link>
            </p>
          </div>
          <div className="justify-end flex items-center px-1 py-1">
            <span className="text-zinc-400 font-medium text-[11px]">
              {t("confirmationModal.approxFees")}
            </span>
          </div>
          <div className="py-1 flex flex-col border border-zinc-100 dark:border-zinc-100/10 divide-y divide-zinc-100 dark:divide-zinc-100/10 rounded-[16px]">
            {approveButton && (
              <LineItem
                text={t("confirmationModal.approve", { symbol: token?.symbol })}
                icon={ApproveIcon}
                fee={fee(approveCost, 4)}
              />
            )}

            {lineItems?.map(({ text, icon, fee }) => (
              <LineItem key={text} text={text} icon={icon} fee={fee} />
            ))}
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
                className="text-[11px] text-zinc-500 dark:text-zinc-400 tracking-tighter"
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
              <label
                htmlFor="speed"
                className="text-[11px] text-zinc-500 dark:text-zinc-400 tracking-tighter"
              >
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
              <label
                htmlFor="fees"
                className="text-[11px] text-zinc-500 dark:text-zinc-400 tracking-tighter"
              >
                {t("confirmationModal.checkbox3")}
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {!withdrawing &&
              arbitrumGasToken &&
              approveArbitrumGasTokenButton && (
                <Button
                  className={clsx(
                    "flex w-full justify-center rounded-full px-3 py-6 text-sm font-bold leading-6 text-white shadow-sm",
                    theme.accentText,
                    theme.accentBg
                  )}
                  onClick={approveArbitrumGasTokenButton.onSubmit}
                  disabled={
                    !checkbox1 ||
                    !checkbox2 ||
                    !checkbox3 ||
                    approveArbitrumGasTokenButton.disabled
                  }
                >
                  {approveArbitrumGasTokenButton.buttonText}
                  {approvedArbitrumGasToken && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="12"
                      viewBox="0 0 15 12"
                      className="fill-white dark:fill-zinc-950 ml-2 h-2.5 w-auto"
                    >
                      <path d="M6.80216 12C6.32268 12 5.94594 11.8716 5.67623 11.559L0.63306 6.02355C0.384755 5.7624 0.269165 5.41563 0.269165 5.07742C0.269165 4.31109 0.915614 3.67749 1.66909 3.67749C2.04583 3.67749 2.42257 3.83161 2.69228 4.13129L6.57955 8.38245L12.1921 0.56939C12.4661 0.192651 12.8899 0 13.3309 0C14.0715 0 14.7308 0.56939 14.7308 1.38709C14.7308 1.67392 14.6538 1.96932 14.4697 2.21762L7.84676 11.4306C7.61558 11.7688 7.21315 12 6.79788 12H6.80216Z" />
                    </svg>
                  )}
                </Button>
              )}

            {approveButton && (
              <Button
                className={clsx(
                  "flex w-full justify-center rounded-full px-3 py-6 text-sm font-bold leading-6 text-white shadow-sm",
                  theme.accentText,
                  theme.accentBg
                  // approved && "bg-green-300 dark:bg-green-300"
                )}
                onClick={approveButton.onSubmit}
                disabled={
                  !checkbox1 ||
                  !checkbox2 ||
                  !checkbox3 ||
                  approveButton.disabled
                }
              >
                {approveButton.buttonText}
                {approved && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="12"
                    viewBox="0 0 15 12"
                    className="fill-white dark:fill-zinc-950 ml-2 h-2.5 w-auto"
                  >
                    <path d="M6.80216 12C6.32268 12 5.94594 11.8716 5.67623 11.559L0.63306 6.02355C0.384755 5.7624 0.269165 5.41563 0.269165 5.07742C0.269165 4.31109 0.915614 3.67749 1.66909 3.67749C2.04583 3.67749 2.42257 3.83161 2.69228 4.13129L6.57955 8.38245L12.1921 0.56939C12.4661 0.192651 12.8899 0 13.3309 0C14.0715 0 14.7308 0.56939 14.7308 1.38709C14.7308 1.67392 14.6538 1.96932 14.4697 2.21762L7.84676 11.4306C7.61558 11.7688 7.21315 12 6.79788 12H6.80216Z" />
                  </svg>
                )}
              </Button>
            )}

            <Button
              className={`flex w-full justify-center rounded-full px-3 py-6 text-sm font-bold leading-6 text-white shadow-sm ${theme.accentText} ${theme.accentBg}`}
              onClick={initiateButton.onSubmit}
              disabled={
                !checkbox1 ||
                !checkbox2 ||
                !checkbox3 ||
                initiateButton.disabled
              }
            >
              {initiateButton.buttonText}
            </Button>

            {typeof window !== "undefined" &&
              window.location.host === "superbridge.app" &&
              (withdrawing || isNativeUsdc(stateToken)) && (
                <Link
                  className={`mt-2 leading-3 text-center text-xs font-medium tracking-tight cursor-pointer transition-all opacity-70 hover:opacity-100 ${theme.textColor}`}
                  href="/alternative-bridges"
                  target="_blank"
                >
                  {t("confirmationModal.viewAlternateBridges")}
                </Link>
              )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
