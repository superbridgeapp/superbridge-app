import clsx from "clsx";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { isPresent } from "ts-is-present";
import { match } from "ts-pattern";
import { formatUnits } from "viem";
import { useAccount, useEstimateFeesPerGas } from "wagmi";

import {
  ChainDto,
  DeploymentFamily,
  RouteProvider,
  RouteStepType,
} from "@/codegen/model";
import { IconSimpleGas, IconSuperFast, IconTime } from "@/components/icons";
import { NetworkIcon } from "@/components/network-icon";
import { PoweredByAcross } from "@/components/powered-by-across";
import { RouteProviderIcon } from "@/components/route-provider-icon";
import { TokenIcon } from "@/components/token-icon";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { isSuperbridge } from "@/config/app";
import { currencySymbolMap } from "@/constants/currency-symbol-map";
import { useBridge } from "@/hooks/bridge/use-bridge";
import { useSubmitBridge } from "@/hooks/bridge/use-submit-bridge";
import { useAllowance } from "@/hooks/use-allowance";
import { useAllowanceGasToken } from "@/hooks/use-allowance-gas-token";
import { useApprove } from "@/hooks/use-approve";
import { useApproveGasToken, useGasToken } from "@/hooks/use-approve-gas-token";
import { useFromChain, useToChain } from "@/hooks/use-chain";
import { useDeployment } from "@/hooks/use-deployment";
import { getPeriod } from "@/hooks/use-finalization-period";
import { useNativeToken, useToNativeToken } from "@/hooks/use-native-token";
import { usePeriodText } from "@/hooks/use-period-text";
import { useTokenPrice } from "@/hooks/use-prices";
import { useReceiveAmount } from "@/hooks/use-receive-amount";
import { useRequiredCustomGasTokenBalance } from "@/hooks/use-required-custom-gas-token-balance";
import { useSelectedBridgeRoute } from "@/hooks/use-selected-bridge-route";
import { useSelectedToken } from "@/hooks/use-selected-token";
import { useSwitchChain } from "@/hooks/use-switch-chain";
import { useApproxTotalBridgeTime } from "@/hooks/use-transfer-time";
import { useWeiAmount } from "@/hooks/use-wei-amount";
import { useIsWithdrawal } from "@/hooks/use-withdrawing";
import { useConfigState } from "@/state/config";
import { useSettingsState } from "@/state/settings";
import { Token } from "@/types/token";
import {
  isRouteQuote,
  isRouteReceiveStep,
  isRouteTransactionStep,
  isRouteWaitStep,
} from "@/utils/guards";
import { isNativeToken } from "@/utils/is-eth";
import { isArbitrum } from "@/utils/is-mainnet";

import { WaitIcon } from "./icons";

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
  chain?: ChainDto | undefined | null;
}) {
  if (!chain) {
    return (
      <div className="flex gap-4 px-3 py-2 rounded-lg justify-start items-center">
        <div className="flex items-center gap-2">
          <IconTime className="w-8 h-8" />
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
      <div className={clsx("flex gap-2", fee ? "items-start" : "items-center")}>
        <NetworkIcon chain={chain} className="w-8 h-8" />
        <div className="flex flex-col gap-1">
          <span className="text-sm font-heading leading-none">{text}</span>
          {fee && (
            <div className="flex gap-1">
              <IconSimpleGas className="w-3.5 h-auto fill-muted-foreground opacity-80" />
              <span className="text-xs text-muted-foreground leading-none">
                <p className="text-xs">{fee}</p>
              </span>
            </div>
          )}
        </div>
      </div>

      {button}
    </div>
  );
}

export const ConfirmationModalStartTab = () => {
  const bridge = useBridge();
  const allowance = useAllowance();
  const approve = useApprove();
  const { t } = useTranslation();

  const currency = useSettingsState.useCurrency();
  const stateToken = useConfigState.useToken();
  const withdrawing = useIsWithdrawal();
  const escapeHatch = useConfigState.useForceViaL1();
  const rawAmount = useConfigState.useRawAmount();

  const from = useFromChain();
  const to = useToChain();
  const weiAmount = useWeiAmount();
  const account = useAccount();
  const receive = useReceiveAmount();
  const token = useSelectedToken();
  const gasToken = useGasToken();
  const route = useSelectedBridgeRoute();

  const onSubmitBridge = useSubmitBridge();

  const gasTokenAllowance = useAllowanceGasToken();
  const deployment = useDeployment();
  const approveGasToken = useApproveGasToken(
    gasTokenAllowance.refetch,
    bridge.refetch
  );

  const totalBridgeTime = useApproxTotalBridgeTime().data;

  const fromFeeData = useEstimateFeesPerGas({ chainId: from?.id });
  const toFeeData = useEstimateFeesPerGas({ chainId: to?.id });

  const fromNativeToken = useNativeToken();
  const toNativeToken = useToNativeToken();
  const switchChain = useSwitchChain();

  const transformPeriodText = usePeriodText();

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

  const approveCost = {
    gasToken: fromGas,
    gasLimit: BigInt(50_000),
  };
  const approveGasTokenCost = {
    gasToken: fromGas,
    gasLimit: BigInt(50_000),
  };

  const getGasCost = (chainId: string, gasLimit: number) => {
    const gasToken = parseInt(chainId) === from?.id ? fromGas : toGas;
    return { gasToken, gasLimit: BigInt(gasLimit) };
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
      buttonText: t("bridging"),
      disabled: true,
    }))
    .with({ needsApprove: true }, (d) => ({
      onSubmit: () => {},
      buttonText: t("confirmationModal.initiateBridge"),
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
      buttonText: t("confirmationModal.initiateBridge"),
      disabled: false,
    }));

  const isAcross = route.data?.id === RouteProvider.Across;
  const isCctp = route.data?.id === RouteProvider.Cctp;

  const common = {
    from: from?.name,
    to: to?.name,
    base: deployment?.l1.name,
    rollup: deployment?.l2.name,
    symbol: token?.symbol,
    receiveAmount: receive.data?.token.amount,
    receiveSymbol: stateToken?.[to?.id ?? 0]?.symbol,
    formatted: receive.data?.token.formatted,
  };

  const title = match({
    isAcross,
    isCctp,
    withdrawing,
    escapeHatch,
    family: deployment?.family,
  })
    .with({ isAcross: true }, () => {
      return "Superfast bridge";
    })
    .with({ isCctp: true, withdrawing: true, escapeHatch: true }, () =>
      t("confirmationModal.cctpWithdrawalTitleEscapeHatch", {
        mins: totalBridgeTime?.value,
        symbol: token?.symbol,
      })
    )
    .with({ isCctp: true, withdrawing: true }, () =>
      t("confirmationModal.cctpWithdrawalTitle", {
        mins: totalBridgeTime?.value,
        symbol: token?.symbol,
      })
    )
    .with({ isCctp: true, withdrawing: false }, () =>
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
    isAcross,
    isCctp,
    withdrawing,
    escapeHatch,
    family: deployment?.family,
    isEth: isNativeToken(stateToken),
  })
    .with({ isAcross: true }, () =>
      t("confirmationModal.acrossDescription", common)
    )
    .with({ isCctp: true, withdrawing: true, escapeHatch: true }, () =>
      t("confirmationModal.cctpDescriptionEscapeHatch", common)
    )
    .with({ isCctp: true }, () =>
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

  const lineItems =
    route.data?.result && isRouteQuote(route.data.result)
      ? route.data.result.steps.map((x) => {
          if (isRouteTransactionStep(x)) {
            const text =
              x.type === RouteStepType.Initiate
                ? "Initiate bridge"
                : x.type === RouteStepType.Prove
                ? "Prove"
                : x.type === RouteStepType.Finalize
                ? "Claim"
                : x.type === RouteStepType.Mint
                ? "Claim"
                : "";

            return {
              text: text,
              fee: fee(getGasCost(x.chainId, x.estimatedGasLimit), 4),
              chain: x.chainId === from?.id.toString() ? from : to,
              initiate: x.type === RouteStepType.Initiate,
            };
          }

          if (isRouteWaitStep(x)) {
            return {
              text: transformPeriodText(
                "confirmationModal.wait",
                {},
                getPeriod(x.duration / 1000)
              ),
              icon: WaitIcon,
            };
          }

          if (isRouteReceiveStep(x)) {
            return {
              text: t("confirmationModal.receiveAmount", common),
              chain: to,
            };
          }
        })
      : [];

  return (
    <div>
      <DialogHeader className="items-center">
        <DialogTitle className="text-3xl">
          <TokenIcon token={token} className="h-8 w-8" />
          Bridge {rawAmount} {token?.symbol}
        </DialogTitle>
        <DialogDescription>
          <NetworkIcon chain={from} />
          <NetworkIcon chain={to} />
          via
          <RouteProviderIcon provider={route.data?.id ?? null} />
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col p-6 pt-0 gap-1">
        {isAcross && (
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

        {approveGasTokenButton && from && (
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
                  size="xs"
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

        {approveButton && from && (
          <>
            <LineItem
              text={t("confirmationModal.approve", { symbol: token?.symbol })}
              chain={from}
              fee={fee(approveCost, 4)}
              button={
                <Button
                  onClick={approveButton.onSubmit}
                  disabled={approveButton.disabled}
                  size="xs"
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

        {lineItems.filter(isPresent).map(({ text, fee, chain, initiate }) => (
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
      {isSuperbridge && !isAcross && (withdrawing || isCctp) && (
        <DialogFooter>
          <Link
            className={`mt-2 leading-3 text-center text-xs   cursor-pointer transition-all opacity-70 hover:opacity-100`}
            href="/alternative-bridges"
            target="_blank"
          >
            {t("confirmationModal.viewAlternateBridges")}
          </Link>
        </DialogFooter>
      )}
    </div>
  );
};
