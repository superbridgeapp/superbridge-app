import { useConnectModal } from "@rainbow-me/rainbowkit";
import { waitForTransactionReceipt } from "@wagmi/core";
import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { isPresent } from "ts-is-present";
import { match } from "ts-pattern";
import { formatUnits, parseUnits } from "viem";
import {
  useAccount,
  useBalance,
  useConfig,
  useEstimateFeesPerGas,
  useWalletClient,
} from "wagmi";

import { useBridgeControllerTrack } from "@/codegen";
import { currencySymbolMap } from "@/constants/currency-symbol-map";
import { useAllowance } from "@/hooks/use-allowance";
import { useApprove } from "@/hooks/use-approve";
import { useTokenBalance } from "@/hooks/use-balances";
import { useBaseNativeTokenBalance } from "@/hooks/use-base-native-token-balance";
import { useBridge } from "@/hooks/use-bridge";
import { useBridgeLimit } from "@/hooks/use-bridge-limit";
import { useFromChain, useToChain } from "@/hooks/use-chain";
import { useDeployment } from "@/hooks/use-deployment";
import { useIsCustomToken } from "@/hooks/use-is-custom-token";
import { useIsCustomTokenFromList } from "@/hooks/use-is-custom-token-from-list";
import { useNativeToken } from "@/hooks/use-native-token";
import { useTokenPrice } from "@/hooks/use-prices";
import { useRequiredCustomGasTokenBalance } from "@/hooks/use-required-custom-gas-token-balance";
import { useSelectedToken } from "@/hooks/use-selected-token";
import { useStatusCheck } from "@/hooks/use-status-check";
import { useSwitchChain } from "@/hooks/use-switch-chain";
import { useActiveTokens } from "@/hooks/use-tokens";
import { useTransferTime } from "@/hooks/use-transfer-time";
import { useWeiAmount } from "@/hooks/use-wei-amount";
import { useConfigState } from "@/state/config";
import { usePendingTransactions } from "@/state/pending-txs";
import { useSettingsState } from "@/state/settings";
import { buildPendingTx } from "@/utils/build-pending-tx";
import { isEth, isNativeToken } from "@/utils/is-eth";
import { isNativeUsdc } from "@/utils/is-usdc";

import { FromTo } from "./FromTo";
import { AddressModal } from "./address-modal";
import { ConfirmationModal } from "./confirmation-modal";
import { CctpBadge } from "./cttp-badge";
import { DepositFees } from "./fees/deposit-fees";
import { WithdrawFees } from "./fees/withdraw-fees";
import { NftImage } from "./nft";
import { NoGasModal } from "./alerts/no-gas-modal";
import { TokenIcon } from "./token-icon";
import { TokenModal } from "./tokens/Modal";
import { CustomTokenImportModal } from "./tokens/custom-token-import-modal";
import { Button } from "./ui/button";
import { WithdrawSettingsModal } from "./withdraw-settings/modal";
import {
  ExpensiveGasModal,
  useEstimateTotalFeesInFiat,
} from "./alerts/expensive-gas-modal";
import { FaultProofsModal } from "./alerts/fault-proofs-modal";
import { FaultProofInfoModal } from "./fault-proof-info-modal";
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
          className="fill-zinc-900 dark:fill-zinc-50 w-4 h-4"
        >
          <path d="M7 2.866c.193 0 .382.06.531.202l3.7 3.268c.179.16.341.372.341.664 0 .292-.159.501-.341.664l-3.7 3.268a.773.773 0 01-.531.202.806.806 0 01-.531-1.408l2.171-1.92H3.231a.806.806 0 01-.804-.803c0-.441.362-.803.804-.803h5.41L6.468 4.28A.806.806 0 017 2.872v-.006z"></path>
        </svg>
        <span className={`text-xs font-medium`}>{t("toAddress")}</span>
      </div>

      {!account.address ? (
        <span className={"text-xs font-medium text-muted-foreground"}>…</span>
      ) : !recipientAddress ? (
        <div className="flex justify-center gap-1 pl-2 pr-1 py-1 rounded-full cursor-pointer hover:scale-105 transition-all bg-zinc-950">
          <span className="text-xs font-medium text-white">Add address</span>
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
            `flex justify-center gap-1 pl-2 pr-1 py-1 rounded-full cursor-pointer hover:scale-105 transition-all`,
            "bg-green-100 dark:bg-green-950"
          )}
        >
          <span className={clsx(`text-xs font-medium `, "text-green-500")}>
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

  const [tokensDialog, setTokensDialog] = useState(false);
  const [withdrawSettingsDialog, setWithdrawSettingsDialog] = useState(false);
  const [addressDialog, setAddressDialog] = useState(false);
  const [noGasModal, setNoGasModal] = useState(false);

  const deployment = useDeployment();
  const setConfirmationModal = useConfigState.useSetDisplayConfirmationModal();
  const withdrawing = useConfigState.useWithdrawing();
  const rawAmount = useConfigState.useRawAmount();
  const stateToken = useConfigState.useToken();
  const forceViaL1 = useConfigState.useForceViaL1();
  const setRawAmount = useConfigState.useSetRawAmount();
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
  const feeData = useEstimateFeesPerGas({
    chainId: initiatingChainId,
  });
  const wagmiConfig = useConfig();

  const allowance = useAllowance(token, bridge.address);

  let networkFee: number | undefined;
  if (feeData.data && bridge.gas) {
    const gwei =
      (feeData.data.gasPrice ?? feeData.data.maxFeePerGas ?? BigInt(0)) *
      bridge.gas;
    networkFee = parseFloat(formatUnits(gwei, 18));
  }

  const approve = useApprove(
    token,
    bridge.address,
    allowance.refetch,
    bridge.refetch,
    weiAmount
  );
  const usdPrice = useTokenPrice(stateToken);

  const receive = parseFloat(rawAmount) || 0;

  const hasInsufficientBalance = weiAmount > tokenBalance;
  const hasInsufficientGas =
    networkFee &&
    BigInt(parseUnits(networkFee.toFixed(18), 18)) >
      (fromEthBalance.data?.value ?? BigInt(0));

  const totalFeesInFiat = useEstimateTotalFeesInFiat();
  const fiatValueBeingBridged = usdPrice ? receive * usdPrice : null;

  const requiredCustomGasTokenBalance = useRequiredCustomGasTokenBalance();
  /**
   * Transferring native gas token to rollup, need to make sure wei + extraAmount is < balance
   * Transferring token to rollup, need to make sure extraAmount < balance
   */
  const hasInsufficientBaseNativeTokenBalance =
    !!requiredCustomGasTokenBalance &&
    !!baseNativeTokenBalance.data &&
    requiredCustomGasTokenBalance > baseNativeTokenBalance.data;

  const isCustomToken = useIsCustomToken(stateToken);
  const isCustomTokenFromList = useIsCustomTokenFromList(stateToken);

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

    const initiatingChain =
      bridge.args.tx.chainId === deployment.l1.id
        ? deployment.l1
        : deployment.l2;
    if (initiatingChain.id !== account.chainId) {
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
    stateToken
      ? {
          icon: "/img/receive.svg",
          left: t("receiveOnChain", { chain: to?.name }),
          middle: fiatValueBeingBridged
            ? `${
                currencySymbolMap[currency]
              }${fiatValueBeingBridged.toLocaleString("en")}`
            : undefined,
          right: `${receive.toLocaleString("en", {
            maximumFractionDigits: 4,
          })} ${stateToken?.[to?.id ?? 0]?.symbol}`,
        }
      : nft
      ? {
          icon: "/img/receive.svg",
          left: t("receiveOnChain", { chain: to?.name }),
          component: (
            <div className="flex items-center gap-2">
              <div className="text-xs font-medium">#{nft.tokenId}</div>
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

    // if (
    //   totalFeesInFiat &&
    //   fiatValueBeingBridged &&
    //   totalFeesInFiat > fiatValueBeingBridged
    // ) {
    //   modals.push(AlertModals.GasExpensive);
    // }

    if (deployment?.name === "optimism" && withdrawing) {
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
    disabled:
      (deployment?.name === "orb3-mainnet" && !withdrawing) ||
      deployment?.name === "surprised-harlequin-bonobo-fvcy2k9oqh",
    withdrawing,
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
      <TokenModal open={tokensDialog} setOpen={setTokensDialog} />
      <WithdrawSettingsModal
        open={withdrawSettingsDialog}
        setOpen={setWithdrawSettingsDialog}
        from={from}
        gasEstimate={bridge.gas}
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
      <FromTo />

      {token ? (
        <div
          className={`relative rounded-[16px] px-4 py-3 border-2 border-transparent focus-within:border-border transition-colors bg-muted `}
        >
          <label
            htmlFor="amount"
            className={`block text-xs font-medium leading-6 text-foreground`}
          >
            {withdrawing ? t("withdraw") : t("deposit")}
          </label>
          <div className="relative">
            <input
              value={rawAmount}
              onChange={(e) => {
                const parsed = e.target.value.replaceAll(",", ".");
                setRawAmount(parsed);
              }}
              type="text"
              inputMode="decimal"
              minLength={1}
              maxLength={79}
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              pattern="^[0-9]*[.,]?[0-9]*$"
              name="amount"
              id="amount"
              className={`block w-full shadow-none bg-transparent focus:outline-none font-medium text-2xl md:text-3xl sm:leading-6 placeholder:text-muted-foreground text-foreground`}
              placeholder="0"
            />

            <button
              onClick={() => setTokensDialog(true)}
              className={`absolute inset-y-0 right-0 flex gap-x-2 rounded-full pl-3 pr-3 items-center font-medium transition-all hover:scale-105 text-foreground bg-card`}
            >
              <TokenIcon token={token} className="h-[20px] w-[20px]" />
              {token?.symbol}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={14}
                height={14}
                className={`w-3.5 h-3.5 fill-foreground `}
                viewBox="0 0 16 16"
              >
                <path d="M13.53 6.031l-5 5a.75.75 0 01-1.062 0l-5-5A.751.751 0 113.531 4.97L8 9.439l4.47-4.47a.751.751 0 011.062 1.062h-.001z"></path>
              </svg>

              {(isCustomToken || isCustomTokenFromList) && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  className="absolute top-4 left-6 w-3 h-3"
                >
                  <g clip-path="url(#clip0_995_5016)">
                    <path
                      d="M5.68325 4.28632C5.68325 4.02007 5.80325 3.87195 6.05263 3.87195C6.302 3.87195 6.42763 4.02007 6.42763 4.28632C6.42763 4.55257 6.15575 6.8982 6.09763 7.3407C6.092 7.39132 6.08075 7.44195 6.05263 7.44195C6.0245 7.44195 6.01325 7.40257 6.00763 7.3332C5.957 6.89632 5.68325 4.54132 5.68325 4.28445V4.28632ZM5.68325 9.40507C5.68325 9.20632 5.84825 9.04132 6.05263 9.04132C6.257 9.04132 6.41638 9.20632 6.41638 9.40507C6.41638 9.60382 6.25138 9.77445 6.05263 9.77445C5.85388 9.77445 5.68325 9.60945 5.68325 9.40507ZM1.2545 11.4038H10.8414C11.5801 11.4038 11.9364 10.8188 11.5914 10.1832L6.77263 1.28257C6.38638 0.573823 5.72825 0.573823 5.342 1.27695L0.506377 10.1776C0.165127 10.8132 0.517627 11.4038 1.25638 11.4038H1.2545Z"
                      fill="#F97316"
                    />
                    <path
                      d="M5.00074 4.28625C5.00074 4.58625 5.29512 6.94313 5.37012 7.4475C5.43199 7.87875 5.70012 8.1225 6.05074 8.1225C6.42574 8.1225 6.66387 7.845 6.72574 7.4475C6.85137 6.66375 7.10637 4.58625 7.10637 4.28625C7.10637 3.72375 6.67512 3.19125 6.05074 3.19125C5.42637 3.19125 5.00074 3.73125 5.00074 4.28625ZM6.05637 10.4606C6.63012 10.4606 7.10074 9.99 7.10074 9.39938C7.10074 8.80875 6.63012 8.355 6.05637 8.355C5.48262 8.355 4.99512 8.82563 4.99512 9.39938C4.99512 9.97313 5.46574 10.4606 6.05637 10.4606Z"
                      fill="#FFEDD5"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_995_5016">
                      <rect
                        width="11.3494"
                        height="10.6537"
                        fill="white"
                        transform="translate(0.375 0.75)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              )}
            </button>
          </div>
          <div className="pt-1 flex items-center justify-between">
            <div>
              {usdPrice && (
                <span className="text-muted-foreground text-xs font-medium">
                  ${(receive * usdPrice).toLocaleString("en")}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <span className={`text-muted-foreground text-xs font-medium`}>
                {t("availableBalance", {
                  amount: parseFloat(
                    formatUnits(tokenBalance, token?.decimals ?? 18)
                  ).toLocaleString("en", {
                    maximumFractionDigits: 4,
                  }),
                  symbol: token?.symbol,
                })}
              </span>
              {isNativeUsdc(stateToken) && <CctpBadge />}
            </div>
          </div>
        </div>
      ) : nft ? (
        <>
          <div
            className={`relative rounded-[16px] px-4 py-3 border-2 border-transparent focus-within:border-border transition-colors bg-muted `}
          >
            <label
              htmlFor="amount"
              className={`block text-xs font-medium leading-6 text-foreground`}
            >
              {withdrawing ? t("withdraw") : t("deposit")}
            </label>
            <div className="relative">
              <div
                className="flex justify-between items-center gap-2 cursor-pointer group"
                onClick={() => setTokensDialog(true)}
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
                  className={`flex h-8 w-8 justify-center rounded-full p-2 items-center font-medium transition-all group-hover:scale-105 text-foreground bg-card`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={14}
                    height={14}
                    className={`w-3.5 h-3.5 fill-foreground `}
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
              <span className={`text-foreground text-xs font-medium`}>
                {left}
              </span>
            </div>

            {component ? (
              component
            ) : (
              <div className="flex items-center">
                {middle && (
                  <span
                    className={`text-muted-foreground ml-auto text-xs font-medium mr-2`}
                  >
                    {middle}
                  </span>
                )}
                <span
                  className={`text-xs font-medium text-foreground text-right`}
                >
                  {right}
                </span>
              </div>
            )}
          </div>
        ))}

        {withdrawing ? (
          <WithdrawFees
            gasEstimate={bridge.gas}
            openSettings={() => setWithdrawSettingsDialog(true)}
          />
        ) : (
          <DepositFees gasEstimate={bridge.gas} />
        )}
      </div>

      <Button disabled={submitButton.disabled} onClick={submitButton.onSubmit}>
        {submitButton.buttonText}
      </Button>
    </div>
  );
};
