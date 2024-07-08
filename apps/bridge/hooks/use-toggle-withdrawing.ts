import { trackEvent } from "@/services/ga";
import { useConfigState } from "@/state/config";
import { isNativeToken } from "@/utils/is-eth";

import { useDeployment } from "./use-deployment";
import { useAllTokens } from "./use-tokens";

export const useToggleWithdrawing = () => {
  const tokens = useAllTokens();

  const deployment = useDeployment();
  const nft = useConfigState.useNft();
  const withdrawing = useConfigState.useWithdrawing();
  const setToken = useConfigState.useSetToken();
  const toggle = useConfigState.useToggleWithdrawing();

  return () => {
    toggle();
    trackEvent({
      event: withdrawing ? "click-deposit" : "click-withdraw",
      name: deployment?.name ?? "",
    });
    if (nft) {
      setToken(tokens.find((x) => isNativeToken(x))!);
    }
  };
};
