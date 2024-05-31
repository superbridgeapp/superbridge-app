import { SpokePoolAbi } from "@/abis/across/SpokePool";
import { encodeFunctionData } from "viem";

export const useAcrossArgs = () => {
  encodeFunctionData({
    abi: SpokePoolAbi,
    fun,
  });
};
