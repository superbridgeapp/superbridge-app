import { useChain, useFromChain, useToChain } from "../use-chain";

export function useNativeTokenForChainId(chainId: number | undefined) {
  return useChain(chainId)?.nativeCurrency;
}

export function useNativeToken() {
  const from = useFromChain();
  return useNativeTokenForChainId(from?.id);
}

export function useToNativeToken() {
  const to = useToChain();

  return useNativeTokenForChainId(to?.id);
}
