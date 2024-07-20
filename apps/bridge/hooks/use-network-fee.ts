import { formatUnits } from "viem";
import { useEstimateFeesPerGas } from "wagmi";

import { useBridge } from "./bridge/use-bridge";
import { useInitiatingChainId } from "./use-initiating-chain-id";

// If gas estimation is failing, likely because they don't
// have enough ETH, we still want to provide a rough gas estimate.
// Important we don't submit this though and use the actual estimatedGas
const DEFAULT_GAS_ESTIMATION = BigInt(200_000);

export const useNetworkFee = () => {
  const { gas } = useBridge();

  const initiatingChainId = useInitiatingChainId();

  const feeData = useEstimateFeesPerGas({
    chainId: initiatingChainId || undefined,
  });

  let networkFee = 0;
  if (feeData.data) {
    const gwei =
      (feeData.data.gasPrice ?? feeData.data.maxFeePerGas)! *
      (gas ?? DEFAULT_GAS_ESTIMATION);
    networkFee = parseFloat(formatUnits(gwei, 18));
  }

  return networkFee;
};
