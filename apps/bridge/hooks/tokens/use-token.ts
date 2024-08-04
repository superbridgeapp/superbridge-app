import { Address } from "viem";

import { useConfigState } from "@/state/config";

import { useFromChain, useToChain } from "../use-chain";
import { useActiveTokens } from "./use-active-tokens";

export const getTokenId = (addr1: Address, addr2: Address) => {
  return addr1 > addr2 ? `${addr1}-${addr2}` : `${addr2}-${addr1}`;
};

export const useMultichainToken = () => {
  const tokens = useActiveTokens();
  const tokenId = useConfigState.useTokenId();
  const to = useToChain();
  const from = useFromChain();

  if (!tokenId || !to || !from) {
    return tokens[0];
  }

  return (
    tokens.find(
      (x) => getTokenId(x[from?.id]!.address, x[to?.id]!.address) === tokenId
    ) ??
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
