import { ChainDto } from "@/codegen/model";
import { useWalletClient, Chain } from "wagmi";

export const useSwitchChain = () => {
  const wallet = useWalletClient();

  return async (chain: Chain | ChainDto) => {
    try {
      await wallet.data?.switchChain(chain);
    } catch (e: any) {
      if (e.message.includes("Unrecognized chain ID")) {
        await wallet.data?.addChain({ chain: chain as Chain });
      }
    }
  };
};
