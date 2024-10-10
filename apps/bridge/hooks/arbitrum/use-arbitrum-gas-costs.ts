import { useEstimateFeesPerGas } from "wagmi";

import { scaleToNativeTokenDecimals } from "@/utils/native-token-scaling";

import { useFromChain, useToChain } from "../use-chain";
import { useIsArbitrumDeposit } from "../use-withdrawing";

export const useArbitrumGasCostsInWei = () => {
  const isArbitrumDeposit = useIsArbitrumDeposit();
  const from = useFromChain();
  const to = useToChain();

  const l1FeeData = useEstimateFeesPerGas({
    chainId: from?.id,
    query: {
      enabled: isArbitrumDeposit,
    },
  });
  const l2FeeData = useEstimateFeesPerGas({
    chainId: to?.id,
    query: {
      enabled: isArbitrumDeposit,
    },
  });

  const l1GasLimit = BigInt(100_000);
  const l2GasLimit = BigInt(300_000);
  const l1GasCost =
    (l1FeeData.data?.maxFeePerGas ?? BigInt(0)) +
    (l1FeeData.data?.maxFeePerGas ?? BigInt(0)) / BigInt(20);
  const l2GasCost = (l2FeeData.data?.maxFeePerGas ?? BigInt(0)) * BigInt(3);
  const maxSubmissionCost = l1GasCost * l1GasLimit;

  return {
    l1GasLimit,
    l2GasLimit,
    l1GasCost,
    l2GasCost,

    maxSubmissionCost,
    extraAmount: scaleToNativeTokenDecimals({
      amount: l2GasCost * l2GasLimit + maxSubmissionCost,
      decimals: to?.nativeCurrency.decimals ?? 18,
    }),
  };
};
