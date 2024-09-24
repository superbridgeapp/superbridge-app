import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { isPresent } from "ts-is-present";
import { match } from "ts-pattern";
import { formatUnits } from "viem";
import { useAccount, useEstimateFeesPerGas } from "wagmi";

import { ChainNativeCurrencyDto, RouteStepType } from "@/codegen/model";
import { IconCheckCircle } from "@/components/icons";
import { NetworkIcon } from "@/components/network-icon";
import { RouteProviderName } from "@/components/route-provider-icon";
import { TokenIcon } from "@/components/token-icon";
import { ClaimButton, ProveButton } from "@/components/transaction-buttons";
import { LineItem } from "@/components/transaction-line-item";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { currencySymbolMap } from "@/constants/currency-symbol-map";
import { useLatestSubmittedTx } from "@/hooks/activity/use-tx-by-hash";
import { useBridge } from "@/hooks/bridge/use-bridge";
import { useSubmitBridge } from "@/hooks/bridge/use-submit-bridge";
import { useCustomGasTokenAddress } from "@/hooks/custom-gas-token/use-custom-gas-token-address";
import { useDeployment } from "@/hooks/deployments/use-deployment";
import { useSelectedBridgeRoute } from "@/hooks/routes/use-selected-bridge-route";
import {
  useNativeToken,
  useToNativeToken,
} from "@/hooks/tokens/use-native-token";
import {
  useDestinationToken,
  useSelectedToken,
} from "@/hooks/tokens/use-token";
import { useAllowance } from "@/hooks/use-allowance";
import { useAllowanceGasToken } from "@/hooks/use-allowance-gas-token";
import { useApprove } from "@/hooks/use-approve";
import { useApproveGasToken } from "@/hooks/use-approve-gas-token";
import { useFromChain, useToChain } from "@/hooks/use-chain";
import { useTokenPrice } from "@/hooks/use-prices";
import { useReceiveAmount } from "@/hooks/use-receive-amount";
import { useRequiredCustomGasTokenBalance } from "@/hooks/use-required-custom-gas-token-balance";
import { useSwitchChain } from "@/hooks/use-switch-chain";
import { useWeiAmount } from "@/hooks/use-wei-amount";
import { useIsArbitrumDeposit, useIsWithdrawal } from "@/hooks/use-withdrawing";
import { useConfigState } from "@/state/config";
import { useSettingsState } from "@/state/settings";
import { formatDecimals } from "@/utils/format-decimals";
import {
  isRouteQuote,
  isRouteReceiveStep,
  isRouteTransactionStep,
  isRouteWaitStep,
} from "@/utils/guards";
import { scaleToNativeTokenDecimals } from "@/utils/native-token-scaling";
import { useProgressRows } from "@/utils/progress-rows";
import {
  ActivityStep,
  TransactionStep,
  WaitStepNotStarted,
  isWaitStep,
} from "@/utils/progress-rows/common";
import { isEth } from "@/utils/tokens/is-eth";

export const ConfirmationModalStartTab = () => {
  const bridge = useBridge();
  const allowance = useAllowance();
  const approve = useApprove();
  const { t } = useTranslation();

  const currency = useSettingsState.useCurrency();
  const open = useConfigState.useDisplayConfirmationModal();
  const fromToken = useSelectedToken();
  const toToken = useDestinationToken();
  const withdrawing = useIsWithdrawal();
  const escapeHatch = useConfigState.useForceViaL1();
  const rawAmount = useConfigState.useRawAmount();
  const submitting = useConfigState.useSubmittingBridge();
  const submittedHash = useConfigState.useSubmittedHash();
  const setSubmittedHash = useConfigState.useSetSubmittedHash();

  const from = useFromChain();
  const to = useToChain();
  const weiAmount = useWeiAmount();
  const account = useAccount();
  const receive = useReceiveAmount();
  const deployment = useDeployment();
  const customGasToken = useCustomGasTokenAddress(deployment?.id);
  const route = useSelectedBridgeRoute();
  const isArbitrumDeposit = useIsArbitrumDeposit();

  const onSubmitBridge = useSubmitBridge();

  const gasTokenAllowance = useAllowanceGasToken();
  const approveGasToken = useApproveGasToken(
    gasTokenAllowance.refetch,
    bridge.refetch
  );

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
    token: fromNativeToken,
    price: fromNativeTokenPrice,
    gasPrice: fromGasPrice,
  };
  const toGas = {
    token: toNativeToken,
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

  useEffect(() => {
    setSubmittedHash(null);
  }, [open]);

  const getGasCost = (chainId: string, gasLimit: number) => {
    const gasToken = parseInt(chainId) === from?.id ? fromGas : toGas;
    return { gasToken, gasLimit: BigInt(gasLimit) };
  };

  const fee = ({
    gasLimit,
    gasToken,
  }: {
    gasToken: {
      token: ChainNativeCurrencyDto | undefined;
      price: number | null;
      gasPrice: bigint;
    };
    gasLimit: bigint;
  }) => {
    const formattedAmount = parseFloat(
      formatUnits(
        scaleToNativeTokenDecimals({
          amount: gasLimit * gasToken.gasPrice,
          decimals: gasToken.token?.decimals ?? 18,
        }),
        gasToken.token?.decimals ?? 18
      )
    );

    if (!gasToken.price) {
      return `${formatDecimals(formattedAmount)} ${gasToken.token?.symbol}`;
    }

    return `${currencySymbolMap[currency]}${formatDecimals(
      gasToken.price * formattedAmount
    )}`;
  };

  const approved = (() => {
    if (submittedHash) {
      return true;
    }
    return typeof allowance.data !== "undefined" && allowance.data >= weiAmount;
  })();

  const requiredCustomGasTokenBalance = useRequiredCustomGasTokenBalance();
  const approvedGasToken = (() => {
    if (submittedHash) {
      return true;
    }

    if (
      typeof gasTokenAllowance.data === "undefined" ||
      !deployment ||
      !requiredCustomGasTokenBalance
    ) {
      return false;
    }

    return gasTokenAllowance.data >= requiredCustomGasTokenBalance;
  })();

  const needsApprove = (() => {
    if (isEth(fromToken)) return false;
    if (
      isArbitrumDeposit &&
      deployment?.arbitrumNativeToken &&
      isEth(toToken)
    ) {
      // gets handled by gasTokenApproval
      return false;
    }
    if (
      fromToken?.address &&
      fromToken.lz?.adapter &&
      fromToken?.address === fromToken.lz?.adapter
    ) {
      return false;
    }
    if (
      fromToken?.address &&
      fromToken.hyperlane?.router &&
      fromToken?.address === fromToken.hyperlane?.router
    ) {
      return false;
    }

    return true;
  })();
  const needsGasTokenApprove = (() => {
    return isArbitrumDeposit && !!deployment?.arbitrumNativeToken;
  })();

  const approveGasTokenButton = match({
    withdrawing,
    customGasToken,
    family: deployment?.family,
    approved: approvedGasToken,
    approving: approveGasToken.isLoading,
    needsGasTokenApprove,
  })
    .with({ needsGasTokenApprove: false }, () => null)
    .with({ approving: true }, () => ({
      onSubmit: () => {},
      buttonText: "Approving",
      disabled: true,
    }))
    .with({ approved: false }, () => ({
      onSubmit: async () => {
        if (account.chainId !== from?.id) {
          await switchChain(from!);
        }

        approveGasToken.write();
      },
      buttonText: "Approve",
      disabled: false,
    }))
    .with({ approved: true }, () => ({
      onSubmit: () => {},
      buttonText: "Approved",
      disabled: true,
    }))
    .exhaustive();

  const approveButton = match({
    approved,
    approving: approve.isLoading,
    bridge,
    withdrawing,
    needsApprove,
  })
    .with({ needsApprove: false }, () => null)
    .with({ approving: true }, () => ({
      onSubmit: () => {},
      buttonText: "Approving",
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
        buttonText: "Approve",
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
    needsApprove,
    approved,
    needsGasTokenApprove,
    approvedGasToken,
    withdrawing,
    submitting,
  })
    .with({ submitting: true }, () => ({
      onSubmit: () => {},
      buttonText: t("bridging"),
      disabled: true,
    }))
    .with(
      { needsApprove: true, approved: false },
      { needsGasTokenApprove: true, approvedGasToken: false },
      () => ({
        onSubmit: () => {},
        buttonText: t("confirmationModal.initiateBridge"),
        disabled: true,
      })
    )
    .otherwise(() => ({
      onSubmit: onSubmitBridge,
      buttonText: t("confirmationModal.initiateBridge"),
      disabled: false,
    }));

  const common = {
    from: from?.name,
    to: to?.name,
    base: deployment?.l1.name,
    rollup: deployment?.l2.name,
    symbol: fromToken?.symbol,
    receiveAmount: receive.data?.token.amount,
    receiveSymbol: toToken?.symbol,
    formatted: toToken?.symbol,
  };

  const lastSubmittedTx = useLatestSubmittedTx();
  const submittedLineItems = useProgressRows(lastSubmittedTx) || [];

  const preSubmissionLineItems: ActivityStep[] =
    route.data?.result && isRouteQuote(route.data.result)
      ? route.data.result.steps
          .map((x) => {
            if (isRouteTransactionStep(x)) {
              const label =
                x.type === RouteStepType.Initiate
                  ? "Start bridge"
                  : x.type === RouteStepType.Prove
                    ? "Prove"
                    : x.type === RouteStepType.Finalize
                      ? "Claim"
                      : x.type === RouteStepType.Mint
                        ? "Claim"
                        : "";
              const buttonComponent =
                x.type === RouteStepType.Initiate ? (
                  <Button
                    onClick={initiateButton.onSubmit}
                    disabled={initiateButton.disabled}
                    size={"xs"}
                  >
                    {initiateButton.buttonText}
                  </Button>
                ) : x.type === RouteStepType.Prove ? (
                  <ProveButton onClick={() => {}} disabled />
                ) : x.type === RouteStepType.Finalize ? (
                  <ClaimButton onClick={() => {}} disabled />
                ) : x.type === RouteStepType.Mint ? (
                  <ClaimButton onClick={() => {}} disabled />
                ) : undefined;
              const a: TransactionStep = {
                label,
                fee: fee(getGasCost(x.chainId, x.estimatedGasLimit)),
                chain: x.chainId === from?.id.toString() ? from! : to!,
                buttonComponent,
                hash: undefined,
                pendingHash: undefined,
              };
              return a;
            }

            if (isRouteWaitStep(x)) {
              const step: WaitStepNotStarted = {
                duration: x.duration,
              };
              return step;
            }

            if (isRouteReceiveStep(x)) {
              const step: TransactionStep = {
                label: t("confirmationModal.receiveAmount", common),
                chain: to!,
                fee: undefined,
                hash: undefined,
                pendingHash: undefined,
              };
              return step;
            }
          })
          .filter(isPresent)
      : [];

  const lineItems = submittedHash ? submittedLineItems : preSubmissionLineItems;

  return (
    <div>
      <DialogHeader className="items-center">
        <TokenIcon token={fromToken} className="h-14 w-14 mb-2" />
        <DialogTitle className="text-3xl text-center">
          Bridge {rawAmount} {fromToken?.symbol}
        </DialogTitle>
        <DialogDescription>
          <div className="flex gap-1 items-center rounded-sm border pl-1 pr-2 py-1">
            <div className="flex">
              <NetworkIcon chain={from} className="w-4 h-4 rounded-2xs" />
              <NetworkIcon chain={to} className="w-4 h-4 rounded-2xs -ml-1" />
            </div>
            <span className="text-xs text-muted-foreground">
              via <RouteProviderName provider={route.data?.id ?? null} />
            </span>
          </div>
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col p-6 pt-0 gap-1">
        {approveGasTokenButton && from && (
          <>
            <LineItem
              step={{
                label: t("confirmationModal.approveGasToken", {
                  symbol: fromToken?.symbol,
                }),
                chain: from,
                fee: approvedGasToken ? undefined : fee(approveGasTokenCost),
                buttonComponent: approvedGasToken ? (
                  <IconCheckCircle className="w-6 h-6 fill-primary" />
                ) : (
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
                ),
                pendingHash: undefined,
                hash: undefined,
              }}
            />
          </>
        )}

        {approveButton && from && (
          <>
            <LineItem
              step={{
                label: t("confirmationModal.approve", {
                  symbol: fromToken?.symbol,
                }),
                chain: from,
                fee: approved ? undefined : fee(approveCost),
                buttonComponent: approved ? (
                  <IconCheckCircle className="w-6 h-6 fill-primary" />
                ) : (
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
                ),
                pendingHash: undefined,
                hash: undefined,
              }}
            />
          </>
        )}

        {lineItems.filter(isPresent).map((step) => (
          <LineItem
            key={isWaitStep(step) ? step.duration.toString() : step.label}
            step={step}
            tx={lastSubmittedTx}
          />
        ))}
      </div>
    </div>
  );
};
