import clsx from "clsx";
import { formatDistanceToNow } from "date-fns";
import { FC } from "react";
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
  TransactionStatus,
} from "@/codegen/model";
import { useTxTimestamp } from "@/hooks/activity/use-tx-timestamp";
import { useFinaliseArbitrum } from "@/hooks/arbitrum/use-arbitrum-finalise";
import { useRedeemArbitrum } from "@/hooks/arbitrum/use-arbitrum-redeem";
import { useMintCctp } from "@/hooks/cctp/use-cctp-mint";
import { useFinaliseOptimism } from "@/hooks/optimism/use-optimism-finalise";
import { useProveOptimism } from "@/hooks/optimism/use-optimism-prove";
import { useAllTokens } from "@/hooks/tokens/use-all-tokens";
import { useGasTokenForDeployment } from "@/hooks/use-approve-gas-token";
import { useDeploymentById } from "@/hooks/use-deployment-by-id";
import { useFromTo } from "@/hooks/use-from-to";
import { useSwitchChain } from "@/hooks/use-switch-chain";
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
  isHyperlaneBridge,
  isHyperlaneToken,
  isOptimismForcedWithdrawal,
  isOptimismWithdrawal,
  isWithdrawal,
} from "@/utils/guards";
import { isNativeToken } from "@/utils/is-eth";
import {
  ButtonComponent,
  ExpandedItem,
  ProgressRowStatus,
} from "@/utils/progress-rows/common";

import inProgress from "../animation/loading.json";
import { NetworkIcon } from "./network-icon";
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
    isAcrossBridge(tx) || isCctpBridge(tx) || isHyperlaneBridge(tx)
      ? ""
      : isForcedWithdrawal(tx)
      ? tx.deposit.deploymentId
      : tx.deploymentId
  );
  const gasToken = useGasTokenForDeployment(deployment?.id);

  const [from, to] = useFromTo(tx);

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

  if (isHyperlaneBridge(tx)) {
    const t = tokens.find((x) => {
      const src = x[from.id];
      if (!src || !isHyperlaneToken(src)) {
        return false;
      }
      return (
        // when they come from the backend
        isAddressEqual(src.hyperlane.router, tx.token as Address) ||
        // when we add a pending tx
        isAddressEqual(src.address, tx.token as Address)
      );
    });

    return t?.[from.id] ?? null;
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
  } else if (isHyperlaneBridge(tx)) {
    amount = tx.amount;
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

const useInitiatingTx = (tx: Transaction) => {
  if (isAcrossBridge(tx)) return tx.deposit;
  if (isHyperlaneBridge(tx)) return tx.send;
  if (isDeposit(tx)) return tx.deposit;
  if (isWithdrawal(tx)) return tx.withdrawal;
  if (isForcedWithdrawal(tx)) return tx.deposit.deposit;
  return tx.bridge;
};

const useFinalisingTx = (tx: Transaction) => {
  if (isAcrossBridge(tx)) return tx.fill;
  if (isHyperlaneBridge(tx)) return tx.receive;
  if (isDeposit(tx)) return tx.relay;
  if (isWithdrawal(tx)) return tx.finalise;
  if (isForcedWithdrawal(tx)) return tx.withdrawal?.finalise;
  return tx.relay;
};

const useIsSuccessfulBridge = (tx: Transaction) => {
  const finalTx = useFinalisingTx(tx);
  return finalTx?.status === TransactionStatus.confirmed;
};

const useIsInProgress = (tx: Transaction) => {
  const finalTx = useFinalisingTx(tx);
  return !finalTx;
};

const useProgressBars = (
  tx: Transaction
): { status: "done" | "in-progress" | "not-started" }[] => {
  const initiatingTx = useInitiatingTx(tx);
  const finalisingTx = useFinalisingTx(tx);
  const proveTx = isOptimismWithdrawal(tx)
    ? tx.prove
    : isOptimismForcedWithdrawal(tx)
    ? tx.withdrawal?.prove
    : null;

  const bars: { status: "done" | "in-progress" | "not-started" }[] = [];
  if (initiatingTx.timestamp) {
    bars.push({ status: "done" });
  } else {
    bars.push({ status: "in-progress" });
  }

  if (proveTx) {
    if (proveTx.timestamp) {
      bars.push({ status: "done" });
    } else {
      bars.push({ status: "in-progress" });
    }
  }

  if (finalisingTx?.timestamp) {
    bars.push({ status: "done" });
  } else {
    bars.push({ status: "in-progress" });
  }

  return bars;
};

export const TransactionRowV2 = ({ tx }: { tx: Transaction }) => {
  const tokens = useAllTokens();

  const token = useToken(tx, tokens);

  const timestamp = useTxTimestamp(tx);
  const [from, to] = useFromTo(tx);

  const isSuccessful = useIsSuccessfulBridge(tx);
  const isInProgress = useIsInProgress(tx);
  const finalizingTx = useFinalisingTx(tx);
  const bars = useProgressBars(tx);

  return (
    <div className="flex flex-col p-6 border-b relative" key={tx.id}>
      <div>Time: {formatDistanceToNow(timestamp)} ago</div>
      <div>
        Icon:
        <TokenIcon
          token={token ?? null}
          className="h-12 w-12 min-h-12 min-w-12"
        />
      </div>
      <div>
        From:{" "}
        <NetworkIcon
          chain={from}
          className="h-4 w-4 mr-1"
          height={12}
          width={12}
        />
      </div>
      <div>
        To:{" "}
        <NetworkIcon
          chain={to}
          className="h-4 w-4 mr-1"
          height={12}
          width={12}
        />
      </div>
      <div>Amount: {getDepositAmount(tx, token)}</div>

      {isSuccessful ? (
        <div>
          Bridge successful :{" "}
          {formatDistanceToNow(finalizingTx?.timestamp ?? 0)} ago
        </div>
      ) : isInProgress ? (
        <div>
          <div className="w-full flex items-center gap-2">
            {bars.map((bar) => (
              <div
                className={clsx(
                  "w-full h-1",
                  bar.status === "done" && "bg-blue-500",
                  bar.status === "in-progress" && "bg-orange-500 animate-pulse",
                  bar.status === "not-started" && "bg-gray-500"
                )}
              ></div>
            ))}
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};
