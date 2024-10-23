import { match } from "ts-pattern";
import { Address, isAddressEqual } from "viem";

import { TokenDepositDto } from "@/codegen/model";
import { useTxFromTo } from "@/hooks/activity/use-tx-from-to";
import { MultiChainToken } from "@/types/token";
import { Transaction } from "@/types/transaction";
import {
  isAcrossBridge,
  isCctpBridge,
  isDeposit,
  isForcedWithdrawal,
  isHyperlaneBridge,
  isLzBridge,
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
  let match: MultiChainToken | null = null;
  for (const t of tokens) {
    if (
      destChainId &&
      t[chainId]?.address &&
      t[destChainId]?.address &&
      isAddressEqual(t[chainId]!.address as Address, tokenAddress as Address)
    ) {
      return t;
    }

    if (
      t[chainId]?.address &&
      isAddressEqual(t[chainId]!.address as Address, tokenAddress as Address)
    ) {
      match = t;
    }
  }

  return match;
};

const getNativeToken = (tokens: MultiChainToken[], chainId: number) =>
  tokens.find((x) => x[chainId] && isNativeToken(x));

export function useTxMultichainToken(tx: Transaction | null | undefined) {
  const tokens = useAllTokens();

  const chains = useTxFromTo(tx);
  if (!chains || !tx) {
    return null;
  }

  const { from, to } = chains;

  if (isCctpBridge(tx)) {
    return getToken(
      tokens.data,
      {
        chainId: tx.from.id,
        tokenAddress: tx.token,
      },
      tx.to.id
    );
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
      return isAddressEqual(
        src.hyperlane?.router as Address,
        tx.token as Address
      );
    });

    return t ?? null;
  }

  if (isLzBridge(tx)) {
    const t = tokens.data.find((x) => {
      const src = x[from.id];
      if (!src?.lz?.adapter) {
        return false;
      }
      return isAddressEqual(src.lz.adapter as Address, tx.token as Address);
    });

    return t ?? null;
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

export function useTxToken(tx: Transaction | null | undefined) {
  const chains = useTxFromTo(tx);
  const token = useTxMultichainToken(tx);

  if (!chains) {
    return null;
  }

  return token?.[chains.from.id] ?? null;
}
