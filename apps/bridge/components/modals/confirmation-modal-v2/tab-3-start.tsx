import Link from "next/link";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { isPresent } from "ts-is-present";
import { match } from "ts-pattern";
import { formatUnits } from "viem";
import { useAccount, useEstimateFeesPerGas } from "wagmi";

import { ChainNativeCurrencyDto, RouteStepType } from "@/codegen/model";
import { BridgeInfo } from "@/components/bridge-info";
import { IconCheck, IconCheckCircle, IconHelp } from "@/components/icons";
import { RouteProviderName } from "@/components/route-provider-icon";
import { TokenIcon } from "@/components/token-icon";
import { ClaimButton, ProveButton } from "@/components/transaction-buttons";
import { LineItem } from "@/components/transaction-line-item";
import { Button } from "@/components/ui/button";
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { currencySymbolMap } from "@/constants/currency-symbol-map";
import { useLatestSubmittedTx } from "@/hooks/activity/use-tx-by-hash";
import { useBridge } from "@/hooks/bridge/use-bridge";
import { useSubmitBridge } from "@/hooks/bridge/use-submit-bridge";
import { useCustomGasTokenAddress } from "@/hooks/custom-gas-token/use-custom-gas-token-address";
import { useDeployment } from "@/hooks/deployments/use-deployment";
import { useHelpCenterLinkByProvider } from "@/hooks/help/use-help-center-link";
import { useSelectedBridgeRoute } from "@/hooks/routes/use-selected-bridge-route";
import {
  useNativeToken,
  useToNativeToken,
} from "@/hooks/tokens/use-native-token";
import {
  useDestinationToken,
  useMultichainToken,
  useSelectedToken,
} from "@/hooks/tokens/use-token";
import { useAllowance } from "@/hooks/use-allowance";
import { useAllowanceGasToken } from "@/hooks/use-allowance-gas-token";
import { useApprove } from "@/hooks/use-approve";
import { useApproveGasToken } from "@/hooks/use-approve-gas-token";
import { useFromChain, useToChain } from "@/hooks/use-chain";
import { useModal } from "@/hooks/use-modal";
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
  const token = useMultichainToken();
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

  const recipientAddress = useConfigState.useRecipientAddress();

  const gasInfoModal = useModal("GasInfo");
  const feeBreakdownModal = useModal("FeeBreakdown");

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
      buttonText: t("buttons.approving"),
      disabled: true,
    }))
    .with({ approved: false }, () => ({
      onSubmit: async () => {
        if (account.chainId !== from?.id) {
          await switchChain(from!);
        }

        approveGasToken.write();
      },
      buttonText: t("buttons.approve"),
      disabled: false,
    }))
    .with({ approved: true }, () => ({
      onSubmit: () => {},
      buttonText: t("buttons.approved"),
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
      buttonText: t("buttons.approving"),
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
        buttonText: t("buttons.approve"),
        disabled: false,
      };
    })
    .with({ approved: true }, () => ({
      onSubmit: () => {},
      buttonText: t("buttons.approved"),
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
        buttonText: t("buttons.start"),
        disabled: true,
      })
    )
    .otherwise(() => ({
      onSubmit: onSubmitBridge,
      buttonText: t("buttons.start"),
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
            const receiveAmount = {
              raw: receive.data?.token.amount.toString() ?? "0",
              formatted: receive.data?.token.formatted ?? "",
              text: receive.data?.token.formatted ?? "",
            };

            if (isRouteTransactionStep(x)) {
              const label =
                x.type === RouteStepType.Initiate
                  ? t("confirmationModal.startBridgeOn", { from: from?.name })
                  : x.type === RouteStepType.Prove
                  ? t("confirmationModal.proveOn", { to: to?.name })
                  : t("confirmationModal.getOn", { to: to?.name });
              const amount: TransactionStep["amount"] =
                x.type === RouteStepType.Initiate
                  ? {
                      raw: weiAmount.toString(),
                      formatted: formatUnits(
                        weiAmount,
                        fromToken?.decimals ?? 18
                      ),
                      text: `${formatUnits(
                        weiAmount,
                        fromToken?.decimals ?? 18
                      )} ${fromToken?.symbol}`,
                    }
                  : x.type === RouteStepType.Prove
                  ? undefined
                  : receiveAmount;
              const gasLimit =
                x.type === RouteStepType.Initiate
                  ? x.estimatedGasLimit
                  : 500_000;

              const buttonComponent =
                x.type === RouteStepType.Initiate ? (
                  <Button
                    onClick={initiateButton.onSubmit}
                    disabled={initiateButton.disabled}
                    size={"sm"}
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
                gasLimit,
                chain: x.chainId === from?.id.toString() ? from! : to!,
                buttonComponent,
                hash: undefined,
                pendingHash: undefined,
                token: x.type === RouteStepType.Prove ? null : token,
                amount,
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
                label: t("confirmationModal.getOn", common),
                chain: to!,
                hash: undefined,
                pendingHash: undefined,
                token,
                amount: receiveAmount,
              };
              return step;
            }
          })
          .filter(isPresent)
      : [];

  const lineItems = submittedHash ? submittedLineItems : preSubmissionLineItems;

  const helpCenterLink = useHelpCenterLinkByProvider(route.data?.id ?? null);
  return (
    <Tabs defaultValue="steps" className="flex flex-col">
      {/* <DialogHeader className="items-center py-3">
        <DialogTitle className="text-3xl text-center leading-none">
          <span className="text-base text-muted-foreground">
            Bridge via <br />
          </span>
          <RouteProviderName provider={route.data?.id ?? null} />
        </DialogTitle>
      </DialogHeader> */}
      <DialogHeader className="items-center gap-3 pt-3 pb-4">
        <TokenIcon token={token?.[from?.id ?? 0]} className="h-12 w-12" />
        <DialogTitle className="flex flex-col gap-1.5 text-3xl text-center leading-none">
          Bridge {rawAmount} {token?.[from?.id ?? 0]?.symbol} <br />
          <span className="text-sm text-muted-foreground leading-none">
            Via <RouteProviderName provider={route.data?.id ?? null} />
          </span>
        </DialogTitle>
      </DialogHeader>
      <div className="mx-auto">
        <TabsList>
          <TabsTrigger className="text-xs" value="steps">
            {t("transaction.steps")}
          </TabsTrigger>
          <TabsTrigger className="text-xs" value="info">
            {t("transaction.bridgeInfo")}
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="steps">
        <div className="flex flex-col px-6 gap-1">
          {approveGasTokenButton && from && (
            <>
              <LineItem
                step={{
                  label: t("confirmationModal.approveGasToken", {
                    symbol: fromToken?.symbol,
                  }),
                  chain: from,
                  gasLimit: approveGasTokenCost.gasLimit,
                  buttonComponent: approvedGasToken ? (
                    <IconCheckCircle className="w-6 h-6 fill-primary" />
                  ) : (
                    <Button
                      onClick={approveGasTokenButton.onSubmit}
                      disabled={approveGasTokenButton.disabled}
                      size="sm"
                    >
                      {approveGasTokenButton.buttonText}
                      {approvedGasToken && (
                        <IconCheck className="w-3 h-3 fill-primary-foreground" />
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
                  gasLimit: approveCost.gasLimit,
                  buttonComponent: approved ? (
                    <IconCheckCircle className="w-6 h-6 fill-primary" />
                  ) : (
                    <Button
                      onClick={approveButton.onSubmit}
                      disabled={approveButton.disabled}
                      size="sm"
                    >
                      {approveButton.buttonText}
                      {approved && (
                        <IconCheck className="w-3 h-3 fill-primary-foreground" />
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
      </TabsContent>

      <TabsContent value="info">
        <BridgeInfo
          from={from}
          to={to}
          sentAmount={rawAmount}
          receivedAmount={receive.data?.token.amount.toString() ?? null}
          token={token}
          provider={route.data?.id ?? null}
          sender={account.address ?? "0x"}
          recipient={recipientAddress}
          transferTime="10 mins"
        />
      </TabsContent>

      <DialogFooter className="flex gap-2 items-center">
        {/* {providerExplorerLink && (
          <Button asChild size={"xs"} variant={"secondary"}>
            <Link
              href={providerExplorerLink}
              target="_blank"
              // className="text-xs font-button text-center hover:underline flex gap-1 items-center"
            >
              <span>View on {provider} explorer</span>
              <IconArrowUpRight className="w-2.5 h-2.5 ml-1.5 fill-foreground group-hover:fill-foreground" />
            </Link>
          </Button> 
        )}*/}

        {helpCenterLink && (
          <Button asChild size={"xs"} variant={"outline"}>
            <Link
              href={helpCenterLink}
              target="_blank"
              // className="text-xs font-button text-center hover:underline"
            >
              {t("general.needHelp")}
              <IconHelp className="w-2.5 h-2.5 ml-1.5 fill-foreground group-hover:fill-foreground" />
            </Link>
          </Button>
        )}
      </DialogFooter>
    </Tabs>
  );
};
