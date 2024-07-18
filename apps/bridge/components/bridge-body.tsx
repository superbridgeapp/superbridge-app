import { useConnectModal } from "@rainbow-me/rainbowkit";
import { waitForTransactionReceipt } from "@wagmi/core";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { match } from "ts-pattern";
import { formatUnits, parseUnits } from "viem";
import { useAccount, useBalance, useConfig, useWalletClient } from "wagmi";

import { useBridgeControllerTrack } from "@/codegen";
import { isSuperbridge } from "@/config/superbridge";
import { SUPERCHAIN_MAINNETS } from "@/constants/superbridge";
import { useAcrossDomains } from "@/hooks/across/use-across-domains";
import { useAcrossPaused } from "@/hooks/across/use-across-paused";
import { useBridgeMax } from "@/hooks/limits/use-bridge-max";
import { useBridgeMin } from "@/hooks/limits/use-bridge-min";
import { useAllowance } from "@/hooks/use-allowance";
import { useApprove } from "@/hooks/use-approve";
import { useTokenBalance } from "@/hooks/use-balances";
import { useBaseNativeTokenBalance } from "@/hooks/use-base-native-token-balance";
import { useBridge } from "@/hooks/use-bridge";
import { useBridgeV2 } from "@/hooks/use-bridge-v2";
import { useFromChain, useToChain } from "@/hooks/use-chain";
import { useDeployment } from "@/hooks/use-deployment";
import { useFaultProofUpgradeTime } from "@/hooks/use-fault-proof-upgrade-time";
import { useNativeToken } from "@/hooks/use-native-token";
import { useNetworkFee } from "@/hooks/use-network-fee";
import { useTokenPrice } from "@/hooks/use-prices";
import { useReceiveAmount } from "@/hooks/use-receive-amount";
import { useRequiredCustomGasTokenBalance } from "@/hooks/use-required-custom-gas-token-balance";
import { useSelectedToken } from "@/hooks/use-selected-token";
import { useStatusCheck } from "@/hooks/use-status-check";
import { useSwitchChain } from "@/hooks/use-switch-chain";
import { useActiveTokens } from "@/hooks/use-tokens";
import { useWeiAmount } from "@/hooks/use-wei-amount";
import { useWithdrawalsPaused } from "@/hooks/use-withdrawals-paused";
import { trackEvent } from "@/services/ga";
import { useConfigState } from "@/state/config";
import { usePendingTransactions } from "@/state/pending-txs";
import { buildPendingTx } from "@/utils/build-pending-tx";
import { formatDecimals } from "@/utils/format-decimals";
import { isCctp } from "@/utils/is-cctp";
import { isEth, isNativeToken } from "@/utils/is-eth";

import { FromTo } from "./FromTo";
import {
  ExpensiveGasModal,
  useEstimateTotalFeesInFiat,
} from "./alerts/expensive-gas-modal";
import { FaultProofsModal } from "./alerts/fault-proofs-modal";
import { NoGasModal } from "./alerts/no-gas-modal";
import { ConfirmationModal } from "./confirmation-modal";
import { FastFromTo } from "./fast/FromTo";
import { FaultProofInfoModal } from "./fault-proof-info-modal";
import { LineItems } from "./line-items";
import { Modals } from "./modals";
import { NftImage } from "./nft";
import { TokenInput } from "./token-input";
import { TokenModal } from "./tokens/Modal";
import { CustomTokenImportModal } from "./tokens/custom-token-import-modal";
import { Button } from "./ui/button";
import { WithdrawalReadyToFinalizeModal } from "./withdrawal-ready-to-finalize-modal";

enum AlertModals {
  NoGas = "no-gas",
  GasExpensive = "gas-expensive",
  FaultProofs = "fault-proofs",
}

export const BridgeBody = () => {
  const { openConnectModal } = useConnectModal();
  const wallet = useWalletClient();
  const account = useAccount();
  const from = useFromChain();
  const to = useToChain();
  const bridge = useBridge();
  const switchChain = useSwitchChain();
  const tokens = useActiveTokens();
  const weiAmount = useWeiAmount();
  const token = useSelectedToken();
  const { t } = useTranslation();
  useBridgeV2();

  const deployment = useDeployment();
  const setConfirmationModal = useConfigState.useSetDisplayConfirmationModal();
  const withdrawing = useConfigState.useWithdrawing();
  const stateToken = useConfigState.useToken();
  const forceViaL1 = useConfigState.useForceViaL1();
  const tokensModal = useConfigState.useTokensModal();
  const rawAmount = useConfigState.useRawAmount();
  const setTokensModal = useConfigState.useSetTokensModal();
  const fast = useConfigState.useFast();
  const nft = useConfigState.useNft();
  const recipient = useConfigState.useRecipientAddress();
  const setToken = useConfigState.useSetToken();
  const addPendingTransaction = usePendingTransactions.useAddTransaction();
  const updatePendingTransactionHash =
    usePendingTransactions.useUpdateTransactionByHash();
  const nativeToken = useNativeToken();
  const statusCheck = useStatusCheck();
  const bridgeMax = useBridgeMax();
  const bridgeMin = useBridgeMin();
  const track = useBridgeControllerTrack();
  const faultProofUpgradeTime = useFaultProofUpgradeTime(deployment);
  const acrossPaused = useAcrossPaused();
  const withdrawalsPaused = useWithdrawalsPaused();

  const initiatingChain = forceViaL1 && withdrawing ? deployment?.l1 : from;
  const fromEthBalance = useBalance({
    address: account.address,
    chainId: initiatingChain?.id,
  });
  const toEthBalance = useBalance({
    address: account.address,
    chainId: to?.id,
  });
  const baseNativeTokenBalance = useBaseNativeTokenBalance();
  const tokenBalance = useTokenBalance(token);
  const wagmiConfig = useConfig();

  const acrossDomains = useAcrossDomains();
  const allowance = useAllowance(token, bridge.address);

  const networkFee = useNetworkFee();

  const approve = useApprove(
    token,
    bridge.address,
    allowance.refetch,
    bridge.refetch,
    weiAmount
  );
  const usdPrice = useTokenPrice(stateToken);

  const receive = useReceiveAmount();

  const hasInsufficientBalance = weiAmount > tokenBalance;
  const hasInsufficientGas = (() => {
    if (!networkFee) return false;

    let availableGasBalance = fromEthBalance.data?.value ?? BigInt(0);
    if (isEth(token)) {
      availableGasBalance = availableGasBalance - weiAmount;
    }

    return availableGasBalance < BigInt(parseUnits(networkFee.toFixed(18), 18));
  })();

  const totalFeesInFiat = useEstimateTotalFeesInFiat();
  const fiatValueBeingBridged =
    usdPrice && receive.data ? receive.data * usdPrice : null;

  const requiredCustomGasTokenBalance = useRequiredCustomGasTokenBalance();
  /**
   * Transferring native gas token to rollup, need to make sure wei + extraAmount is < balance
   * Transferring token to rollup, need to make sure extraAmount < balance
   */
  const hasInsufficientBaseNativeTokenBalance =
    !!requiredCustomGasTokenBalance &&
    typeof baseNativeTokenBalance.data !== "undefined" &&
    requiredCustomGasTokenBalance > baseNativeTokenBalance.data;

  const onWrite = async () => {
    if (
      !account.address ||
      !wallet.data ||
      !bridge.valid ||
      !bridge.args ||
      !recipient ||
      statusCheck ||
      !initiatingChain
    ) {
      return;
    }

    // should be caught before
    if (
      initiatingChain.id !== account.chainId ||
      initiatingChain.id !== wallet.data.chain.id
    ) {
      await switchChain(initiatingChain);
    }

    try {
      const hash = await bridge.write!();
      waitForTransactionReceipt(wagmiConfig, {
        hash,
        chainId: withdrawing
          ? forceViaL1
            ? deployment!.l1.id
            : deployment?.l2.id
          : deployment?.l1.id,
        onReplaced: ({ replacedTransaction, transaction }) => {
          updatePendingTransactionHash(
            replacedTransaction.hash,
            transaction.hash
          );
        },
      });

      trackEvent({
        event: "bridge",
        from: from?.name ?? "",
        to: to?.name ?? "",
        amount: parseFloat(rawAmount),
        token: token?.symbol ?? "",
        type: fast
          ? "across"
          : !!stateToken && isCctp(stateToken)
          ? "cctp"
          : withdrawing
          ? "withdraw"
          : "deposit",
        transactionHash: hash,
      });

      if (!fast && deployment) {
        track.mutate({
          data: {
            amount: weiAmount.toString(),
            deploymentId: deployment.id,
            transactionHash: hash,
            action: withdrawing
              ? forceViaL1
                ? "force-withdraw"
                : "withdraw"
              : "deposit",
          },
        });
      }

      const pending = buildPendingTx(
        deployment,
        account.address,
        recipient,
        weiAmount,
        stateToken,
        nft,
        withdrawing,
        hash,
        forceViaL1,
        fast,
        { from: from!, to: to! }
      );
      if (pending) addPendingTransaction(pending);

      if (nft) {
        setToken(tokens.find((x) => isNativeToken(x))!);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const initiateBridge = async () => {
    await onWrite();
    allowance.refetch();
    setConfirmationModal(false);
  };

  const [alerts, setAlerts] = useState<AlertModals[]>([]);

  const onDismissAlert = (id: AlertModals) => () => {
    setAlerts(alerts.filter((a) => a !== id));
    if (alerts.length === 1) {
      initiateBridge();
    }
  };

  const onSubmit = () => {
    const modals: AlertModals[] = [];

    const needDestinationGasConditions = [
      withdrawing, // need to prove/finalize
      isCctp(stateToken), // need to mint
      !withdrawing && !isEth(stateToken?.[to?.id ?? 0]), // depositing an ERC20 with no gas on the destination (won't be able to do anything with it)
    ];
    if (
      needDestinationGasConditions.some((x) => x) &&
      toEthBalance.data?.value === BigInt(0)
    ) {
      modals.push(AlertModals.NoGas);
    }

    if (
      totalFeesInFiat &&
      fiatValueBeingBridged &&
      totalFeesInFiat > fiatValueBeingBridged &&
      isSuperbridge &&
      SUPERCHAIN_MAINNETS.includes(deployment?.name ?? "")
    ) {
      modals.push(AlertModals.GasExpensive);
    }

    if (faultProofUpgradeTime && withdrawing) {
      modals.push(AlertModals.FaultProofs);
    }

    if (modals.length === 0) {
      initiateBridge();
    } else {
      setAlerts(modals);
    }
  };

  const onCancel = () => {
    setAlerts([]);
    setConfirmationModal(false);
  };

  const handleSubmitClick = () => {
    if (!nft && weiAmount === BigInt(0)) {
      return;
    }

    setConfirmationModal(true);
  };

  const submitButton = match({
    withdrawing,
    fast,
    acrossPaused,
    withdrawalsPaused,
    isSubmitting: bridge.isLoading,
    account: account.address,
    hasInsufficientBalance,
    hasInsufficientGas,
    hasInsufficientBaseNativeTokenBalance,
    nft,
    recipient,
    weiAmount,
    bridgeMax,
    bridgeMin,
    depositsDisabled: deployment?.name === "parallel" && !withdrawing,
  })
    .with({ depositsDisabled: true }, () => ({
      onSubmit: () => {},
      buttonText: "Deposits disabled",
      disabled: true,
    }))
    .with({ fast: true, acrossPaused: true }, () => ({
      onSubmit: () => {},
      buttonText: "Bridging paused",
      disabled: true,
    }))
    .with({ fast: false, withdrawing: true, withdrawalsPaused: true }, () => ({
      onSubmit: () => {},
      buttonText: "Withdrawals paused",
      disabled: true,
    }))
    .when(
      ({ bridgeMax, weiAmount }) => bridgeMax !== null && weiAmount > bridgeMax,
      ({ bridgeMax }) => ({
        onSubmit: () => {},
        buttonText: (() => {
          const formatted = formatUnits(bridgeMax!, token?.decimals ?? 18);
          return t("bridgeLimit", {
            amount: formatDecimals(parseFloat(formatted)),
            symbol: token?.symbol,
          });
        })(),
        disabled: true,
      })
    )
    .with({ account: undefined }, () => ({
      onSubmit: () => openConnectModal?.(),
      buttonText: t("connectWallet"),
      disabled: false,
    }))
    .with({ recipient: "" }, ({ withdrawing }) => ({
      onSubmit: () => {},
      buttonText: withdrawing ? t("withdraw") : t("deposit"),
      disabled: true,
    }))
    .with({ weiAmount: BigInt("0") }, () => ({
      onSubmit: () => {},
      buttonText: t("enterAnAmount"),
      disabled: true,
    }))
    .with({ hasInsufficientBalance: true }, () => ({
      onSubmit: () => {},
      buttonText: t("insufficientFunds"),
      disabled: true,
    }))
    .when(
      ({ bridgeMin, weiAmount }) => bridgeMin !== null && weiAmount < bridgeMin,
      ({}) => ({
        onSubmit: () => {},
        buttonText: (() => {
          const formatted = formatUnits(bridgeMin!, token!.decimals);
          return t("bridgeMin", {
            amount: formatDecimals(parseFloat(formatted)),
            symbol: token?.symbol,
          });
        })(),
        disabled: true,
      })
    )
    .with({ hasInsufficientGas: true }, (d) => ({
      onSubmit: handleSubmitClick,
      buttonText: t("insufficientGas", {
        symbol: nativeToken?.[from?.id ?? 0]?.symbol,
      }),
      // Let's not disable here because people could actually submit with
      // a lower gas price via their wallet. A little power-usery but important imo
      disabled: false,
    }))
    .with({ hasInsufficientBaseNativeTokenBalance: true }, (d) => ({
      onSubmit: handleSubmitClick,
      buttonText: t("insufficientGas", {
        symbol: deployment?.arbitrumNativeToken?.symbol,
      }),
      disabled: true,
    }))
    .with({ isSubmitting: true }, (d) => ({
      onSubmit: () => {},
      buttonText: d.withdrawing ? t("withdrawing") : t("depositing"),
      disabled: true,
    }))
    .otherwise((d) => ({
      onSubmit: handleSubmitClick,
      buttonText: d.nft
        ? d.withdrawing
          ? t("withdrawNft", { tokenId: `#${d.nft.tokenId}` })
          : t("depositNft", { tokenId: `#${d.nft.tokenId}` })
        : d.fast
        ? t("reviewBridge")
        : d.withdrawing
        ? t("withdraw")
        : t("deposit"),
      disabled: false,
    }));

  return (
    <div className="flex flex-col gap-4 px-4 pb-4">
      <TokenModal open={tokensModal} setOpen={setTokensModal} />
      <CustomTokenImportModal />
      <ConfirmationModal
        onConfirm={onSubmit}
        approve={approve}
        allowance={allowance}
        bridge={bridge}
      />
      <FaultProofInfoModal />
      <WithdrawalReadyToFinalizeModal />
      <Modals />

      {/* alerts */}
      <NoGasModal
        open={alerts.includes(AlertModals.NoGas)}
        onCancel={onCancel}
        onProceed={onDismissAlert(AlertModals.NoGas)}
      />
      <ExpensiveGasModal
        open={alerts.includes(AlertModals.GasExpensive)}
        onCancel={onCancel}
        onProceed={onDismissAlert(AlertModals.GasExpensive)}
      />
      <FaultProofsModal
        open={alerts.includes(AlertModals.FaultProofs)}
        onCancel={onCancel}
        onProceed={onDismissAlert(AlertModals.FaultProofs)}
      />

      <div className="flex flex-col gap-1">
        {fast ? <FastFromTo /> : <FromTo />}

        {token ? (
          <TokenInput />
        ) : nft ? (
          <div
            className={`relative rounded-[16px] px-4 py-3 border-2 border-transparent focus-within:border-border transition-colors bg-muted `}
          >
            <label
              htmlFor="amount"
              className={`block text-xs  leading-6 text-foreground`}
            >
              {withdrawing ? t("withdraw") : t("deposit")}
            </label>
            <div className="relative">
              <div
                className="flex justify-between items-center gap-2 cursor-pointer group"
                onClick={() => setTokensModal(true)}
                role="button"
              >
                <div className="flex gap-2  items-center ">
                  <NftImage nft={nft} className="h-12 w-12 rounded-lg" />
                  <div className="flex flex-col gap-0">
                    <div>#{nft.tokenId}</div>
                    <div className="text-xs">{nft.name}</div>
                  </div>
                </div>
                <div
                  className={`flex h-8 w-8 justify-center rounded-full p-2 items-center  transition-all group-hover:scale-105 text-foreground bg-card`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={14}
                    height={14}
                    className={`w-3.5 h-3.5 fill-foreground`}
                    viewBox="0 0 16 16"
                  >
                    <path d="M13.53 6.031l-5 5a.75.75 0 01-1.062 0l-5-5A.751.751 0 113.531 4.97L8 9.439l4.47-4.47a.751.751 0 011.062 1.062h-.001z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <LineItems />
      <Button disabled={submitButton.disabled} onClick={submitButton.onSubmit}>
        {submitButton.buttonText}
      </Button>
    </div>
  );
};
