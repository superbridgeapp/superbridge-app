import { formatUnits } from "viem";

import { EthDepositDto, NftDepositDto, TokenDepositDto } from "@/codegen/model";
import { Token } from "@/types/token";
import { Transaction } from "@/types/transaction";
import { formatDecimals } from "@/utils/format-decimals";
import {
  isCctpBridge,
  isForcedWithdrawal,
  isHyperlaneBridge,
  isLzBridge,
} from "@/utils/guards";

export function useTxAmount(
  tx: Transaction | null | undefined,
  token: Token | null | undefined
) {
  let amount: string;
  let decimals: number;
  let symbol: string | undefined;

  if (!tx || !token) {
    return null;
  }

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
  } else if (isLzBridge(tx)) {
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
