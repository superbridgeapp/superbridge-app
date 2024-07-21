import { useRouter } from "next/router";
import { useEffect } from "react";
import { isAddress, isAddressEqual } from "viem";

import { useConfigState } from "@/state/config";

import { useGasToken } from "./use-approve-gas-token";
import { useFromChain, useToChain } from "./use-chain";
import { useDeployment } from "./use-deployment";
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
  const router = useRouter();

  const setToken = useConfigState.useSetToken();
  const setEasyMode = useConfigState.useSetEasyMode();
  const deployment = useDeployment();
  const from = useFromChain();
  const to = useToChain();
  const tokens = useAllTokens();
  const arbitrumGasToken = useGasToken();

  useEffect(() => {
    if (!tokens.length || !from || !to) {
      return;
    }

    const [nameOrToken, nameOrTokenOrUndefined]: (string | undefined)[] =
      router.asPath.split(/[?\/]/).filter(Boolean);

    const token = tokens.find((x) => {
      const l1 = x[from.id];
      const l2 = x[to.id];
      if (!l1 || !l2) {
        return;
      }

      const direction = router.query.direction as string | undefined;
      const token = direction === "withdraw" ? l2 : l1;

      if (nameOrTokenOrUndefined) {
        if (isAddress(nameOrTokenOrUndefined)) {
          return isAddressEqual(nameOrTokenOrUndefined, token.address);
        }
        return (
          nameOrTokenOrUndefined.toLowerCase() === token.symbol.toLowerCase()
        );
      }

      if (nameOrToken) {
        if (isAddress(nameOrToken)) {
          return isAddressEqual(nameOrToken, token.address);
        }
        return nameOrToken.toLowerCase() === token.symbol.toLowerCase();
      }
    });

    // if (token) {
    //   setToken(token);
    //   if (
    //     (isAddress(nameOrTokenOrUndefined) &&
    //       isAddressEqual(
    //         token[deployment.l2.id]!.address,
    //         nameOrTokenOrUndefined
    //       )) ||
    //     (isAddress(nameOrToken) &&
    //       isAddressEqual(token[deployment.l2.id]!.address, nameOrToken))
    //   ) {
    //   }
    // } else {
    //   if (arbitrumGasToken) {
    //     setToken(arbitrumGasToken);
    //     return;
    //   }

    //   const t = tokens.find((x) => isNativeToken(x));
    //   if (t) {
    //     setToken(t);

    //     if (!configurations[deployment.name]) {
    //       setEasyMode(false);
    //     }
    //   }
    // }
  }, [router.asPath, deployment, tokens, arbitrumGasToken]);
};
