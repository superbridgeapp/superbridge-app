import { useConfigState } from "@/state/config";
import { isEth } from "@/utils/tokens/is-eth";

import { useFromChain, useToChain } from "../use-chain";
import { useActiveTokens } from "./use-active-tokens";

export const getTokenId = (addr1: string, addr2: string) => {
  return addr1.toLowerCase() > addr2.toLowerCase()
    ? `${addr1.toLowerCase()}-${addr2.toLowerCase()}`
    : `${addr2.toLowerCase()}-${addr1.toLowerCase()}`;
};

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
      const fromToken = x[from?.id ?? 0]?.address;
      const toToken = x[to?.id ?? 0]?.address;
      if (!fromToken || !toToken) {
        return false;
      }

      return getTokenId(fromToken, toToken) === tokenId;
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
