import { formatUnits } from "viem";
import { useEstimateFeesPerGas } from "wagmi";

import { useConfigState } from "@/state/config";

import { useFromChain } from "./use-chain";
import { useDeployment } from "./use-deployment";
import { useBridge } from "./bridge/use-bridge";

// If gas estimation is failing, likely because they don't
// have enough ETH, we still want to provide a rough gas estimate.
// Important we don't submit this though and use the actual estimatedGas
const DEFAULT_GAS_ESTIMATION = BigInt(200_000);

export const useNetworkFee = () => {
  const { gas } = useBridge();
  const deployment = useDeployment();
  const withdrawing = useConfigState.useWithdrawing();
  const forceViaL1 = useConfigState.useForceViaL1();
  const from = useFromChain();

  const initiatingChainId =
    forceViaL1 && withdrawing ? deployment?.l1.id : from?.id;

  const feeData = useEstimateFeesPerGas({
    chainId: initiatingChainId,
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
