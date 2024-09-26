import { formatUnits } from "viem";

import { Token } from "@/types/token";
import { Transaction } from "@/types/transaction";
import { formatDecimals } from "@/utils/format-decimals";
import { isAcrossBridge } from "@/utils/guards";

import { useTxAmount } from "./use-tx-amount";

export function useTxAmountOutput(
  tx: Transaction | null | undefined,
  token: Token | null | undefined
) {
  const inputAmount = useTxAmount(tx, token);

  if (!tx || !token) {
    return null;
  }

  if (isAcrossBridge(tx)) {
    const formatted = formatDecimals(
      parseFloat(
        formatUnits(
          BigInt(tx.metadata.data.outputAmount),
          token?.decimals ?? 18
        )
      )
    );

    console.log(tx.metadata.data.outputAmount, formatted);

    return {
      formatted,
      raw: tx.metadata.data.outputAmount,
      text: `${formatted} ${token?.symbol ?? "ETH"}`,
    };
  }

  return inputAmount;
}
