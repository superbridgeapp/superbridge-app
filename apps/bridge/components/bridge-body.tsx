import { useConnectModal } from "@rainbow-me/rainbowkit";
import { waitForTransaction } from "@wagmi/core";
import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { isPresent } from "ts-is-present";
import { P, match } from "ts-pattern";
import { formatUnits, parseUnits } from "viem";
import { useAccount, useBalance, useFeeData, useWalletClient } from "wagmi";

import { useBridgeControllerTrack } from "@/codegen";
import { DeploymentType } from "@/codegen/model";
import { deploymentTheme } from "@/config/theme";
import { currencySymbolMap } from "@/constants/currency-symbol-map";
import { useAllowance } from "@/hooks/use-allowance";
import { useAllowanceNft } from "@/hooks/use-allowance-nft";
import { useApprove } from "@/hooks/use-approve";
import { useApproveNft } from "@/hooks/use-approve-nft";
import { useTokenBalance } from "@/hooks/use-balances";
import { useBridge } from "@/hooks/use-bridge";
import { useBridgeFee } from "@/hooks/use-bridge-fee";
import { useFromChain, useToChain } from "@/hooks/use-chain";
import { useIsContractAccount } from "@/hooks/use-is-contract-account";
import { useNativeToken } from "@/hooks/use-native-token";
import { useTokenPrice } from "@/hooks/use-prices";
import { useSelectedToken } from "@/hooks/use-selected-token";
import { useSwitchChain } from "@/hooks/use-switch-chain";
import { useActiveTokens } from "@/hooks/use-tokens";
import { useTransferTime } from "@/hooks/use-transfer-time";
import { useWeiAmount } from "@/hooks/use-wei-amount";
import { useConfigState } from "@/state/config";
import { usePendingTransactions } from "@/state/pending-txs";
import { useSettingsState } from "@/state/settings";
import { Theme } from "@/types/theme";
import { buildPendingTx } from "@/utils/build-pending-tx";
import { isEth, isNativeToken } from "@/utils/is-eth";
import { isNativeUsdc } from "@/utils/is-usdc";

import { FromTo } from "./FromTo";
import { AddressModal } from "./address-modal";
import { DepositFees } from "./fees/deposit-fees";
import { WithdrawFees } from "./fees/withdraw-fees";
import { NftImage } from "./nft";
import { TokenModal } from "./tokens/Modal";
import { Button } from "./ui/button";
import { WithdrawSettingsModal } from "./withdraw-settings/modal";
import { ConfirmationModal } from "./confirmation-modal";
import { TokenIcon } from "./token-icon";

const RecipientAddress = ({
  openAddressDialog,
  theme,
}: {
  openAddressDialog: () => void;
  theme: Theme;
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
        <span
          className={clsx(
            "text-xs font-medium text-white",
            theme.textColorMuted
          )}
        >
          …
        </span>
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
  const bridgeFee = useBridgeFee();
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

  const deployment = useConfigState.useDeployment();
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

  const track = useBridgeControllerTrack();

  const ethBalance = useBalance({ address: wallet.data?.account.address });
  const tokenBalance = useTokenBalance(token);
  const feeData = useFeeData({
    chainId: forceViaL1 && withdrawing ? deployment?.l1.id : from?.id,
  });
  const allowance = useAllowance(token, bridge.address);
  const nftAllowance = useAllowanceNft();

  let networkFee: number | undefined;
  if (feeData.data) {
    const gwei =
      (feeData.data.gasPrice ?? feeData.data.maxFeePerGas)! *
      BigInt(withdrawing ? 200_000 : 150_000);
    networkFee = parseFloat(formatUnits(gwei, 18));
  }

  const approve = useApprove(
    token,
    bridge.address,
    allowance.refetch,
    bridge.refetch,
    weiAmount
  );
  const approveNft = useApproveNft(nftAllowance.refetch, bridge.refetch);
  const usdPrice = useTokenPrice(stateToken);

  const fee = parseInt(((bridgeFee.data as bigint) ?? BigInt(0)).toString());

  const parsedRawAmount = parseFloat(rawAmount) || 0;
  const appliedFee = (fee / 10_000) * parsedRawAmount;
  const receive = parsedRawAmount - appliedFee;

  const hasInsufficientBalance = weiAmount > tokenBalance;
  const hasInsufficientGas =
    networkFee &&
    BigInt(parseUnits(networkFee.toFixed(18), 18)) >
      (ethBalance.data?.value ?? BigInt(0));

  const onWrite = async () => {
    if (!account.address || !wallet.data || !bridge.valid || !recipient) {
      console.warn("Missing connected account");
      return;
    }

    if (!withdrawing && wallet.data.chain.id !== deployment!.l1.id) {
      await switchChain(deployment!.l1);
    }

    if (
      withdrawing &&
      forceViaL1 &&
      wallet.data.chain.id !== deployment!.l1.id
    ) {
      await switchChain(deployment!.l1);
    }

    if (withdrawing && wallet.data.chain.id !== deployment!.l2.id) {
      await switchChain(deployment!.l2);
    }

    try {
      const { hash } = await bridge.write.sendTransactionAsync!();
      waitForTransaction({
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
          middle: usdPrice
            ? `${currencySymbolMap[currency]}${(
                receive * usdPrice
              ).toLocaleString("en")}`
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

  const onSubmit = async () => {
    await onWrite();
    allowance.refetch();
    setConfirmationModal(false);
  };

  const handleSubmitClick = () => {
    if (!nft && weiAmount === BigInt(0)) {
      return;
    }

    setConfirmationModal(true);
  };

  const submitButton = match({
    disabled: deployment?.name === "orb3-mainnet" && !withdrawing,
    withdrawing,
    isSubmitting: bridge.write.isLoading,
    account: account.address,
    wallet: wallet.data,
    hasInsufficientBalance,
    hasInsufficientGas,
    forceViaL1,
    allowance: allowance.data,
    nftAllowance: nftAllowance.data,
    approve,
    approveNft,
    token,
    nft,
    isEth: isEth(token),
    recipient,
  })
    .with({ disabled: true }, () => ({
      onSubmit: () => {},
      buttonText: t("depositDisabled"),
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
    .with({ hasInsufficientBalance: true }, () => ({
      onSubmit: () => {},
      buttonText: t("insufficientFunds"),
      disabled: true,
    }))
    .with({ hasInsufficientGas: true }, (d) => ({
      onSubmit: handleSubmitClick,
      buttonText: t("insufficientGas", {
        symbol: nativeToken?.[from?.id ?? 0]?.symbol ?? "ETH",
      }),
      // Let's not disable here because people could actually submit with
      // a lower gas price via their wallet. A little power-usery but important imo
      disabled: false,
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

  const theme = deploymentTheme(deployment);
  return (
    <div className="flex flex-col gap-3 md:gap-4 px-4 pb-4">
      <TokenModal open={tokensDialog} setOpen={setTokensDialog} />
      <WithdrawSettingsModal
        open={withdrawSettingsDialog}
        setOpen={setWithdrawSettingsDialog}
        from={from}
        gasEstimate={200_000}
      />
      <AddressModal open={addressDialog} setOpen={setAddressDialog} />
      <ConfirmationModal
        onConfirm={onSubmit}
        approve={approve}
        allowance={allowance}
        bridge={bridge}
      />
      <FromTo />

      {token ? (
        <div
          className={`relative rounded-[16px] px-4 py-3 border-2 border-transparent focus-within:border-zinc-950/[0.01] dark:focus-within:border-zinc-50/[0.02] transition-colors ${theme.bgMuted} `}
        >
          <label
            htmlFor="amount"
            className={`block text-xs font-medium leading-6 ${theme.textColor}`}
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
              className={`block w-full shadow-none bg-transparent focus:outline-none font-medium text-2xl md:text-3xl sm:leading-6 placeholder:text-zinc-400 ${theme.textColor}`}
              placeholder="0"
            />

            <button
              onClick={() => setTokensDialog(true)}
              className={`absolute inset-y-0 right-0 flex gap-x-2 rounded-full pl-3 pr-3 items-center font-medium transition-all hover:scale-105 ${theme.textColor} ${theme.bg}`}
            >
              <TokenIcon token={token} className="h-[20px] w-[20px]" />
              {token?.symbol}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={14}
                height={14}
                className={`w-3.5 h-3.5 fill-zinc-900 dark:fill-zinc-50 `}
                viewBox="0 0 16 16"
              >
                <path d="M13.53 6.031l-5 5a.75.75 0 01-1.062 0l-5-5A.751.751 0 113.531 4.97L8 9.439l4.47-4.47a.751.751 0 011.062 1.062h-.001z"></path>
              </svg>
            </button>
          </div>
          <div className="pt-1 flex items-center justify-between">
            <div>
              {usdPrice && (
                <span className={`${theme.textColorMuted} text-xs font-medium`}>
                  ${(parsedRawAmount * usdPrice).toLocaleString("en")}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <span className={`${theme.textColorMuted} text-xs font-medium`}>
                {t("availableBalance", {
                  amount: parseFloat(
                    formatUnits(tokenBalance, token?.decimals ?? 18)
                  ).toLocaleString("en", {
                    maximumFractionDigits: 4,
                  }),
                  symbol: token?.symbol,
                })}
              </span>
              {/* {isNativeUsdc(token) && ( */}
              <div className="h-[18px] pr-1.5 pl-1 flex items-center gap-0.5 bg-gradient-to-l from-[#7AECC2] via-[#65BCFF] to-[#A796F6] rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 233 233"
                  className="fill-zinc-950/80"
                >
                  <path d="M217.43 59.37L212.43 50.59C212.038 49.9019 211.492 49.3137 210.835 48.8713C210.178 48.429 209.428 48.1444 208.643 48.0399C207.858 47.9353 207.059 48.0136 206.309 48.2686C205.559 48.5236 204.879 48.9485 204.32 49.51L192.82 61C191.979 61.845 191.456 62.9546 191.34 64.141C191.223 65.3273 191.52 66.5175 192.18 67.51C196.373 73.9178 199.734 80.8334 202.18 88.09C206.75 101.655 208.027 116.114 205.903 130.27C203.78 144.426 198.318 157.874 189.969 169.501C181.62 181.128 170.623 190.602 157.888 197.138C145.152 203.674 131.045 207.085 116.73 207.09C101.994 207.131 87.4765 203.527 74.47 196.6L93.92 177.14C105.972 181.699 119.115 182.537 131.649 179.548C144.183 176.559 155.532 169.879 164.23 160.371C172.927 150.864 178.574 138.966 180.438 126.216C182.303 113.466 180.301 100.45 174.69 88.85C174.334 88.1073 173.805 87.4607 173.147 86.9648C172.489 86.4689 171.722 86.1379 170.91 85.9998C170.098 85.8617 169.264 85.9204 168.48 86.171C167.695 86.4216 166.982 86.8568 166.4 87.44L154.76 99C154.139 99.6198 153.688 100.388 153.448 101.232C153.208 102.075 153.188 102.966 153.39 103.82L154.39 108C156.111 115.322 155.656 122.987 153.083 130.055C150.509 137.123 145.928 143.285 139.902 147.787C133.876 152.288 126.667 154.932 119.16 155.395C111.652 155.857 104.173 154.118 97.64 150.39L92.51 147.45C91.5297 146.885 90.3902 146.661 89.2688 146.811C88.1475 146.961 87.1073 147.477 86.31 148.28L38.8 195.78C38.2814 196.299 37.8795 196.922 37.6213 197.609C37.3631 198.295 37.2545 199.029 37.3028 199.761C37.3511 200.492 37.5551 201.206 37.9013 201.852C38.2475 202.499 38.7277 203.064 39.31 203.51L46.31 208.88C66.4969 224.437 91.2844 232.837 116.77 232.76C137.06 232.734 156.988 227.386 174.566 217.251C192.143 207.116 206.754 192.547 216.941 175C227.128 157.453 232.535 137.54 232.62 117.25C232.706 96.9604 227.468 77.0029 217.43 59.37Z" />
                  <path d="M187.21 24.82C167.025 9.2578 142.237 0.853117 116.75 0.929966C96.4501 0.945745 76.5098 6.28841 58.9214 16.4241C41.333 26.5599 26.7123 41.1337 16.5203 58.6896C6.32834 76.2455 0.921852 96.1686 0.841068 116.468C0.760284 136.768 6.00803 156.734 16.06 174.37L21.06 183.14C21.4538 183.827 22.0005 184.415 22.6579 184.857C23.3154 185.299 24.0657 185.584 24.8509 185.689C25.6361 185.795 26.435 185.718 27.1858 185.465C27.9365 185.212 28.6188 184.789 29.18 184.23L40.66 172.75C41.495 171.904 42.0142 170.796 42.1307 169.613C42.2472 168.43 41.9539 167.243 41.3 166.25C37.1028 159.844 33.7422 152.928 31.3 145.67C26.7295 132.105 25.4531 117.646 27.5765 103.49C29.6998 89.334 35.1619 75.8864 43.5112 64.259C51.8604 52.6316 62.8571 43.1583 75.5923 36.6221C88.3275 30.0859 102.435 26.6745 116.75 26.67C131.486 26.6366 146 30.2507 159 37.19L139.54 56.64C129.792 52.9453 119.292 51.6729 108.943 52.9319C98.5948 54.191 88.7066 57.9439 80.1286 63.8681C71.5506 69.7924 64.5392 77.7108 59.6971 86.943C54.855 96.1752 52.3268 106.445 52.33 116.87C52.33 117.94 52.62 122.82 52.71 123.66C53.4986 131.046 55.5518 138.241 58.78 144.93C59.1374 145.673 59.6677 146.319 60.3263 146.815C60.9849 147.311 61.7528 147.642 62.5656 147.78C63.3784 147.918 64.2124 147.859 64.9978 147.609C65.7833 147.358 66.4973 146.923 67.08 146.34L78.72 134.69C79.3399 134.072 79.792 133.305 80.0335 132.464C80.2749 131.622 80.2978 130.733 80.1 129.88L79.1 125.69C77.377 118.368 77.8298 110.701 80.4031 103.633C82.9763 96.5644 87.5578 90.4012 93.5849 85.9002C99.6121 81.3992 106.823 78.7563 114.331 78.2962C121.839 77.836 129.318 79.5786 135.85 83.31L140.98 86.25C141.962 86.8096 143.1 87.0315 144.22 86.8816C145.34 86.7316 146.38 86.2181 147.18 85.42L194.68 37.92C195.199 37.4011 195.602 36.7774 195.861 36.0905C196.12 35.4036 196.23 34.6694 196.182 33.9368C196.135 33.2041 195.932 32.4901 195.587 31.8422C195.241 31.1944 194.762 30.6277 194.18 30.18L187.21 24.82Z" />
                </svg>
                <span className="leading-4 mt-[1px] align-text-bottom font-medium text-[10px] text-zinc-950/80">
                  CCTP
                </span>
              </div>
              {/* )} */}
            </div>
          </div>
        </div>
      ) : nft ? (
        <>
          <div
            className={`relative rounded-[16px] px-4 py-3 border-2 border-transparent focus-within:border-zinc-950/[0.01] dark:focus-within:border-zinc-50/[0.02] transition-colors ${theme.bgMuted} `}
          >
            <label
              htmlFor="amount"
              className={`block text-xs font-medium leading-6 ${theme.textColor}`}
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
                  className={`flex h-8 w-8 justify-center rounded-full p-2 items-center font-medium transition-all group-hover:scale-105 ${theme.textColor} ${theme.bg}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={14}
                    height={14}
                    className={`w-3.5 h-3.5 fill-zinc-900 dark:fill-zinc-50 `}
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
        className={`border ${theme.border} rounded-2xl divide-y divide-zinc-100 dark:divide-white/10`}
      >
        <RecipientAddress
          theme={theme}
          openAddressDialog={() => setAddressDialog(true)}
        />
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
              <span className={`${theme.textColor} text-xs font-medium`}>
                {left}
              </span>
            </div>

            {component ? (
              component
            ) : (
              <div className="flex items-center">
                {middle && (
                  <span
                    className={`${theme.textColorMuted} ml-auto text-xs font-medium mr-2`}
                  >
                    {middle}
                  </span>
                )}
                <span
                  className={`text-xs font-medium ${theme.textColor} text-right`}
                >
                  {right}
                </span>
              </div>
            )}
          </div>
        ))}

        {withdrawing ? (
          <WithdrawFees
            gasEstimate={200_000}
            openSettings={() => setWithdrawSettingsDialog(true)}
          />
        ) : (
          <DepositFees gasEstimate={200_000} />
        )}
      </div>

      <Button
        disabled={submitButton.disabled}
        onClick={submitButton.onSubmit}
        className={`flex w-full justify-center rounded-full px-3 py-6 text-sm font-bold leading-6 text-white shadow-sm ${theme.accentText} ${theme.accentBg}`}
      >
        {submitButton.buttonText}
      </Button>
    </div>
  );
};
