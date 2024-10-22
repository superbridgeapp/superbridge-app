import { parseUnits } from "viem";
import { berachainTestnetbArtio, scroll } from "viem/chains";

import { useFromChain, useToChain } from "../use-chain";
import { useInitiatingChainId } from "../use-initiating-chain-id";
import { useEstimateFeesPerGas } from "./use-estimate-fees-per-gas";

export const useGasPrice = () => {
  const initiatingChainId = useInitiatingChainId();
  const from = useFromChain();
  const to = useToChain();
  const fromFeeData = useEstimateFeesPerGas(initiatingChainId);

  const params:
    | {
        gasPrice: bigint | undefined;
      }
    | {
        maxFeePerGas: bigint | undefined;
        maxPriorityFeePerGas: bigint | undefined;
      } = {
    gasPrice: fromFeeData.data?.gasPrice,
    maxFeePerGas: (() => {
      if (!fromFeeData.data?.maxFeePerGas || !from || !to) return undefined;

      if (from.id === scroll.id)
        return fromFeeData.data.maxFeePerGas * BigInt(10);

      if (
        from.id === berachainTestnetbArtio.id &&
        to.id === 50333 /* pretzel */
      )
        return fromFeeData.data.maxFeePerGas < parseUnits("0.2", 9)
          ? parseUnits("0.2", 9)
          : fromFeeData.data.maxFeePerGas;

      return fromFeeData.data.maxFeePerGas;
    })(),
    maxPriorityFeePerGas: (() => {
      if (!fromFeeData.data?.maxPriorityFeePerGas || !from || !to)
        return undefined;

      if (
        from.id === berachainTestnetbArtio.id &&
        to.id === 50333 /* pretzel */
      )
        return fromFeeData.data.maxPriorityFeePerGas < parseUnits("0.2", 9)
          ? parseUnits("0.2", 9)
          : fromFeeData.data.maxPriorityFeePerGas;

      return fromFeeData.data.maxPriorityFeePerGas;
    })(),
  };

  return params;
};
