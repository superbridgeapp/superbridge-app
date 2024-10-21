import { useMemo } from "react";
import { FeeValuesType, parseUnits } from "viem";
import { berachainTestnetbArtio, scroll, sepolia } from "viem/chains";
import { useEstimateFeesPerGas as useWagmiEstimateFeesPerGas } from "wagmi";

export const useEstimateFeesPerGas = (
  chainId: number | undefined | null,
  type: FeeValuesType = "eip1559",
  enabled = true
) => {
  const fees = useWagmiEstimateFeesPerGas({
    chainId: chainId || undefined,
    type,
    query: {
      enabled,
    },
  });

  return useMemo(() => {
    if (!fees.data) return fees;

    const copy = { ...fees.data };
    if (copy.maxFeePerGas) {
      if (chainId === sepolia.id) {
        copy.maxFeePerGas *= BigInt(10);
      }

      if (chainId === scroll.id) {
        copy.maxFeePerGas *= BigInt(10);
      }

      if (chainId === berachainTestnetbArtio.id) {
        copy.maxFeePerGas =
          copy.maxFeePerGas < parseUnits("0.2", 9)
            ? parseUnits("0.2", 9)
            : copy.maxFeePerGas;
        copy.maxPriorityFeePerGas =
          copy.maxPriorityFeePerGas < parseUnits("0.2", 9)
            ? parseUnits("0.2", 9)
            : copy.maxPriorityFeePerGas;
      }
    }

    return {
      ...fees,
      data: copy,
    };
  }, [fees.data]);
};
