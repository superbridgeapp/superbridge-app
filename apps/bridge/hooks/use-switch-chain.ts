import { Chain } from "viem";
import { useWalletClient } from "wagmi";

import { ChainDto } from "@/codegen/model";

export const useSwitchChain = () => {
  const wallet = useWalletClient();

  return async (chain: Chain | ChainDto) => {
    try {
      await wallet.data?.switchChain(chain);
    } catch (e: any) {
      if (e.message.includes("Unrecognized chain ID")) {
        const nativeCurrency = { ...chain.nativeCurrency };

        // MetaMask doesn't like non 18 decimal
        nativeCurrency.decimals = 18;

        const chain_ = { ...chain, nativeCurrency } as Chain;

        await wallet.data?.addChain({ chain: chain_ });
      }
    }
  };
};
