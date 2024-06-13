import { useConnectModal } from "@rainbow-me/rainbowkit";
import { waitForTransactionReceipt } from "@wagmi/core";
import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { isPresent } from "ts-is-present";
import { match } from "ts-pattern";
import { formatUnits, parseUnits } from "viem";
import { useAccount, useBalance, useConfig, useWalletClient } from "wagmi";

import { useBridgeControllerTrack } from "@/codegen";
import { isSuperbridge } from "@/config/superbridge";
import { currencySymbolMap } from "@/constants/currency-symbol-map";
import { SUPERCHAIN_MAINNETS } from "@/constants/superbridge";
import { useAcrossPaused } from "@/hooks/across/use-across-paused";
import { useAcrossDomains } from "@/hooks/use-across-domains";
import { useAllowance } from "@/hooks/use-allowance";
import { useApprove } from "@/hooks/use-approve";
import { useTokenBalance } from "@/hooks/use-balances";
import { useBaseNativeTokenBalance } from "@/hooks/use-base-native-token-balance";
import { useBridge } from "@/hooks/use-bridge";
import { useBridgeLimit } from "@/hooks/use-bridge-limit";
import { useFromChain, useToChain } from "@/hooks/use-chain";
import { useDeployment } from "@/hooks/use-deployment";
import { useFaultProofUpgradeTime } from "@/hooks/use-fault-proof-upgrade-time";
import { useNativeToken } from "@/hooks/use-native-token";
import { useNetworkFee } from "@/hooks/use-network-fee";
import { useTokenPrice } from "@/hooks/use-prices";
import { useAcrossFee, useReceiveAmount } from "@/hooks/use-receive-amount";
import { useRequiredCustomGasTokenBalance } from "@/hooks/use-required-custom-gas-token-balance";
import { useSelectedToken } from "@/hooks/use-selected-token";
import { useStatusCheck } from "@/hooks/use-status-check";
import { useSwitchChain } from "@/hooks/use-switch-chain";
import { useActiveTokens } from "@/hooks/use-tokens";
import { useTransferTime } from "@/hooks/use-transfer-time";
import { useWeiAmount } from "@/hooks/use-wei-amount";
import { useWithdrawalsPaused } from "@/hooks/use-withdrawals-paused";
import { useConfigState } from "@/state/config";
import { usePendingTransactions } from "@/state/pending-txs";
import { useSettingsState } from "@/state/settings";
import { buildPendingTx } from "@/utils/build-pending-tx";
import { isEth, isNativeToken } from "@/utils/is-eth";
import { isNativeUsdc } from "@/utils/is-usdc";

import { FromTo } from "./FromTo";
import { AddressModal } from "./address-modal";
import {
  ExpensiveGasModal,
  useEstimateTotalFeesInFiat,
} from "./alerts/expensive-gas-modal";
import { FaultProofsModal } from "./alerts/fault-proofs-modal";
import { NoGasModal } from "./alerts/no-gas-modal";
import { ConfirmationModal } from "./confirmation-modal";
import { FastFromTo } from "./fast/FromTo";
import { FaultProofInfoModal } from "./fault-proof-info-modal";
import { NetworkFees } from "./fees/network-fees";
import { WithdrawFees } from "./fees/withdraw-fees";
import { NftImage } from "./nft";
import { TokenInput } from "./token-input";
import { TokenModal } from "./tokens/Modal";
import { CustomTokenImportModal } from "./tokens/custom-token-import-modal";
import { Button } from "./ui/button";
import { WithdrawSettingsModal } from "./withdraw-settings/modal";
import { WithdrawalReadyToFinalizeModal } from "./withdrawal-ready-to-finalize-modal";

enum AlertModals {
  NoGas = "no-gas",
  GasExpensive = "gas-expensive",
  FaultProofs = "fault-proofs",
}

const RecipientAddress = ({
  openAddressDialog,
}: {
  openAddressDialog: () => void;
}) => {
  const recipientName = useConfigState.useRecipientName();
  const recipientAddress = useConfigState.useRecipientAddress();
  const account = useAccount();
  const { t } = useTranslation();

  return (
    <div
      className="flex items-center justify-between px-3 py-2"
      onClick={!account.address ? () => {} : openAddressDialog}
    >
      <div className="flex justify-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="none"
          viewBox="0 0 14 14"
          className="fill-foreground w-4 h-4"
        >
          <path d="M7 2.866c.193 0 .382.06.531.202l3.7 3.268c.179.16.341.372.341.664 0 .292-.159.501-.341.664l-3.7 3.268a.773.773 0 01-.531.202.806.806 0 01-.531-1.408l2.171-1.92H3.231a.806.806 0 01-.804-.803c0-.441.362-.803.804-.803h5.41L6.468 4.28A.806.806 0 017 2.872v-.006z"></path>
        </svg>
        <span className={`text-xs `}>{t("toAddress")}</span>
      </div>

      {!account.address ? (
        <span className={"text-xs  text-muted-foreground"}>…</span>
      ) : !recipientAddress ? (
        <div className="flex justify-center gap-1 pl-2 pr-1 py-1 rounded-full cursor-pointer hover:scale-105 transition-all bg-muted">
          <span className="text-xs  text-foreground">Add address</span>
          <Image
            alt="Address icon"
            src={"/img/address-add.svg"}
            height={14}
            width={14}
          />
        </div>
      ) : (
        <div
          className={clsx(
            `flex justify-center gap-1 pl-2 pr-1 py-1 rounded-full cursor-pointer hover:scale-105 transition-all bg-green-500/10`
          )}
        >
          <span className={clsx(`text-xs  `, "text-green-500")}>
            {recipientName
              ? recipientName
              : `${recipientAddress.slice(0, 4)}...${recipientAddress.slice(
                  recipientAddress.length - 4
                )}`}
          </span>
          <Image
            alt="Address icon"
            src={"/img/address-ok.svg"}
            height={14}
            width={14}
          />
        </div>
      )}
    </div>
  );
};

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
  const transferTime = useTransferTime();
  const { t } = useTranslation();

  const [withdrawSettingsDialog, setWithdrawSettingsDialog] = useState(false);
  const [addressDialog, setAddressDialog] = useState(false);

  const deployment = useDeployment();
  const setConfirmationModal = useConfigState.useSetDisplayConfirmationModal();
  const withdrawing = useConfigState.useWithdrawing();
  const stateToken = useConfigState.useToken();
  const forceViaL1 = useConfigState.useForceViaL1();
  const tokensModal = useConfigState.useTokensModal();
  const setTokensModal = useConfigState.useSetTokensModal();
  const fast = useConfigState.useFast();
  const nft = useConfigState.useNft();
  const recipient = useConfigState.useRecipientAddress();
  const setToken = useConfigState.useSetToken();
  const currency = useSettingsState.useCurrency();
  const addPendingTransaction = usePendingTransactions.useAddTransaction();
  const updatePendingTransactionHash =
    usePendingTransactions.useUpdateTransactionByHash();
  const nativeToken = useNativeToken();
  const statusCheck = useStatusCheck();
  const bridgeLimit = useBridgeLimit();
  const track = useBridgeControllerTrack();
  const faultProofUpgradeTime = useFaultProofUpgradeTime(deployment);
  const acrossPaused = useAcrossPaused();
  const withdrawalsPaused = useWithdrawalsPaused();

  const initiatingChainId =
    forceViaL1 && withdrawing ? deployment?.l1.id : from?.id;
  const fromEthBalance = useBalance({
    address: account.address,
    chainId: initiatingChainId,
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

  const fastFee = useAcrossFee();
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
  const fiatValueBeingBridged = usdPrice && receive ? receive * usdPrice : null;

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
      !deployment ||
      statusCheck
    ) {
      return;
    }

    const initiatingChain = fast
      ? acrossDomains.find((x) => x.chain?.id === bridge.args?.tx.chainId)
          ?.chain
      : bridge.args.tx.chainId === deployment.l1.id
      ? deployment.l1
      : deployment.l2;
    if (!initiatingChain) {
      return;
    }

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
      track.mutate({
        data: {
          amount: weiAmount.toString(),
          deploymentId: deployment!.id,
          transactionHash: hash,
          action: withdrawing
            ? forceViaL1
              ? "force-withdraw"
              : "withdraw"
            : "deposit",
        },
      });

      const pending = buildPendingTx(
        deployment!,
        account.address,
        recipient,
        weiAmount,
        stateToken,
        nft,
        withdrawing,
        hash,
        forceViaL1
      );
      if (pending) addPendingTransaction(pending);

      if (nft) {
        setToken(tokens.find((x) => isNativeToken(x))!);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const lineItems = [
    fast
      ? {
          icon: "/img/icon-fast-withdraw.svg",
          left: "Superfast fee",
          middle:
            fastFee && usdPrice
              ? `${currencySymbolMap[currency]}${(
                  fastFee * usdPrice
                ).toLocaleString("en")}`
              : undefined,
          right: fastFee
            ? `${fastFee.toLocaleString("en", {
                maximumFractionDigits: 4,
              })} ${stateToken?.[to?.id ?? 0]?.symbol}`
            : "",
        }
      : null,
    stateToken
      ? {
          icon: "/img/receive.svg",
          left: t("receiveOnChain", { chain: to?.name }),
          middle: fiatValueBeingBridged
            ? `${
                currencySymbolMap[currency]
              }${fiatValueBeingBridged.toLocaleString("en")}`
            : undefined,
          right: receive
            ? `${receive.toLocaleString("en", {
                maximumFractionDigits: 4,
              })} ${stateToken?.[to?.id ?? 0]?.symbol}`
            : "",
        }
      : nft
      ? {
          icon: "/img/receive.svg",
          left: t("receiveOnChain", { chain: to?.name }),
          component: (
            <div className="flex items-center gap-2">
              <div className="text-xs ">#{nft.tokenId}</div>
              <NftImage
                nft={{
                  address: nft.localConfig.address,
                  chainId: nft.localConfig.chainId,
                  tokenId: nft.tokenId,
                  image: nft.image,
                  tokenUri: nft.tokenUri,
                }}
                className="h-6 w-6 rounded-sm"
              />
            </div>
          ),
        }
      : null,
    {
      icon: "/img/transfer-time.svg",
      left: t("transferTime"),
      right: transferTime,
    },
  ].filter(isPresent);

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
      isNativeUsdc(stateToken), // need to mint
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
      (isSuperbridge || SUPERCHAIN_MAINNETS.includes(deployment?.name ?? ""))
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
    disabled: deployment?.name === "surprised-harlequin-bonobo-fvcy2k9oqh",
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
    limitExceeded:
      typeof bridgeLimit !== "undefined" && weiAmount > bridgeLimit,
  })
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
    .with({ disabled: true }, ({ withdrawing }) => ({
      onSubmit: () => {},
      buttonText: withdrawing ? "Withdrawals disabled" : t("depositDisabled"),
      disabled: true,
    }))
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
    .with({ limitExceeded: true }, () => ({
      onSubmit: () => {},
      buttonText: (() => {
        const token = stateToken?.[from?.id ?? 0];
        if (!token || !bridgeLimit) {
          return t("bridgeLimitFallback");
        }

        const formatted = formatUnits(bridgeLimit, token.decimals);
        return t("bridgeLimit", {
          amount: parseInt(formatted).toLocaleString("en", {
            notation: "compact",
            compactDisplay: "short",
          }),
          symbol: token.symbol,
        });
      })(),
      disabled: true,
    }))
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
        : d.withdrawing
        ? t("withdraw")
        : t("deposit"),
      disabled: false,
    }));

  return (
    <div className="flex flex-col gap-3 md:gap-4 px-4 pb-4">
      <TokenModal open={tokensModal} setOpen={setTokensModal} />
      <WithdrawSettingsModal
        open={withdrawSettingsDialog}
        setOpen={setWithdrawSettingsDialog}
      />
      <CustomTokenImportModal />
      <AddressModal open={addressDialog} setOpen={setAddressDialog} />
      <ConfirmationModal
        onConfirm={onSubmit}
        approve={approve}
        allowance={allowance}
        bridge={bridge}
      />
      <FaultProofInfoModal />
      <WithdrawalReadyToFinalizeModal />

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

      {fast ? <FastFromTo /> : <FromTo />}

      {token ? (
        <TokenInput />
      ) : nft ? (
        <>
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
        </>
      ) : null}

      <div
        className={`border border-border rounded-2xl divide-y divide-border pt-1`}
      >
        <RecipientAddress openAddressDialog={() => setAddressDialog(true)} />
        {lineItems.map(({ left, middle, right, icon, component }) => (
          <div
            key={left}
            className="flex items-center justify-between px-3 py-2 md:py-3"
          >
            <div className="flex justify-center gap-2">
              <Image
                alt={icon}
                src={icon}
                height={16}
                width={16}
                className="w-4 h-4"
              />
              <span className={`text-foreground text-xs `}>{left}</span>
            </div>

            {component ? (
              component
            ) : (
              <div className="flex items-center">
                {middle && (
                  <span
                    className={`text-muted-foreground ml-auto text-xs  mr-2`}
                  >
                    {middle}
                  </span>
                )}
                <span className={`text-xs  text-foreground text-right`}>
                  {right}
                </span>
              </div>
            )}
          </div>
        ))}

        {fast || !withdrawing ? (
          <NetworkFees />
        ) : (
          <WithdrawFees openSettings={() => setWithdrawSettingsDialog(true)} />
        )}
      </div>

      <Button disabled={submitButton.disabled} onClick={submitButton.onSubmit}>
        {submitButton.buttonText}
      </Button>
    </div>
  );
};
