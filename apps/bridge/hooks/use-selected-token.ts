import { useConfigState } from "@/state/config";

import { useFromChain, useToChain } from "./use-chain";

export const useSelectedToken = () => {
  const token = useConfigState.useToken();
  const from = useFromChain();

  if (!token) {
    return null;
  }

  return token[from?.id ?? 0] ?? null;
};

export const useDestinationToken = () => {
  const token = useConfigState.useToken();
  const to = useToChain();

  return token?.[to?.id ?? 0] ?? null;
};
