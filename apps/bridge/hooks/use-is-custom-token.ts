import { useFromChain } from "@/hooks/use-chain";
import { useSettingsState } from "@/state/settings";
import { MultiChainToken } from "@/types/token";

export const useIsCustomToken = (token: MultiChainToken | null) => {
  const from = useFromChain();
  const customTokens = useSettingsState.useCustomTokens();

  return !!customTokens.find(
    (x) => x[from?.id ?? 0]?.address === token?.[from?.id ?? 0]?.address
  );
};
