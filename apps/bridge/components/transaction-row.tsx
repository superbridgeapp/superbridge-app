import clsx from "clsx";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import Lottie from "react-lottie-player";
import { match } from "ts-pattern";
import { Address, formatUnits, isAddressEqual } from "viem";
import { useChainId } from "wagmi";

import {
  ArbitrumDepositRetryableDto,
  ArbitrumForcedWithdrawalDto,
  ArbitrumWithdrawalDto,
  BridgeWithdrawalDto,
  CctpBridgeDto,
  EthDepositDto,
  ForcedWithdrawalDto,
  NftDepositDto,
  TokenDepositDto,
} from "@/codegen/model";
import { useFinaliseArbitrum } from "@/hooks/arbitrum/use-arbitrum-finalise";
import { useRedeemArbitrum } from "@/hooks/arbitrum/use-arbitrum-redeem";
import { useMintCctp } from "@/hooks/cctp/use-cctp-mint";
import { useFinaliseOptimism } from "@/hooks/optimism/use-optimism-finalise";
import { useProveOptimism } from "@/hooks/optimism/use-optimism-prove";
import { useGasTokenForDeployment } from "@/hooks/use-approve-gas-token";
import { useDeploymentById } from "@/hooks/use-deployment-by-id";
import { useFromTo } from "@/hooks/use-from-to";
import { useSwitchChain } from "@/hooks/use-switch-chain";
import { useAllTokens } from "@/hooks/use-tokens";
import { MultiChainToken, Token } from "@/types/token";
import { Transaction } from "@/types/transaction";
import { formatDecimals } from "@/utils/format-decimals";
import {
  isAcrossBridge,
  isArbitrumDeposit,
  isArbitrumForcedWithdrawal,
  isArbitrumWithdrawal,
  isCctpBridge,
  isDeposit,
  isForcedWithdrawal,
  isOptimismForcedWithdrawal,
  isOptimismWithdrawal,
  isWithdrawal,
} from "@/utils/guards";
import { isNativeToken } from "@/utils/is-eth";
import { useProgressRows, useTxTitle } from "@/utils/progress-rows";
import {
  ButtonComponent,
  ExpandedItem,
  ProgressRowStatus,
} from "@/utils/progress-rows/common";

import inProgress from "../animation/loading.json";
import { AcrossBadge } from "./across-badge";
import { CctpBadge } from "./badges/cttp-badge";
import { FastNetworkIcon } from "./fast/network-icon";
import { NetworkIcon } from "./network-icon";
import { NftImage } from "./nft";
import { TokenIcon } from "./token-icon";
import { Button } from "./ui/button";

const Prove = ({ tx }: { tx: BridgeWithdrawalDto | ForcedWithdrawalDto }) => {
  const prove = useProveOptimism(isWithdrawal(tx) ? tx : tx.withdrawal!);
  const { t } = useTranslation();
  return (
    <Button onClick={prove.onProve} size={"sm"} disabled={prove.loading}>
      {t("buttons.prove")}
    </Button>
  );
};

const Finalise = ({
  tx,
}: {
  tx: BridgeWithdrawalDto | ForcedWithdrawalDto;
}) => {
  const finalise = useFinaliseOptimism(isWithdrawal(tx) ? tx : tx.withdrawal!);
  const { t } = useTranslation();
  return (
    <Button
      onClick={finalise.onFinalise}
      size={"sm"}
      disabled={finalise.loading}
    >
      {t("buttons.finalize")}
    </Button>
  );
};

const FinaliseArbitrum: FC<{
  tx: ArbitrumWithdrawalDto | ArbitrumForcedWithdrawalDto;
}> = ({ tx }) => {
  const finalise = useFinaliseArbitrum(
    isArbitrumWithdrawal(tx) ? tx : tx.withdrawal!
  );
  const { t } = useTranslation();
  return (
    <Button
      onClick={finalise.onFinalise}
      size={"sm"}
      disabled={finalise.loading}
    >
      {t("buttons.finalize")}
    </Button>
  );
};

const RedeemArbitrum: FC<{
  tx: ArbitrumDepositRetryableDto | ArbitrumForcedWithdrawalDto;
}> = ({ tx }) => {
  const chainId = useChainId();
  const redeem = useRedeemArbitrum(tx);
  const { t } = useTranslation();
  const switchChain = useSwitchChain();

  const deployment = useDeploymentById(
    isArbitrumForcedWithdrawal(tx) ? tx.deposit.deploymentId : tx.deploymentId
  );
  if (!deployment) {
    return null;
  }

  if (chainId === deployment.l1.id) {
    return (
      <Button className="rounded-full" onClick={redeem.write} size={"sm"}>
        {t("buttons.redeem")}
      </Button>
    );
  }
  return (
    <Button onClick={() => switchChain(deployment.l1)} size={"sm"}>
      {t("buttons.switchChain")}
    </Button>
  );
};

const MintCctp: FC<{
  tx: CctpBridgeDto;
}> = ({ tx }) => {
  const mint = useMintCctp(tx);
  const { t } = useTranslation();

  return (
    <Button onClick={mint.write} size={"sm"} disabled={mint.loading}>
      {t("buttons.mint")}
    </Button>
  );
};

const TransactionProgressRow = ({
  item,
  tx,
}: {
  item: ExpandedItem;
  tx: Transaction;
}) => {
  const Wrapper = ({ children }: any) =>
    item.link ? (
      <a href={item.link} target="_blank">
        {children}
      </a>
    ) : (
      <div>{children}</div>
    );

  return (
    <div key={item.label} className="flex items-center justify-between">
      <Wrapper>
        <div
          className={clsx(
            "flex items-center space-x-2 pl-2 pr-3 py-1 rounded-full w-fit",
            item.status === ProgressRowStatus.Done &&
              "bg-green-100 dark:bg-green-950 text-green-500 dark:text-green-400",
            item.status === ProgressRowStatus.InProgress &&
              "bg-green-500 text-white",
            item.status === ProgressRowStatus.NotDone &&
              "bg-muted text-muted-foreground",
            item.status === ProgressRowStatus.Reverted &&
              "bg-red-100 dark:bg-red-950 text-red-500 dark:text-red-400"
          )}
        >
          {item.status === ProgressRowStatus.Done ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              data-name="Layer 2"
              viewBox="0 0 59.64 59.64"
              width="14"
              height="14"
              className="fill-current"
            >
              <path
                d="M12.81 27.64c0-1.79 1.51-3.27 3.27-3.27.88 0 1.76.36 2.39 1.06l9.08 9.93 13.11-18.25c.64-.88 1.63-1.33 2.66-1.33 1.73 0 3.27 1.33 3.27 3.24 0 .67-.18 1.36-.61 1.94L30.51 42.48c-.54.79-1.48 1.33-2.45 1.33-1.12 0-2-.3-2.63-1.03L13.65 29.85c-.58-.61-.85-1.42-.85-2.21zM0 29.82c0 16.44 13.38 29.82 29.82 29.82s29.82-13.38 29.82-29.82S46.26 0 29.82 0 0 13.38 0 29.82z"
                className="cls-1"
                data-name="Layer 1"
              ></path>
            </svg>
          ) : item.status === ProgressRowStatus.InProgress ? (
            <Lottie
              animationData={inProgress}
              loop={true}
              className="w-3.5 h-3.5 scale-150"
              play
            />
          ) : item.status === ProgressRowStatus.Reverted ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 16 16"
              className="fill-current"
            >
              <g clipPath="url(#clip0_470_1602)">
                <path d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm1.325 8.335l2.175 2.17c.135.135.21.31.21.495 0 .385-.32.705-.71.705a.677.677 0 01-.495-.21L8.33 9.33a.472.472 0 00-.66 0l-2.175 2.165a.701.701 0 01-1.2-.495c0-.185.065-.36.2-.495l2.175-2.17c.09-.09.135-.21.135-.335 0-.12-.05-.24-.135-.33L4.495 5.495a.727.727 0 01-.2-.505c0-.39.305-.705.705-.705a.67.67 0 01.495.21l2.175 2.17c.095.09.215.135.335.135.12 0 .24-.05.325-.135l2.175-2.17a.697.697 0 01.495-.21c.415 0 .71.345.71.705 0 .19-.08.365-.21.505L9.325 7.67A.465.465 0 009.19 8c0 .12.05.24.135.335z"></path>
              </g>
              <defs>
                <clipPath id="clip0_470_1602">
                  <path fill="#fff" d="M0 0H16V16H0z"></path>
                </clipPath>
              </defs>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              data-name="Layer 2"
              viewBox="0 0 59.64 59.64"
              width="14"
              height="14"
              className="fill-current opacity-25"
            >
              <path
                d="M29.82 0C13.38 0 0 13.38 0 29.82s13.38 29.82 29.82 29.82 29.82-13.38 29.82-29.82S46.26 0 29.82 0zm0 49.1c-10.63 0-19.28-8.66-19.28-19.28s8.65-19.28 19.28-19.28S49.1 19.2 49.1 29.82 40.44 49.1 29.82 49.1z"
                className="cls-1"
                data-name="Layer 1"
              ></path>
            </svg>
          )}
          <span className="text-xs ">{item.label}</span>
          {item.link && (
            // arrow
            <svg
              xmlns="http://www.w3.org/2000/svg"
              data-name="Layer 2"
              viewBox="0 0 20.88 20.88"
              width="10"
              height="10"
              className="fill-current"
            >
              <path
                d="M1.65 1.64c.41-.41.94-.69 1.56-.71L18.05 0c.73-.04 1.52.06 2.14.69s.73 1.41.69 2.14l-.92 14.83c-.02.62-.3 1.16-.71 1.56-.94.94-2.48.94-3.43 0-.49-.49-.75-1.13-.71-1.86l.54-8.71L4.13 20.17c-.94.94-2.48.94-3.43 0s-.94-2.48 0-3.43L12.22 5.23l-8.71.54a2.35 2.35 0 01-1.86-.71c-.94-.94-.94-2.48 0-3.43z"
                className="cls-1"
                data-name="Layer 1"
              ></path>
            </svg>
          )}
        </div>
      </Wrapper>

      {item.time && (
        <div className="bg-muted rounded-full  text-sm py-1 px-2 space-x-1 flex items-center whitespace-nowrap">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            data-name="Layer 2"
            viewBox="0 0 59.64 59.64"
            width="16"
            height="16"
          >
            <g data-name="Layer 1">
              <circle cx="29.82" cy="29.82" r="26.25" fill="#fff"></circle>
              <path
                d="M47.35 29.82c0 .64.51 1.18 1.18 1.18h4.87c.64 0 1.18-.54 1.18-1.18s-.54-1.18-1.18-1.18h-4.87c-.67 0-1.18.51-1.18 1.18zm-2.36-8.78c.21.39.64.61 1.03.61.21 0 .42-.06.61-.15l4.21-2.42c.58-.33.76-1.06.42-1.63s-1.06-.76-1.6-.42l-4.21 2.42c-.58.33-.79 1.06-.45 1.6zm0 17.53c-.33.58-.12 1.3.45 1.63l4.21 2.42c.18.12.39.15.58.15.42 0 .82-.21 1.03-.58.33-.58.15-1.3-.42-1.63l-4.21-2.42c-.58-.33-1.3-.15-1.63.42zm-6.84-25.55c-.33.58-.12 1.3.42 1.63.21.09.39.15.61.15.39 0 .82-.21 1.03-.61l2.42-4.21c.33-.58.15-1.3-.42-1.6-.58-.33-1.3-.15-1.63.42l-2.42 4.21zm0 33.6l2.42 4.21c.21.36.64.58 1.03.58.21 0 .42-.03.61-.15.58-.33.76-1.06.42-1.63l-2.42-4.21c-.33-.54-1.06-.76-1.63-.42-.54.33-.76 1.06-.42 1.63zM17.01 9.99l2.42 4.21c.21.39.61.61 1.03.61.21 0 .39-.06.61-.15.54-.33.76-1.06.42-1.63l-2.42-4.21c-.33-.58-1.06-.76-1.63-.42-.58.3-.76 1.03-.42 1.6zm0 39.63c-.33.58-.15 1.3.42 1.63.18.12.39.15.61.15.39 0 .82-.21 1.03-.58l2.42-4.21c.33-.58.12-1.3-.42-1.63-.58-.33-1.3-.12-1.63.42l-2.42 4.21zm-2.18-23.61c-.24.94.33 1.94 1.27 2.18l11.99 3.12v22.31c0 .97.76 1.79 1.76 1.79s1.82-.76 1.82-1.76V29.89c0-.91-.73-1.73-1.63-1.79l-13.02-3.36c-.94-.21-1.94.3-2.18 1.27zm-6.45-8.57c-.33.58-.15 1.3.42 1.63l4.21 2.42c.18.09.39.15.61.15.39 0 .82-.21 1.03-.61.33-.54.12-1.27-.45-1.6l-4.21-2.42a1.16 1.16 0 00-1.6.42zm0 24.76c.21.36.61.58 1.03.58.18 0 .39-.03.58-.15l4.21-2.42c.58-.33.79-1.06.45-1.63s-1.06-.76-1.63-.42l-4.21 2.42c-.58.33-.76 1.06-.42 1.63zM5.05 29.82c0 .64.54 1.18 1.18 1.18h4.87c.67 0 1.18-.54 1.18-1.18s-.51-1.18-1.18-1.18H6.23c-.64 0-1.18.51-1.18 1.18zm-1.48 0c0-14.5 11.75-26.25 26.25-26.25s26.25 11.75 26.25 26.25-11.75 26.25-26.25 26.25S3.57 44.32 3.57 29.82zm-3.57 0c0 16.44 13.38 29.82 29.82 29.82s29.82-13.38 29.82-29.82S46.26 0 29.82 0 0 13.38 0 29.82zm29.82-17.53c.67 0 1.18-.51 1.18-1.18V6.24c0-.64-.51-1.18-1.18-1.18s-1.18.54-1.18 1.18v4.87c0 .67.51 1.18 1.18 1.18z"
                className="cls-1"
              ></path>
            </g>
          </svg>

          <div className="text-xs ">{item.time}</div>
        </div>
      )}
      {item.buttonComponent === ButtonComponent.Prove &&
        (isOptimismWithdrawal(tx) || isOptimismForcedWithdrawal(tx)) && (
          <Prove tx={tx} />
        )}
      {item.buttonComponent === ButtonComponent.Finalise &&
        (isOptimismWithdrawal(tx) || isOptimismForcedWithdrawal(tx)) && (
          <Finalise tx={tx} />
        )}
      {item.buttonComponent === ButtonComponent.Finalise &&
        (isArbitrumWithdrawal(tx) || isArbitrumForcedWithdrawal(tx)) && (
          <FinaliseArbitrum tx={tx} />
        )}
      {item.buttonComponent === ButtonComponent.Redeem &&
        (isArbitrumDeposit(tx) || isArbitrumForcedWithdrawal(tx)) && (
          <RedeemArbitrum tx={tx} />
        )}
      {item.buttonComponent === ButtonComponent.Mint && isCctpBridge(tx) && (
        <MintCctp tx={tx} />
      )}
    </div>
  );
};

const getToken = (
  tokens: MultiChainToken[],
  {
    chainId,
    tokenAddress,
  }: {
    chainId: number;
    tokenAddress: string;
  },
  destChainId?: number
) => {
  let match: Token | null = null;
  for (const t of tokens) {
    if (
      destChainId &&
      t[chainId]?.address &&
      t[destChainId]?.address &&
      isAddressEqual(t[chainId]!.address, tokenAddress as Address)
    ) {
      return t[chainId]!;
    }

    if (
      t[chainId]?.address &&
      isAddressEqual(t[chainId]!.address, tokenAddress as Address)
    ) {
      match = t[chainId]!;
    }
  }

  return match;
};

const getNativeToken = (tokens: MultiChainToken[], chainId: number) => {
  return tokens.find((x) => {
    return x[chainId] && isNativeToken(x);
  })?.[chainId];
};
function useToken(tx: Transaction, tokens: MultiChainToken[]) {
  const deployment = useDeploymentById(
    isAcrossBridge(tx) || isCctpBridge(tx)
      ? ""
      : isForcedWithdrawal(tx)
        ? tx.deposit.deploymentId
        : tx.deploymentId
  );
  const gasToken = useGasTokenForDeployment(deployment?.id);

  const chains = useFromTo(tx);
  if (!chains) {
    return null;
  }

  const [from, to] = chains;

  if (isCctpBridge(tx)) {
    return getToken(tokens, {
      chainId: tx.from.id,
      tokenAddress: tx.token,
    });
  }

  if (isAcrossBridge(tx)) {
    if (tx.metadata.data.isEth) {
      return getNativeToken(tokens, from.id);
    }

    return getToken(
      tokens,
      {
        chainId: from.id,
        tokenAddress: tx.metadata.data.inputTokenAddress,
      },
      to.id
    );
  }

  const metadata =
    isForcedWithdrawal(tx) && tx.withdrawal
      ? tx.withdrawal.metadata
      : isForcedWithdrawal(tx)
        ? tx.deposit.metadata
        : tx.metadata;

  return match(metadata)
    .with({ type: "eth-deposit" }, () => {
      if (gasToken) {
        return isDeposit(tx)
          ? gasToken[deployment?.l1.id ?? 0]
          : gasToken[deployment?.l2.id ?? 0];
      }
      return getNativeToken(tokens, from.id);
    })
    .with({ type: "token-deposit" }, (m) => {
      const dto = m as TokenDepositDto;
      const tokenAddress = isDeposit(tx)
        ? dto.data.l1TokenAddress
        : dto.data.l2TokenAddress;
      return getToken(
        tokens,
        {
          chainId: from.id,
          tokenAddress,
        },
        to.id
      );
    })
    .otherwise(() => null);
}

function useNft(tx: Transaction) {
  if (isCctpBridge(tx)) {
    return null;
  }

  const metadata =
    isForcedWithdrawal(tx) && tx.withdrawal
      ? tx.withdrawal.metadata
      : isForcedWithdrawal(tx)
        ? tx.deposit.metadata
        : tx.metadata;

  if (metadata.type === "nft-deposit") {
    return metadata as NftDepositDto;
  }

  return null;
}

function getDepositAmount(tx: Transaction, token: Token | null | undefined) {
  let amount: string;
  let decimals: number;
  let symbol: string | undefined;

  if (isCctpBridge(tx)) {
    amount = tx.amount;
    decimals = 6;
    symbol = token?.symbol ?? "USDC";
  } else if (tx.type === "across-bridge") {
    amount = tx.metadata.data.inputAmount;
    decimals = token?.decimals ?? 18;
    symbol = token?.symbol ?? "ETH";
  } else {
    const metadata =
      isForcedWithdrawal(tx) && tx.withdrawal
        ? tx.withdrawal.metadata
        : isForcedWithdrawal(tx)
          ? tx.deposit.metadata
          : tx.metadata;

    if (metadata.type === "eth-deposit") {
      amount = (metadata as EthDepositDto).data.amount;
      decimals = 18;
      symbol = token?.symbol ?? "ETH";
    } else if (metadata.type === "nft-deposit") {
      return `#${(metadata as NftDepositDto).data.tokenId}`;
    } else {
      const dto = metadata as TokenDepositDto;
      amount = dto.data.amount;
      decimals = token?.decimals ?? 18;
      symbol = token?.symbol;
    }
  }

  const formatted = formatDecimals(
    parseFloat(formatUnits(BigInt(amount), decimals))
  );
  return `${formatted} ${symbol}`;
}

export const TransactionRow = ({ tx }: { tx: Transaction }) => {
  const tokens = useAllTokens();

  const token = useToken(tx, tokens);
  const nft = useNft(tx);

  const [expanded, setExpanded] = useState(false);

  const title = useTxTitle(tx);
  const progressRows = useProgressRows()(tx);

  const inProgressItem = progressRows.find(
    (x) => x.status === ProgressRowStatus.InProgress
  );
  const revertedItem = progressRows.find(
    (x) => x.status === ProgressRowStatus.Reverted
  );

  const deployment = useDeploymentById(
    isAcrossBridge(tx)
      ? ""
      : isForcedWithdrawal(tx)
        ? tx.deposit.deploymentId
        : tx.deploymentId
  );
  const chains = useFromTo(tx);
  if (!chains) {
    return null;
  }

  const [from, to] = chains;

  const indicatorStyles = clsx(
    `w-4 h-4 outline outline-2 outline-zinc-50 dark:outline-zinc-900 absolute -right-1 bottom-0 rounded-full bg-card fill-green-400`,
    !!inProgressItem && "fill-muted-foreground",
    !!revertedItem && "fill-red-400"
  );

  return (
    <div className="flex p-6 border-b relative" key={tx.id}>
      <div className="relative h-fit mr-4">
        {nft ? (
          <>
            <NftImage
              nft={{
                ...nft,
                localChainId: from.id.toString(),
                remoteChainId: to.id.toString(),
              }}
              className="h-12 w-12 rounded-md"
            />
          </>
        ) : (
          <TokenIcon
            token={token ?? null}
            className="h-12 w-12 min-h-12 min-w-12"
          />
        )}
        {isDeposit(tx) ||
        (isCctpBridge(tx) && tx.from.id === deployment?.l1.id) ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            className={indicatorStyles}
          >
            <g clipPath="url(#clip0_470_1595)">
              <path d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm3.305 8.8c-.23 0-.44-.09-.6-.27l-1.91-2.16v5.375c0 .44-.36.8-.8.8-.44 0-.8-.36-.8-.8V6.37l-1.91 2.16a.802.802 0 01-1.2-1.06L7.33 3.795c.16-.18.37-.34.66-.34.29 0 .5.16.66.34l3.245 3.675a.802.802 0 01-.6 1.33h.01z"></path>
            </g>
            <defs>
              <clipPath id="clip0_470_1595">
                <path fill="#fff" d="M0 0H16V16H0z"></path>
              </clipPath>
            </defs>
          </svg>
        ) : isWithdrawal(tx) ||
          (isCctpBridge(tx) && tx.from.id === deployment?.l2.id) ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            className={indicatorStyles}
          >
            <g clipPath="url(#clip0_470_1598)">
              <path d="M8 16c4.42 0 8-3.58 8-8s-3.58-8-8-8-8 3.58-8 8 3.58 8 8 8zM4.695 7.2c.23 0 .44.09.6.27l1.91 2.16V4.255c0-.44.36-.8.8-.8.44 0 .8.36.8.8V9.63l1.91-2.16a.802.802 0 011.2 1.06L8.67 12.205c-.16.18-.37.34-.66.34-.29 0-.5-.16-.66-.34L4.105 8.53a.802.802 0 01.6-1.33h-.01z"></path>
            </g>
            <defs>
              <clipPath id="clip0_470_1598">
                <path fill="#fff" d="M0 0H16V16H0z"></path>
              </clipPath>
            </defs>
          </svg>
        ) : isAcrossBridge(tx) ? (
          // Superfast Aross bridge icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className={indicatorStyles}
          >
            <g clip-path="url(#clip0_83_174)">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM6 13.6419C6 13.8392 6.12849 14 6.29248 14H6.29417C6.37532 14 6.45816 13.9695 6.51395 13.9023L11.9087 7.48414C11.9696 7.41699 12 7.31728 12 7.22571C12 7.01611 11.8614 6.86756 11.6974 6.86756H7.6754L10.2096 2.56775C10.2451 2.5067 10.2553 2.43141 10.2553 2.36425C10.2553 2.15465 10.142 2 9.95774 2C9.88166 2 9.80896 2.02442 9.75317 2.08547L4.09806 8.50975C4.0355 8.58301 4 8.67662 4 8.77429C4 8.97168 4.13356 9.13244 4.29755 9.13244H8.13863L6.04057 13.4628C6.01522 13.5177 6 13.5808 6 13.6419Z"
              />
            </g>
            <defs>
              <clipPath id="clip0_83_174">
                <rect width="16" height="16" fill="white" />
              </clipPath>
            </defs>
          </svg>
        ) : (
          // forced withdrawal
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className={indicatorStyles}
          >
            <g clip-path="url(#clip0_83_182)">
              <circle cx="8" cy="8" r="8" />
              <path
                d="M7.9966 10.5C10.712 10.5 14 9.81282 14 8.5C14 7.18718 10.7256 6.5 7.9966 6.5C5.54418 6.5 2 7.10086 2 8.5C2 9.81282 5.27442 10.5 7.9966 10.5Z"
                fill="black"
                stroke="black"
                stroke-width="0.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10.2252 9.763C11.5405 9.763 12.6067 8.69675 12.6067 7.3815C12.6067 6.06625 11.5405 5 10.2252 5C8.90995 5 7.84375 6.06625 7.84375 7.3815C7.84375 8.69675 8.90995 9.763 10.2252 9.763Z"
                fill="white"
                stroke="black"
                stroke-width="0.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10.3374 7.52321C10.6553 7.52321 10.913 7.26546 10.913 6.94756C10.913 6.62961 10.6553 6.37186 10.3374 6.37186C10.0194 6.37186 9.76172 6.62961 9.76172 6.94756C9.76172 7.26546 10.0194 7.52321 10.3374 7.52321Z"
                fill="black"
              />
              <path
                d="M5.4264 9.763C6.7417 9.763 7.8079 8.69675 7.8079 7.3815C7.8079 6.06625 6.7417 5 5.4264 5C4.11115 5 3.04492 6.06625 3.04492 7.3815C3.04492 8.69675 4.11115 9.763 5.4264 9.763Z"
                fill="white"
                stroke="black"
                stroke-width="0.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5.54491 7.69121C5.86286 7.69121 6.12056 7.43346 6.12056 7.11551C6.12056 6.79761 5.86286 6.53986 5.54491 6.53986C5.22696 6.53986 4.96924 6.79761 4.96924 7.11551C4.96924 7.43346 5.22696 7.69121 5.54491 7.69121Z"
                fill="black"
              />
            </g>
            <defs>
              <clipPath id="clip0_83_182">
                <rect width="16" height="16" fill="white" />
              </clipPath>
            </defs>
          </svg>
        )}
      </div>

      <div className="w-full ">
        <div
          className="flex flex-col gap-1 cursor-pointer"
          onClick={() => setExpanded((e) => !e)}
        >
          <div className="flex justify-between text-sm">
            <h3 className="font-heading">{title}</h3>
            <div className="flex items-center gap-1">
              {tx.type === "cctp-bridge" && <CctpBadge />}
              {tx.type === "across-bridge" && <AcrossBadge />}
              <span className="text-right">{getDepositAmount(tx, token)}</span>
            </div>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <div className="flex items-center">
              {tx.type === "across-bridge" ? (
                <>
                  <FastNetworkIcon
                    chain={from}
                    className="h-4 w-4 mr-1"
                    height={12}
                    width={12}
                  />
                </>
              ) : (
                <NetworkIcon
                  chain={from}
                  deployment={deployment}
                  className="h-4 w-4 mr-1"
                  height={12}
                  width={12}
                />
              )}
              <span className="text-xs">{from.name}</span>
            </div>
            <div className="mx-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="fill-muted-foreground w-2.5 h-auto"
              >
                <path d="M16 7.99276C16 8.49014 15.7134 8.76539 15.4174 8.97304L8.57699 13.7972C8.37966 13.9276 8.14946 14 7.93804 14C7.25682 14 6.8011 13.4302 6.8011 12.8314C6.8011 12.4644 6.97023 12.1022 7.2991 11.8656L11.1234 9.16137H1.13694C0.498 9.16137 0 8.63501 0 7.99276C0 7.3505 0.498 6.82414 1.13694 6.82414H11.1234L7.2991 4.13441C6.97023 3.90262 6.8011 3.53561 6.8011 3.16861C6.8011 2.54085 7.3132 2 7.93804 2C8.14946 2 8.37966 2.05795 8.57699 2.20282L15.4174 6.99799C15.7322 7.21529 16 7.58229 16 7.99276Z" />
              </svg>{" "}
            </div>

            <div className="flex items-center">
              {tx.type === "across-bridge" ? (
                <FastNetworkIcon
                  chain={to}
                  className="h-4 w-4 mr-1"
                  height={12}
                  width={12}
                />
              ) : (
                <NetworkIcon
                  chain={to}
                  deployment={deployment}
                  className="h-4 w-4 mr-1"
                  height={12}
                  width={12}
                />
              )}
              <span className="text-xs">{to.name}</span>
            </div>
            <button className="ml-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                className={`fill-muted-foreground transition-all ${
                  expanded ? "rotate-180" : "rotate-0"
                }`}
              >
                <path
                  d="M8 0a8 8 0 108 8 8.01 8.01 0 00-8-8zm3.592 6.186a.89.89 0 010 1.26l-2.963 2.962a.889.889 0 01-1.26 0L4.408 7.445a.89.89 0 111.26-1.259L8 8.519l2.334-2.335a.89.89 0 011.258.002z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        {expanded ? (
          <div className="space-y-2 mt-4">
            {progressRows.map((item) => (
              <TransactionProgressRow key={item.label} item={item} tx={tx} />
            ))}
          </div>
        ) : inProgressItem ? (
          <div className="mt-4">
            <TransactionProgressRow item={inProgressItem} tx={tx} />
          </div>
        ) : null}
      </div>
    </div>
  );
};
