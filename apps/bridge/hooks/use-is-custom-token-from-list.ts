import { useFromChain, useToChain } from "@/hooks/use-chain";
import { useConfigState } from "@/state/config";
import { MultiChainToken } from "@/types/token";

export const useIsCustomTokenFromList = (token: MultiChainToken | null) => {
  const from = useFromChain();
  const to = useToChain();
  const tokensImportedFromLists = useConfigState.useTokensImportedFromLists();

  const t = tokensImportedFromLists.find(
    (x) =>
      x.startsWith(
        `${token?.[from?.id ?? 0]?.address.toLowerCase()}-${from?.id}`
      ) ||
      x.startsWith(`${token?.[from?.id ?? 0]?.address.toLowerCase()}-${to?.id}`)
  );
  if (t) return t.split(":")[1];
};
