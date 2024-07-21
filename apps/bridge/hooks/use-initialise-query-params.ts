import { useRouter } from "next/router";
import { useEffect } from "react";
import { isAddress, isAddressEqual } from "viem";

import { isSuperbridge } from "@/config/superbridge";
import { useConfigState } from "@/state/config";
import { useInjectedStore } from "@/state/injected";
import { isNativeToken } from "@/utils/is-eth";

import { useGasToken } from "./use-approve-gas-token";
import { useFromChain, useToChain } from "./use-chain";
import { useDeployment } from "./use-deployment";
import { useAllTokens } from "./use-tokens";

export const useInitialiseQueryParams = () => {
  const router = useRouter();

  const setToken = useConfigState.useSetToken();
  const setRawAmount = useConfigState.useSetRawAmount();
  const setFromChainId = useInjectedStore((s) => s.setFromChainId);
  const setToChainId = useInjectedStore((s) => s.setToChainId);
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

    // legacy setup was to have superbridge.app/network/token or mybridge.com/token.

    const isLegacyRouteParams = !!nameOrToken || !!nameOrTokenOrUndefined;

    const amount = router.query.amount as string | undefined;
    if (amount && parseFloat(amount)) {
      setRawAmount(amount);
    }

    const fromChainId = router.query.fromChainId as string | undefined;
    if (fromChainId) {
      setFromChainId(parseInt(fromChainId));
    }

    const toChainId = router.query.toChainId as string | undefined;
    if (toChainId) {
      setToChainId(parseInt(toChainId));
    }

    const tokenAddress = router.query.tokenAddress as string | undefined;

    if (tokenAddress) {
      const token = tokens.find((x) => {
        const fromToken = x[from.id];
        if (!fromToken) {
          return false;
        }

        if (isAddress(tokenAddress)) {
          return isAddressEqual(tokenAddress, fromToken.address);
        }
      });
      if (token) {
        setToken(token);
      }
    }

    if (isSuperbridge && isLegacyRouteParams) {
      // const direction = router.query.direction as string | undefined;
      // if (direction === "withdraw") {
      // }

      const token = tokens.find((x) => {
        const fromToken = x[from.id];
        const toToken = x[to.id];
        if (!fromToken || !toToken) {
          return;
        }

        const direction = router.query.direction as string | undefined;
        const token = direction === "withdraw" ? toToken : fromToken;

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

      if (token) {
        setToken(token);
      } else {
        if (arbitrumGasToken) {
          setToken(arbitrumGasToken);
          return;
        }

        const t = tokens.find((x) => isNativeToken(x));
        if (t) {
          setToken(t);
        }
      }
    }
  }, [router.asPath, deployment, tokens, arbitrumGasToken]);
};
