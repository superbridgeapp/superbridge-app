import { Chain } from "viem";
import { useWalletClient } from "wagmi";

import { ChainDto } from "@/codegen/model";

export const useSwitchChain = () => {
  const wallet = useWalletClient();

  return async (chain: Chain | ChainDto) => {
    try {
      await wallet.data?.switchChain(chain);
    } catch (e) {
      if (e.message.includes("Unrecognized chain ID")) {
        // MetaMask doesn't like native currency symbols of length 1
        if (chain.nativeCurrency.symbol.length === 1) {
          chain.nativeCurrency.symbol = `${chain.nativeCurrency.symbol}.`;
        }
        await wallet.data?.addChain({ chain: chain as Chain });
      }
    }
  };
};
