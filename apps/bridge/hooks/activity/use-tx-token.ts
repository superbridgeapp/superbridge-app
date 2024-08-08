import { match } from "ts-pattern";
import { Address, isAddressEqual } from "viem";

import { BridgeableTokenDto, TokenDepositDto } from "@/codegen/model";
import { useTxFromTo } from "@/hooks/activity/use-tx-from-to";
import { MultiChainToken } from "@/types/token";
import { Transaction } from "@/types/transaction";
import {
  isAcrossBridge,
  isCctpBridge,
  isDeposit,
  isForcedWithdrawal,
  isHyperlaneBridge,
} from "@/utils/guards";
import { isNativeToken } from "@/utils/tokens/is-eth";

import { useAllTokens } from "../tokens/use-all-tokens";

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
  let match: BridgeableTokenDto | null = null;
  for (const t of tokens) {
    if (
      destChainId &&
      t[chainId]?.address &&
      t[destChainId]?.address &&
      isAddressEqual(t[chainId]!.address as Address, tokenAddress as Address)
    ) {
      return t[chainId]!;
    }

    if (
      t[chainId]?.address &&
      isAddressEqual(t[chainId]!.address as Address, tokenAddress as Address)
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

export function useTxToken(tx: Transaction | null | undefined) {
  const tokens = useAllTokens();

  const chains = useTxFromTo(tx);
  if (!chains || !tx) {
    return null;
  }

  const { from, to } = chains;

  if (isCctpBridge(tx)) {
    return getToken(tokens.data, {
      chainId: tx.from.id,
      tokenAddress: tx.token,
    });
  }

  if (isAcrossBridge(tx)) {
    if (tx.metadata.data.isEth) {
      return getNativeToken(tokens.data, from.id);
    }

    return getToken(
      tokens.data,
      {
        chainId: from.id,
        tokenAddress: tx.metadata.data.inputTokenAddress,
      },
      to.id
    );
  }

  if (isHyperlaneBridge(tx)) {
    const t = tokens.data.find((x) => {
      const src = x[from.id];
      if (!src) {
        return false;
      }
      return (
        // when they come from the backend
        isAddressEqual(src.hyperlane?.router as Address, tx.token as Address) ||
        // when we add a pending tx
        isAddressEqual(src.address as Address, tx.token as Address)
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
      return getNativeToken(tokens.data, from.id);
    })
    .with({ type: "token-deposit" }, (m) => {
      const dto = m as TokenDepositDto;
      const tokenAddress = isDeposit(tx)
        ? dto.data.l1TokenAddress
        : dto.data.l2TokenAddress;
      return getToken(
        tokens.data,
        {
          chainId: from.id,
          tokenAddress,
        },
        to.id
      );
    })
    .otherwise(() => null);
}
