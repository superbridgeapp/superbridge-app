import { useConfigState } from "@/state/config";
import { isNativeToken } from "@/utils/is-eth";

import { useAllTokens } from "./use-tokens";

export const useToggleWithdrawing = () => {
  const tokens = useAllTokens();

  const nft = useConfigState.useNft();
  const setToken = useConfigState.useSetToken();
  const toggle = useConfigState.useToggleWithdrawing();

  return () => {
    toggle();
    if (nft) {
      setToken(tokens.find((x) => isNativeToken(x))!);
    }
  };
};
