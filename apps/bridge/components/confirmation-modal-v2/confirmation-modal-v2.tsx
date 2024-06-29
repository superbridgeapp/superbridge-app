import clsx from "clsx";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { isPresent } from "ts-is-present";
import { match } from "ts-pattern";
import { formatUnits } from "viem";
import { useAccount, useEstimateFeesPerGas } from "wagmi";

import { DeploymentFamily } from "@/codegen/model";
import { Checkbox } from "@/components/ui/checkbox";
import { isSuperbridge } from "@/config/superbridge";
import { currencySymbolMap } from "@/constants/currency-symbol-map";
import { FINALIZE_GAS, PROVE_GAS } from "@/constants/gas-limits";
import { useAllowance } from "@/hooks/use-allowance";
import { useAllowanceGasToken } from "@/hooks/use-allowance-gas-token";
import { useApprove } from "@/hooks/use-approve";
import { useApproveGasToken, useGasToken } from "@/hooks/use-approve-gas-token";
import { useBridge } from "@/hooks/use-bridge";
import { useFromChain, useToChain } from "@/hooks/use-chain";
import { useDeployment } from "@/hooks/use-deployment";
import {
  Period,
  addPeriods,
  useDepositTime,
  useFinalizationPeriod,
  useProvePeriod,
  useTotalBridgeTime,
} from "@/hooks/use-finalization-period";
import { useNativeToken, useToNativeToken } from "@/hooks/use-native-token";
import { useTokenPrice } from "@/hooks/use-prices";
import { useRequiredCustomGasTokenBalance } from "@/hooks/use-required-custom-gas-token-balance";
import { useSelectedToken } from "@/hooks/use-selected-token";
import { useSwitchChain } from "@/hooks/use-switch-chain";
import { useWeiAmount } from "@/hooks/use-wei-amount";
import { useConfigState } from "@/state/config";
import { useSettingsState } from "@/state/settings";
import { Token } from "@/types/token";
import { isNativeToken } from "@/utils/is-eth";
import { isNativeUsdc } from "@/utils/is-usdc";
import { isArbitrum } from "@/utils/is-mainnet";

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
import { ConfirmationModalStartTab } from "./start-tab";
import { ConfirmationModalTermsTab } from "./terms-tab";
import { ConfirmationModalReviewTab } from "./review-tab";

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
        <p className="text-sm">{text}</p>
      </div>
      {fee && (
        <div className="flex gap-2 items-center">
          <p className="text-sm">{fee}</p>
          <FeesIcon />
        </div>
      )}
    </div>
  );
}

export const ConfirmationModalV2 = ({
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
  const account = useAccount();
  const withdrawing = useConfigState.useWithdrawing();
  const escapeHatch = useConfigState.useForceViaL1();
  const fast = useConfigState.useFast();
  const { gas } = useBridge();

  const gasToken = useGasToken();
  const gasTokenAllowance = useAllowanceGasToken();
  const deployment = useDeployment();
  const approveGasToken = useApproveGasToken(
    gasTokenAllowance.refetch,
    bridge.refetch
  );

  const finalizationTime = useFinalizationPeriod();
  const proveTime = useProvePeriod(deployment);
  const depositTime = useDepositTime(deployment);
  const totalBridgeTime = useTotalBridgeTime(deployment);

  const fromFeeData = useEstimateFeesPerGas({ chainId: from?.id });
  const toFeeData = useEstimateFeesPerGas({ chainId: to?.id });

  const fromNativeToken = useNativeToken();
  const toNativeToken = useToNativeToken();
  const switchChain = useSwitchChain();

  const fromNativeTokenPrice = useTokenPrice(fromNativeToken ?? null);
  const toNativeTokenPrice = useTokenPrice(toNativeToken ?? null);

  const fromGasPrice =
    fromFeeData.data?.gasPrice ?? fromFeeData.data?.maxFeePerGas ?? BigInt(0);
  const toGasPrice =
    toFeeData.data?.gasPrice ?? toFeeData.data?.maxFeePerGas ?? BigInt(0);

  const fromGas = {
    token: fromNativeToken?.[from?.id ?? 0],
    price: fromNativeTokenPrice,
    gasPrice: fromGasPrice,
  };
  const toGas = {
    token: toNativeToken?.[to?.id ?? 0],
    price: toNativeTokenPrice,
    gasPrice: toGasPrice,
  };

  const initiateCost =
    withdrawing && escapeHatch
      ? { gasToken: toGas, gasLimit: gas ?? BigInt(200_000) }
      : { gasToken: fromGas, gasLimit: gas ?? BigInt(200_000) };
  const proveCost = { gasToken: toGas, gasLimit: PROVE_GAS };
  const finalizeCost = {
    gasToken: toGas,
    gasLimit: FINALIZE_GAS,
  };
  const approveCost = {
    gasToken: fromGas,
    gasLimit: BigInt(50_000),
  };
  const approveGasTokenCost = {
    gasToken: fromGas,
    gasLimit: BigInt(50_000),
  };

  const fee = (
    {
      gasLimit,
      gasToken,
    }: {
      gasToken: {
        token: Token | undefined;
        price: number | null;
        gasPrice: bigint;
      };
      gasLimit: bigint;
    },
    maximumFractionDigits: number
  ) => {
    const nativeTokenAmount = gasLimit * gasToken.gasPrice;

    const formattedAmount = parseFloat(
      formatUnits(nativeTokenAmount, gasToken.token?.decimals ?? 18)
    );

    if (!gasToken.price) {
      return `${formattedAmount} ${gasToken.token?.symbol}`;
    }

    const amount = (gasToken.price * formattedAmount).toLocaleString("en", {
      maximumFractionDigits,
    });

    return `${currencySymbolMap[currency]}${amount}`;
  };

  const approved =
    typeof allowance.data !== "undefined" && allowance.data >= weiAmount;

  const requiredCustomGasTokenBalance = useRequiredCustomGasTokenBalance();
  const approvedGasToken = (() => {
    if (typeof gasTokenAllowance.data === "undefined" || !deployment)
      return false;
    if (isArbitrum(deployment)) {
      return (
        !!requiredCustomGasTokenBalance &&
        gasTokenAllowance.data > requiredCustomGasTokenBalance
      );
    } else {
      return isNativeToken(stateToken) && gasTokenAllowance.data >= weiAmount;
    }
  })();

  const approveGasTokenButton = match({
    withdrawing,
    gasToken,
    family: deployment?.family,
    isNativeToken: !!stateToken && isNativeToken(stateToken),
    approved: approvedGasToken,
    approving: approveGasToken.isLoading,
  })
    .with({ withdrawing: true }, () => null)
    .with({ gasToken: null }, () => null)
    .with({ family: undefined }, () => null)
    .with(
      { family: DeploymentFamily.optimism, isNativeToken: false },
      () => null
    )
    .with({ approving: true }, () => ({
      onSubmit: () => {},
      buttonText: t("confirmationModal.approvingGasToken"),
      disabled: true,
    }))
    .with({ approved: false }, () => {
      // this kind of sucks for forced withdrawals, but we do approvals on the from chain for now
      if (from && account.chainId !== from.id) {
        return {
          onSubmit: () => switchChain(from),
          buttonText: t("confirmationModal.switchToApproveGasToken"),
          disabled: false,
        };
      }
      return {
        onSubmit: () => approveGasToken.write(),
        buttonText: t("confirmationModal.approveGasToken"),
        disabled: false,
      };
    })
    .with({ approved: true }, () => ({
      onSubmit: () => {},
      buttonText: t("confirmationModal.approvedGasToken"),
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
    needsGasTokenApprove: (() => {
      if (
        !deployment ||
        !deployment.arbitrumNativeToken ||
        approvedGasToken ||
        withdrawing
      )
        return false;

      // always need to approve arbitrum gas token to pay additional gas
      if (isArbitrum(deployment)) {
        return !!deployment?.arbitrumNativeToken;
      } else {
        // only need to approve gas token if we're doing a native token deposit
        return isNativeToken(stateToken);
      }
    })(),
    bridge,
    withdrawing,
    isNativeToken: isNativeToken(stateToken),
  })
    .with({ bridge: { isLoading: true } }, (d) => ({
      onSubmit: () => {},
      buttonText: d.withdrawing ? t("withdrawing") : t("depositing"),
      disabled: true,
    }))
    .with({ needsApprove: true }, (d) => ({
      onSubmit: () => {},
      buttonText: d.withdrawing
        ? t("confirmationModal.initiateWithdrawal")
        : t("confirmationModal.initiateDeposit"),
      disabled: true,
    }))
    .with({ needsGasTokenApprove: true }, (d) => ({
      onSubmit: () => {},
      buttonText: d.withdrawing
        ? t("confirmationModal.initiateWithdrawal")
        : t("confirmationModal.initiateDeposit"),
      disabled: true,
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
    fast,
    isUsdc: isNativeUsdc(stateToken),
    withdrawing,
    escapeHatch,
    family: deployment?.family,
  })
    .with({ fast: true }, () => {
      return "Fast bridging via Across";
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
    fast,
    isUsdc: isNativeUsdc(stateToken),
    withdrawing,
    escapeHatch,
    family: deployment?.family,
    isEth: isNativeToken(stateToken),
  })
    .with(
      { fast: true },
      () =>
        "Bridge times via Across change with the amount you want to bridge. Try a smaller value for a faster bridge time."
    )
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

  const lineItems = match({
    fast,
    isUsdc: isNativeUsdc(stateToken),
    withdrawing,
    family: deployment?.family,
    escapeHatch,
    gasToken,
  })
    .with({ fast: true }, (c) =>
      [
        c.gasToken
          ? {
              text: t("confirmationModal.approveGasToken"),
              icon: ApproveIcon,
              fee: fee(approveGasTokenCost, 4),
            }
          : null,
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
      ].filter(isPresent)
    )
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
    .with({ withdrawing: false, family: "optimism" }, (c) =>
      [
        c.gasToken && isNativeToken(stateToken)
          ? {
              text: t("confirmationModal.approveGasToken"),
              icon: ApproveIcon,
              fee: fee(approveGasTokenCost, 4),
            }
          : null,
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
      ].filter(isPresent)
    )
    .with({ withdrawing: false, family: "arbitrum" }, (c) =>
      [
        c.gasToken
          ? {
              text: t("confirmationModal.approveGasToken"),
              icon: ApproveIcon,
              fee: fee(approveGasTokenCost, 4),
            }
          : null,
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
      ].filter(isPresent)
    )
    .otherwise(() => null);

  const [activeIndex, setActiveIndex] = useState(0);
  const tabs = [
    {
      name: "start",
      component: (
        <ConfirmationModalStartTab
          onNext={() => setActiveIndex((i) => i + 1)}
        />
      ),
    },
    {
      name: "terms",
      component: (
        <ConfirmationModalTermsTab
          onNext={() => setActiveIndex((i) => i + 1)}
          commonTranslationProps={common}
        />
      ),
    },
    { name: "review", component: <ConfirmationModalReviewTab /> },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent hideCloseButton>
        <div className="flex justify-between items center p-4 border-b border-muted">
          <div className="w-10 h-10 shrink-0">
            {/* back button */}
            {activeIndex !== 0 && (
              <button
                onClick={() => setActiveIndex((a) => a - 1)}
                className="w-10 h-10 shrink-0 flex items-center justify-center bg-muted rounded-full hover:scale-105 transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="w-3.5 h-3.5 fill-foreground"
                >
                  <path d="M7 0.677246C6.70724 0.677246 6.41553 0.769919 6.1849 0.984753L0.523395 5.9849C0.246428 6.23133 0 6.55463 0 7.0001C0 7.44556 0.246428 7.76887 0.523395 8.01529L6.1849 13.0154C6.41553 13.2313 6.70829 13.323 7 13.323C7.67715 13.323 8.23108 12.769 8.23108 12.0919C8.23108 11.738 8.09312 11.4147 7.81616 11.1693L4.49361 8.23118H12.7689C13.4461 8.23118 14 7.67725 14 7.0001C14 6.32295 13.4461 5.76902 12.7689 5.76902H4.49255L7.8151 2.83085C8.09207 2.58442 8.23003 2.26217 8.23003 1.90833C8.23003 1.23118 7.67609 0.677246 6.99895 0.677246L7 0.677246Z" />
                </svg>
              </button>
            )}
          </div>

          {/* tabs */}
          <div className="flex items-center gap-1 justify-center w-full">
            {tabs.map((tab, index) => (
              <div
                key={tab.name}
                className={clsx(
                  "w-10 h-1 rounded-full",
                  index === activeIndex ? "bg-primary" : "bg-muted"
                )}
              ></div>
            ))}
          </div>
          <div className="w-10 h-10 shrink-0" />
        </div>

        <div>{tabs[activeIndex].component}</div>
      </DialogContent>
    </Dialog>
  );
};
