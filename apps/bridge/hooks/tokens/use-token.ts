import { Address } from "viem";

import { useConfigState } from "@/state/config";

import { useFromChain, useToChain } from "../use-chain";
import { useActiveTokens } from "./use-active-tokens";

export const getTokenId = (addr1: Address, addr2: Address) => {
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
    return tokens[0];
  }

  return (
    tokens.find((x) => {
      const fromToken = x[from?.id ?? 0]?.address;
      const toToken = x[to?.id ?? 0]?.address;
      if (!fromToken || !toToken) {
        return false;
      }

      return getTokenId(fromToken, toToken) === tokenId;
    }) ??
    tokens[0] ??
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
