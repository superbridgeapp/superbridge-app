import { useEffect, useMemo, useState } from "react";
import { FeeValuesType, parseUnits } from "viem";
import { berachainTestnetbArtio, scroll } from "viem/chains";
import { useEstimateFeesPerGas as useWagmiEstimateFeesPerGas } from "wagmi";

export const useEstimateFeesPerGas = (
  chainId: number | undefined | null,
  enabled = true
) => {
  const [type, setType] = useState<FeeValuesType>("eip1559");

  const fees = useWagmiEstimateFeesPerGas({
    chainId: chainId || undefined,
    type,
    query: {
      enabled,
      staleTime: 30_000,
    },
  });

  useEffect(() => {
    if (fees.failureReason?.message.includes("does not support")) {
      setType("legacy");
    }
  }, [fees.failureReason]);

  return useMemo(() => {
    if (!fees.data) return fees;

    const copy = { ...fees.data };
    if (copy.maxFeePerGas) {
      if (chainId === scroll.id) {
        copy.maxFeePerGas *= BigInt(10);
      } else if (chainId === berachainTestnetbArtio.id) {
        copy.maxFeePerGas =
          copy.maxFeePerGas < parseUnits("0.2", 9)
            ? parseUnits("0.2", 9)
            : copy.maxFeePerGas;
        copy.maxPriorityFeePerGas =
          copy.maxPriorityFeePerGas < parseUnits("0.2", 9)
            ? parseUnits("0.2", 9)
            : copy.maxPriorityFeePerGas;
      } else {
        copy.maxFeePerGas += copy.maxFeePerGas / BigInt(20);
      }
    }

    return {
      ...fees,
      data: copy,
    };
  }, [fees.data, fees.error, fees.isFetching]);
};
