import clsx from "clsx";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { isPresent } from "ts-is-present";
import { match } from "ts-pattern";
import { formatUnits } from "viem";
import { useAccount, useEstimateFeesPerGas } from "wagmi";

import { ChainDto, DeploymentFamily } from "@/codegen/model";
import { isSuperbridge } from "@/config/superbridge";
import { currencySymbolMap } from "@/constants/currency-symbol-map";
import { FINALIZE_GAS, PROVE_GAS } from "@/constants/gas-limits";
import { useBridge } from "@/hooks/bridge/use-bridge";
import { useSubmitBridge } from "@/hooks/bridge/use-submit-bridge";
import { useAllowance } from "@/hooks/use-allowance";
import { useAllowanceGasToken } from "@/hooks/use-allowance-gas-token";
import { useApprove } from "@/hooks/use-approve";
import { useApproveGasToken, useGasToken } from "@/hooks/use-approve-gas-token";
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
import { useReceiveAmount } from "@/hooks/use-receive-amount";
import { useRequiredCustomGasTokenBalance } from "@/hooks/use-required-custom-gas-token-balance";
import { useSelectedToken } from "@/hooks/use-selected-token";
import { useSwitchChain } from "@/hooks/use-switch-chain";
import { useWeiAmount } from "@/hooks/use-wei-amount";
import { useConfigState } from "@/state/config";
import { useSettingsState } from "@/state/settings";
import { Token } from "@/types/token";
import { formatDecimals } from "@/utils/format-decimals";
import { isNativeToken } from "@/utils/is-eth";
import { isArbitrum } from "@/utils/is-mainnet";
import { isNativeUsdc } from "@/utils/is-usdc";

import { FastNetworkIcon } from "../fast/network-icon";
import { IconSuperFast, IconTime } from "../icons";
import { NetworkIcon } from "../network-icon";
import { PoweredByAcross } from "../powered-by-across";
import { Button } from "../ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  EscapeHatchIcon,
  FinalizeIcon,
  InitiateIcon,
  ProveIcon,
  ReceiveIcon,
  WaitIcon,
} from "./icons";

function LineItem({
  text,
  fee,
  className,
  button,
  chain,
}: {
  text: string;
  fee?: string | null;
  className?: string;
  button?: any;
  chain?: ChainDto | undefined;
}) {
  const deployment = useDeployment();
  const fast = useConfigState.useFast();

  if (!chain) {
    return (
      <div className="flex gap-4 px-3 py-2 rounded-lg justify-start items-center">
        <div className="flex items-center gap-2">
          <IconTime className="w-7 h-7" />
          <span className="text-xs font-heading leading-none text-muted-foreground">
            {text}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "flex gap-4 px-3 py-4 rounded-lg justify-between bg-muted",
        className
      )}
    >
      <div className="flex items-center gap-2">
        {fast ? (
          <FastNetworkIcon chain={chain} className="w-7 h-7" />
        ) : (
          <NetworkIcon
            deployment={deployment}
            chain={chain}
            className="w-7 h-7"
          />
        )}
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-heading leading-none">{text}</span>
          <span className="text-xs text-muted-foreground leading-none">
            {fee && <p className="text-xs">{fee}</p>}
          </span>
        </div>
      </div>

      {button}
    </div>
  );
}

export const ConfirmationModalStartTab = ({
  approve,
  allowance,
  bridge,
  initiateBridge,
}: {
  approve: ReturnType<typeof useApprove>;
  allowance: ReturnType<typeof useAllowance>;
  bridge: ReturnType<typeof useBridge>;
  initiateBridge: () => void;
}) => {
  const { t } = useTranslation();

  const currency = useSettingsState.useCurrency();
  const stateToken = useConfigState.useToken();
  const withdrawing = useConfigState.useWithdrawing();
  const escapeHatch = useConfigState.useForceViaL1();
  const fast = useConfigState.useFast();
  const rawAmount = useConfigState.useRawAmount();

  const from = useFromChain();
  const to = useToChain();
  const weiAmount = useWeiAmount();
  const account = useAccount();
  const { gas } = useBridge();
  const receive = useReceiveAmount();
  const token = useSelectedToken();
  const gasToken = useGasToken();

  const onSubmitBridge = useSubmitBridge(initiateBridge);

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
    fast,
  })
    .with({ bridge: { isLoading: true } }, (d) => ({
      onSubmit: () => {},
      buttonText: d.fast
        ? t("bridging")
        : d.withdrawing
        ? t("withdrawing")
        : t("depositing"),
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
      onSubmit: onSubmitBridge,
      buttonText: d.fast
        ? t("confirmationModal.initiateBridge")
        : d.withdrawing
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
    receiveAmount: formatDecimals(receive.data),
    receiveSymbol: stateToken?.[to?.id ?? 0]?.symbol,
  };

  const title = match({
    fast,
    isUsdc: isNativeUsdc(stateToken),
    withdrawing,
    escapeHatch,
    family: deployment?.family,
  })
    .with({ fast: true }, () => {
      return "Superfast bridge";
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
    .with({ fast: true }, () =>
      t("confirmationModal.acrossDescription", common)
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
        {
          text: t("confirmationModal.initiateDeposit"),
          icon: InitiateIcon,
          fee: fee(initiateCost, 4),
          initiate: true,
          chain: from,
        },
        {
          text: t("confirmationModal.waitMinutes", {
            count: totalBridgeTime?.value,
          }),
          icon: WaitIcon,
        },
        {
          text: t("confirmationModal.receiveAmountOnChain", common),
          icon: ReceiveIcon,
          chain: to,
        },
      ].filter(isPresent)
    )
    .with({ isUsdc: true, escapeHatch: true }, () => [
      {
        text: t("confirmationModal.initiateBridgeEscapeHatch", common),
        icon: InitiateIcon,
        fee: fee(initiateCost, 4),
        initiate: true,
        chain: deployment?.l1,
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
        chain: to,
      },
    ])
    .with({ isUsdc: true }, () => [
      {
        text: t("confirmationModal.initiateBridge"),
        icon: InitiateIcon,
        fee: fee(initiateCost, 4),
        chain: from,
        initiate: true,
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
        chain: to,
      },
    ])
    .with({ withdrawing: true, family: "optimism", escapeHatch: true }, () => [
      {
        text: t("confirmationModal.initiateBridgeEscapeHatch", common),
        icon: EscapeHatchIcon,
        fee: fee(initiateCost, 4),
        chain: deployment?.l1,
        initiate: true,
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
        chain: deployment?.l1,
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
        chain: deployment?.l1,
      },
    ])
    .with({ withdrawing: true, family: "optimism" }, () => [
      {
        text: t("confirmationModal.initiateWithdrawal"),
        icon: InitiateIcon,
        fee: fee(initiateCost, 4),
        chain: deployment?.l2,
        initiate: true,
      },
      {
        text: transformPeriodText("confirmationModal.wait", {}, proveTime),
        icon: WaitIcon,
      },
      {
        text: t("confirmationModal.prove", common),
        icon: ProveIcon,
        fee: fee(proveCost, 4),
        chain: deployment?.l1,
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
        chain: deployment?.l1,
      },
    ])

    .with({ withdrawing: true, family: "arbitrum" }, () => [
      {
        text: t("confirmationModal.initiateWithdrawal"),
        icon: InitiateIcon,
        fee: fee(initiateCost, 4),
        chain: deployment?.l2,
        initiate: true,
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
        chain: deployment?.l1,
      },
    ])
    .with({ withdrawing: false, family: "optimism" }, (c) =>
      [
        {
          text: t("confirmationModal.initiateDeposit"),
          icon: InitiateIcon,
          fee: fee(initiateCost, 4),
          chain: deployment?.l1,
          initiate: true,
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
          chain: deployment?.l2,
        },
      ].filter(isPresent)
    )
    .with({ withdrawing: false, family: "arbitrum" }, (c) =>
      [
        {
          text: t("confirmationModal.initiateDeposit"),
          icon: InitiateIcon,
          fee: fee(initiateCost, 4),
          initiate: true,
          chain: deployment?.l1,
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
          chain: deployment?.l2,
        },
      ].filter(isPresent)
    )
    .otherwise(() => null);

  return (
    <div>
      <DialogHeader className="items-center">
        <DialogTitle className="text-3xl">Start your bridge</DialogTitle>
        <DialogDescription>
          Bridging {rawAmount} {token?.symbol} from {from?.name} to {to?.name}
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col p-6 pt-0 gap-1">
        {fast && (
          <div className="flex flex-col items-center gap-2 text-center mb-3">
            <div className="animate-wiggle-waggle">
              <IconSuperFast className="w-10 h-auto" />
            </div>
            <h1 className="font-heading tracking-tight text-2xl text-pretty leading-6">
              {title}
            </h1>
            <PoweredByAcross />
            <p className="text-xs md:text-sm text-pretty text-muted-foreground tracking-tight">
              {description}
            </p>
          </div>
        )}

        {approveGasTokenButton && (
          <>
            <LineItem
              text={t("confirmationModal.approveGasToken", {
                symbol: token?.symbol,
              })}
              chain={from}
              fee={fee(approveCost, 4)}
              button={
                <Button
                  onClick={approveGasTokenButton.onSubmit}
                  disabled={approveGasTokenButton.disabled}
                >
                  {approveGasTokenButton.buttonText}
                  {approvedGasToken && (
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
              }
            />
          </>
        )}

        {approveButton && (
          <>
            <LineItem
              text={t("confirmationModal.approve", { symbol: token?.symbol })}
              chain={from}
              fee={fee(approveCost, 4)}
              button={
                <Button
                  onClick={approveButton.onSubmit}
                  disabled={approveButton.disabled}
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
              }
            />
          </>
        )}

        {lineItems?.map(({ text, fee, chain, initiate }) => (
          <LineItem
            key={text}
            text={text}
            fee={fee}
            chain={chain}
            button={
              initiate ? (
                <Button
                  onClick={initiateButton.onSubmit}
                  disabled={initiateButton.disabled}
                  size={"xs"}
                >
                  {initiateButton.buttonText}
                </Button>
              ) : undefined
            }
          />
        ))}
      </div>
      <DialogFooter>
        {isSuperbridge &&
          !fast &&
          (withdrawing || isNativeUsdc(stateToken)) && (
            <Link
              className={`mt-2 leading-3 text-center text-xs   cursor-pointer transition-all opacity-70 hover:opacity-100`}
              href="/alternative-bridges"
              target="_blank"
            >
              {t("confirmationModal.viewAlternateBridges")}
            </Link>
          )}
      </DialogFooter>
    </div>
  );
};
