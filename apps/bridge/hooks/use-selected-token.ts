import { useConfigState } from "@/state/config";

import { useFromChain } from "./use-chain";
import { useDeployment } from "./use-deployment";

export const useSelectedToken = () => {
  const deployment = useDeployment();
  const token = useConfigState.useToken();
  const from = useFromChain();

  if (!token || !deployment) {
    return null;
  }

  return token[from?.id ?? 0] ?? null;
};
