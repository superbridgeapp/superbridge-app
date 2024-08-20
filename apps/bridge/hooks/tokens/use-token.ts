import { Address, isAddressEqual } from "viem";

import { useConfigState } from "@/state/config";
import { isEth } from "@/utils/tokens/is-eth";

import { useFromChain, useToChain } from "../use-chain";
import { useActiveTokens } from "./use-active-tokens";

export const useMultichainToken = () => {
  const tokens = useActiveTokens();
  const tokenId = useConfigState.useTokenId();
  const to = useToChain();
  const from = useFromChain();

  if (!tokenId) {
    return (
      tokens.data?.find(
        (x) => isEth(x[from?.id ?? 0] ?? null) || isEth(x[to?.id ?? 0] ?? null)
      ) ||
      tokens.data?.[0] ||
      null
    );
  }

  return (
    tokens.data?.find((x) => {
      for (const { address } of Object.values(x)) {
        if (isAddressEqual(address, tokenId as Address)) {
          return x;
        }
      }
    }) ??
    tokens.data?.[0] ??
    null
  );
};

export const useSelectedToken = () => {
  const token = useMultichainToken();
  const from = useFromChain();

  if (!token) {
    return null;
  }

  return token[from?.id ?? 0] ?? null;
};

export const useDestinationToken = () => {
  const token = useMultichainToken();
  const to = useToChain();

  return token?.[to?.id ?? 0] ?? null;
};
