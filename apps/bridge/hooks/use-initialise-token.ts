import { useRouter } from "next/router";
import { useEffect } from "react";
import { isAddress, isAddressEqual } from "viem";

import { configurations } from "@/config/contract-addresses";
import { useConfigState } from "@/state/config";
import { isNativeToken } from "@/utils/is-eth";

import { useGasToken } from "./use-approve-gas-token";
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
  const toggleWithdrawing = useConfigState.useToggleWithdrawing();
  const fast = useConfigState.useFast();
  const deployment = useDeployment();
  const tokens = useAllTokens();
  const arbitrumGasToken = useGasToken();

  useEffect(() => {
    if (!tokens.length) {
      return;
    }

    if (fast) {
      setToken(tokens.find((x) => isNativeToken(x))!);
      return;
    }

    if (!deployment) {
      return;
    }
    const [nameOrToken, nameOrTokenOrUndefined]: (string | undefined)[] =
      router.asPath.split(/[?\/]/).filter(Boolean);

    const token = tokens.find((x) => {
      const l1 = x[deployment.l1.id];
      const l2 = x[deployment.l2.id];
      if (!l1 || !l2) {
        return;
      }

      if (nameOrTokenOrUndefined) {
        if (isAddress(nameOrTokenOrUndefined)) {
          return (
            isAddressEqual(nameOrTokenOrUndefined, l1.address) ||
            isAddressEqual(nameOrTokenOrUndefined, l2.address)
          );
        }
        return nameOrTokenOrUndefined.toLowerCase() === l1.symbol.toLowerCase();
      }

      if (nameOrToken) {
        if (isAddress(nameOrToken)) {
          return (
            isAddressEqual(nameOrToken, l1.address) ||
            isAddressEqual(nameOrToken, l2.address)
          );
        }
        return nameOrToken.toLowerCase() === l1.symbol.toLowerCase();
      }
    });

    if (token) {
      setToken(token);
      if (
        (isAddress(nameOrTokenOrUndefined) &&
          isAddressEqual(
            token[deployment.l2.id]!.address,
            nameOrTokenOrUndefined
          )) ||
        (isAddress(nameOrToken) &&
          isAddressEqual(token[deployment.l2.id]!.address, nameOrToken))
      ) {
        toggleWithdrawing();
      }
    } else {
      if (arbitrumGasToken) {
        setToken(arbitrumGasToken);
        return;
      }

      const t = tokens.find((x) => isNativeToken(x));
      if (t) {
        setToken(t);

        if (!configurations[deployment.name]) {
          setEasyMode(false);
        }
      }
    }
  }, [router.asPath, deployment, tokens, arbitrumGasToken, fast]);
};
