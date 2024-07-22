import { useEffect } from "react";

import { useConfigState } from "@/state/config";
import { isNativeToken } from "@/utils/is-eth";

import { useGasToken } from "./use-approve-gas-token";
import { useFromChain, useToChain } from "./use-chain";
import { useAllTokens } from "./use-tokens";

/**
 * We want to find the token the user has specified and set some state accordingly,
 * 
 * https://superbridge.app/base/USDC -> sets to deposit USDC on Base
 * https://superbridge.app/base/{USDC L1 address} -> sets to deposit USDC on Base
 * https://superbridge.app/base/{USDC L2 address} -> sets to withdraw USDC from Base
 * 
 * https://somebridge.xyz/USDC -> sets to deposit USDC on network XYZ
 * https://somebridge.xyz/{USDC L1 address} -> sets to deposit USDC on network XYZ
 * https://somebridge.xyz/{USDC L2 address} -> sets to withdraw USDC from network XYZ

 */
export const useInitialiseToken = () => {
  const setToken = useConfigState.useSetToken();
  const from = useFromChain();
  const to = useToChain();
  const tokens = useAllTokens();
  const arbitrumGasToken = useGasToken();

  useEffect(() => {
    if (!tokens.length || !from || !to) {
      return;
    }

    if (arbitrumGasToken) {
      setToken(arbitrumGasToken);
      return;
    }

    const t =
      tokens.find(
        (x) => isNativeToken(x) && !!x[from?.id ?? 0] && !!x[to?.id ?? 0]
      ) ?? tokens[0];
    if (t) {
      setToken(t);
    }
  }, [from, to, tokens, arbitrumGasToken]);
};
