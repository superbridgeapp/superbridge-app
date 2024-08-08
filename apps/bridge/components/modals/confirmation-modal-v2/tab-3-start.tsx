import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { isPresent } from "ts-is-present";
import { match } from "ts-pattern";
import { formatUnits } from "viem";
import { useAccount, useEstimateFeesPerGas } from "wagmi";

import {
  ChainNativeCurrencyDto,
  DeploymentFamily,
  RouteProvider,
  RouteStepType,
} from "@/codegen/model";
import { IconCheckCircle } from "@/components/icons";
import { NetworkIcon } from "@/components/network-icon";
import { RouteProviderName } from "@/components/route-provider-icon";
import { TokenIcon } from "@/components/token-icon";
import { FinaliseButton, ProveButton } from "@/components/transaction-buttons";
import { LineItem } from "@/components/transaction-line-item";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { currencySymbolMap } from "@/constants/currency-symbol-map";
import { useLatestSubmittedTx } from "@/hooks/activity/use-tx-by-hash";
import { useIsSuperbridge } from "@/hooks/apps/use-is-superbridge";
import { useBridge } from "@/hooks/bridge/use-bridge";
import { useSubmitBridge } from "@/hooks/bridge/use-submit-bridge";
import { useCustomGasTokenAddress } from "@/hooks/custom-gas-token/use-custom-gas-token-address";
import { useDeployment } from "@/hooks/deployments/use-deployment";
import { useSelectedBridgeRoute } from "@/hooks/routes/use-selected-bridge-route";
import {
  useDestinationToken,
  useSelectedToken,
} from "@/hooks/tokens/use-token";
import { useAllowance } from "@/hooks/use-allowance";
import { useAllowanceGasToken } from "@/hooks/use-allowance-gas-token";
import { useApprove } from "@/hooks/use-approve";
import { useApproveGasToken } from "@/hooks/use-approve-gas-token";
import { useFromChain, useToChain } from "@/hooks/use-chain";
import { useNativeToken, useToNativeToken } from "@/hooks/use-native-token";
import { useTokenPrice } from "@/hooks/use-prices";
import { useReceiveAmount } from "@/hooks/use-receive-amount";
import { useRequiredCustomGasTokenBalance } from "@/hooks/use-required-custom-gas-token-balance";
import { useSwitchChain } from "@/hooks/use-switch-chain";
import { useWeiAmount } from "@/hooks/use-wei-amount";
import { useIsWithdrawal } from "@/hooks/use-withdrawing";
import { useConfigState } from "@/state/config";
import { useSettingsState } from "@/state/settings";
import { isArbitrum } from "@/utils/deployments/is-mainnet";
import {
  isRouteQuote,
  isRouteReceiveStep,
  isRouteTransactionStep,
  isRouteWaitStep,
} from "@/utils/guards";
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
  const isSuperbridge = useIsSuperbridge();

  const currency = useSettingsState.useCurrency();
  const fromToken = useSelectedToken();
  const toToken = useDestinationToken();
  const withdrawing = useIsWithdrawal();
  const escapeHatch = useConfigState.useForceViaL1();
  const rawAmount = useConfigState.useRawAmount();

  const from = useFromChain();
  const to = useToChain();
  const weiAmount = useWeiAmount();
  const account = useAccount();
  const receive = useReceiveAmount();
  const token = useSelectedToken();
  const deployment = useDeployment();
  const customGasToken = useCustomGasTokenAddress(deployment?.id);
  const route = useSelectedBridgeRoute();

  const onSubmitBridge = useSubmitBridge();

  const [useSubmittedHash, setUseSubmittedHash] = useState(false);

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
        token: ChainNativeCurrencyDto | undefined;
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
    if (
      typeof gasTokenAllowance.data === "undefined" ||
      !deployment ||
      !requiredCustomGasTokenBalance
    ) {
      return false;
    }

    return gasTokenAllowance.data >= requiredCustomGasTokenBalance;
  })();

  const approveGasTokenButton = match({
    withdrawing,
    customGasToken,
    family: deployment?.family,
    approved: approvedGasToken,
    approving: approveGasToken.isLoading,
  })
    .with({ withdrawing: true }, () => null)
    .with({ customGasToken: null }, () => null)
    .with({ family: undefined }, () => null)
    .with({ family: DeploymentFamily.optimism }, () => null)
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
    isNativeToken: isEth(token),
    isDepositingCustomGasToken:
      deployment?.family === DeploymentFamily.arbitrum &&
      !!deployment?.arbitrumNativeToken &&
      !!token &&
      deployment.arbitrumNativeToken.address.toLowerCase() ===
        token.address.toLowerCase(),
  })
    .with({ isDepositingCustomGasToken: true }, () => null)
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
    needsApprove: !isEth(fromToken) && !approved,
    needsGasTokenApprove: (() => {
      return (
        !!deployment &&
        isArbitrum(deployment) &&
        !withdrawing &&
        !!deployment.arbitrumNativeToken
      );
    })(),
    bridge,
    withdrawing,
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
    .otherwise(() => ({
      onSubmit: async () => {
        const hash = await onSubmitBridge();
        if (hash) {
          setUseSubmittedHash(true);
        }
      },
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
                  <FinaliseButton onClick={() => {}} disabled />
                ) : x.type === RouteStepType.Mint ? undefined : undefined;
              const a: TransactionStep = {
                label,
                fee: fee(getGasCost(x.chainId, x.estimatedGasLimit), 4),
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

  const lineItems = useSubmittedHash
    ? submittedLineItems
    : preSubmissionLineItems;

  return (
    <div>
      <DialogHeader className="items-center">
        <TokenIcon token={token} className="h-14 w-14 mb-2" />
        <DialogTitle className="text-3xl text-center">
          Bridge {rawAmount} {token?.symbol}
        </DialogTitle>
        <DialogDescription>
          <div className="flex gap-1 items-center rounded-full border pl-1.5 pr-2 py-1">
            <div className="flex">
              <NetworkIcon chain={from} className="w-4 h-4" />
              <NetworkIcon chain={to} className="w-4 h-4 -ml-1" />
            </div>
            <span className="text-xs text-muted-foreground">
              via <RouteProviderName provider={route.data?.id ?? null} />
            </span>
            {/* <RouteProviderIcon provider={route.data?.id ?? null} /> */}
          </div>
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col p-6 pt-0 gap-1">
        {approveGasTokenButton && from && (
          <>
            <LineItem
              step={{
                label: t("confirmationModal.approveGasToken", {
                  symbol: token?.symbol,
                }),
                chain: from,
                fee: approvedGasToken ? undefined : fee(approveGasTokenCost, 4),
                buttonComponent: (
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
                  symbol: token?.symbol,
                }),
                chain: from,
                fee: approved ? undefined : fee(approveCost, 4),
                buttonComponent: approved ? (
                  <IconCheckCircle className="w-6 h-6 fill-muted-foreground" />
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
