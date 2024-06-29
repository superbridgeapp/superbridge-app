import { useConfigState } from "@/state/config";

import { useFromChain } from "./use-chain";

export const useSelectedToken = () => {
  const token = useConfigState.useToken();
  const from = useFromChain();

  if (!token) {
    return null;
  }

  return token[from?.id ?? 0] ?? null;
};
